import { Request, Response } from 'express';
import { AuthRequest } from '../types/index';
import { BadRequestError, UnauthenticatedError } from '../errors';
import Product from '../models/Product';
import Group from '../models/Group';
import { StatusCodes } from 'http-status-codes';

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


    const memberQuantity = quantity || 1;
    const group = await Group.create({
        product: productId,
        creator: req.user.userId,
        currentQuantity: memberQuantity,
        targetQuantity,
        pricePerUnit: product.unitPrice,
        deadline,
        location,
        members: [{
            user: req.user.userId,
            quantity: memberQuantity,
        }]
    })

    res.status(StatusCodes.CREATED).json(group);
}