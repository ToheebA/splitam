import { Request, Response } from 'express';
import { AuthRequest } from '../types/index';
import { BadRequestError, UnauthenticatedError } from '../errors';
import Product from '../models/Product';
import Group from '../models/Group';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

const createGroup = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        throw new UnauthenticatedError('Authentication required');
    }
    
    const { productId, targetQuantity, deadline, location, quantity } = req.body;

    if (!productId || !targetQuantity || !deadline || !location) {
        throw new BadRequestError('Missing required fields');
    }

    if (new Date(deadline) <= new Date()) {
        throw new BadRequestError('Deadline must be a future date');
    }

    const product = await Product.findById(productId);
    if (!product || !product.available) {
        throw new BadRequestError('Product not found or not available for group buying');
    }

    const memberQuantity: number = quantity || 1;
    if (memberQuantity > targetQuantity) {
        throw new BadRequestError('Your quantity cannot exceed the target quantity');
    }
    const group = await Group.create({
        product: productId,
        creator: req.user.userId,
        currentQuantity: memberQuantity,
        targetQuantity,
        pricePerUnit: product.unitPrice,
        deadline,
        location,
        status: 'open',
        members: [{
            user: req.user.userId,
            quantity: memberQuantity,
        }]
    })

    res.status(StatusCodes.CREATED).json(group);
}

const getAllGroups = async (req: Request, res: Response) => {
    const {
        status,
        location,
        minTarget,
        maxTarget,
        sort = '-createdAt',
        page = 1,
        limit = 20,
        includeExpired = 'false'
    } = req.query;

    const filter: any = {};

    if (status) {
        filter.status = status;
    }

    if (location) {
        filter.location = new RegExp(location as string, 'i');
    }

    if (minTarget || maxTarget) {
        filter.targetQuantity = {};
        if (minTarget) {
            filter.targetQuantity.$gte = Number(minTarget);
        }
        if (maxTarget) {
            filter.targetQuantity.$lte = Number(maxTarget);
        }
    }

    if (includeExpired !== 'true') {
        filter.deadline = { $gt: new Date() };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [groups, total] = await Promise.all([
        Group.find(filter)
            .populate('product', 'name unitPrice image')
            .populate('creator', 'name email')
            .sort(sort as string)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Group.countDocuments(filter)
    ])

    res.status(StatusCodes.OK).json({
        success: true,
        count: groups.length,
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        groups
    });
};

const joinGroup = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        throw new UnauthenticatedError('Authentication required');
    }

    const { quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new BadRequestError('Quantity must be a positive integer');
    }

    const { id: groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
        throw new BadRequestError('Group does not exist');
    }
    if (group.status !== 'open') {
        throw new BadRequestError('Group is not open');
    }
    if (new Date(group.deadline) <= new Date()) {
        throw new BadRequestError('Group is no longer available');
    }
    const isMember = group.members.some(
        (member) => member.user.toString() === req.user!.userId
    );
    if (isMember) {
        throw new BadRequestError('You are already a member of this group');
    }

    const updatedGroup = await Group.findOneAndUpdate(
        {
            _id: groupId,
            status: 'open',
            deadline: { $gt: new Date() },
            'members.user': { $ne: new mongoose.Types.ObjectId(req.user.userId) },
            $expr: { $lte: [{ $add: ['$currentQuantity', quantity] }, '$targetQuantity'] }
        },
        {
            $push: { members: { user: req.user.userId, quantity } },
            $inc: { currentQuantity: quantity }
        },
        { new: true, runValidators: true }
    );

    if (updatedGroup) {
        if (updatedGroup.currentQuantity === updatedGroup.targetQuantity) {
            updatedGroup.status = 'filled';
            await updatedGroup.save();
        }
    }

    if (!updatedGroup) {
        const freshGroup = await Group.findById(groupId);
        if (!freshGroup) {
            throw new BadRequestError('Group no longer exists');
        }
        const alreadyMember = freshGroup.members.some(
            m => m.user.toString() === req.user!.userId
        );
        if (alreadyMember) {
            throw new BadRequestError('You are already a member of this group');
        }
        if (freshGroup.status !== 'open' || new Date(freshGroup.deadline) <= new Date()) {
            throw new BadRequestError('Group is no longer available');
        }
        if (freshGroup.currentQuantity + quantity > freshGroup.targetQuantity) {
            throw new BadRequestError(
                `Cannot add ${quantity}. Only ${freshGroup.targetQuantity - freshGroup.currentQuantity} units remaining.`
            );
        }
        throw new BadRequestError('Unable to join group. Please try again.');
    }

    res.status(StatusCodes.OK).json(updatedGroup);
};

export {
    createGroup,
    getAllGroups,
    joinGroup
}