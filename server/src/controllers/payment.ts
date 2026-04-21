import { Response } from 'express';
import { AuthRequest, IUser } from '../types';
import { UnauthenticatedError, NotFoundError, BadRequestError } from '../errors';
import Group from '../models/Group';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';


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

export { initializePayment }