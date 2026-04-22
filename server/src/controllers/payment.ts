import { Request, Response } from 'express';
import { AuthRequest, IUser } from '../types';
import { UnauthenticatedError, NotFoundError, BadRequestError } from '../errors';
import Group from '../models/Group';
import Product from '../models/Product';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import { getIO } from '../config/socket';
import { sendGroupPurchasedEmail } from '../utils/email';


const initializePayment = async (req: AuthRequest, res: Response) => {
    const reference = crypto.randomBytes(16).toString('hex');

    const { id } = req.params;

    if (!req.user) {
        throw new UnauthenticatedError('Authentication required');
    }
    const userId = req.user.userId;

    const group = await Group.findById(id)
        .populate('members.user', 'email');
    if (!group) {
        throw new NotFoundError('Group not found');
    }
    if (group.status !== 'filled') {
        throw new BadRequestError('Group is not ready for payment');
    }
    
    const member = group.members.find(m => m.user.toString() === userId);
    if (!member) {
        throw new BadRequestError('You are not a member of this group');
    }

    if (member.paid) {
        throw new BadRequestError('You have already paid for this group');
    }

    const email = (member.user as unknown as IUser).email;

    const amount = member.quantity * group.pricePerUnit;

    member.paymentRef = reference;
    await group.save();

    const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
            email: email,
            amount: amount * 100,
            reference: reference,
            metadata: {
                groupId: id,
                userId: userId
            }
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    )

    res.status(StatusCodes.OK).json({
        authorizationUrl: response.data.data.authorization_url,
    })
}

const paystackWebhook = async (req: Request, res: Response) => {
    const hash = crypto
        .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
        .update(req.body)
        .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid signature' })
    }

    const event = JSON.parse(req.body.toString())

    if (event.event !== 'charge.success') {
        return res.status(StatusCodes.OK).send();
    }

    const { groupId, userId } = event.data.metadata;

    const group = await Group.findById(groupId);

    if (!group) {
        return res.status(StatusCodes.OK).send()
    }

    const updatedGroup = await Group.findOneAndUpdate(
        { _id: groupId, 'members.user': userId },
        { $set: { 'members.$.paid': true } },
        { new: true }
    )
    if (!updatedGroup) {
        return res.status(StatusCodes.OK).send()
    }

    const allPaid = updatedGroup.members.every(m => m.paid);
    if (allPaid) {
        updatedGroup.status = 'purchased';
        await updatedGroup.save();
        const productId = updatedGroup.product.toString();
        const product = await Product.findById(productId).populate('vendor', 'email name')
        if (!product) {
            throw new NotFoundError('Product not found');
        }
        const vendor = product.vendor as unknown as IUser
        const vendorId = vendor._id.toString()
        const vendorEmail = vendor.email
        getIO().to(vendorId).emit('groupPurchased', { groupId: updatedGroup._id.toString() });
        await sendGroupPurchasedEmail(vendorEmail, product.name);
    }

    res.status(StatusCodes.OK).send()
}

export { 
    initializePayment, 
    paystackWebhook 
};