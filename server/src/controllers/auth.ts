import { Request, Response } from 'express';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User';
import { UnauthenticatedError, ForbiddenError, NotFoundError, BadRequestError } from '../errors';
import { sendVerificationEmail } from '../utils/email';

const register = async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword, role, location, phone } = req.body;

    if (!name || !email || !password || !confirmPassword || !location) {
        throw new BadRequestError('Please provide all required fields')
    }
    if (password !== confirmPassword) {
        throw new BadRequestError('Passwords do not match')
    }
    if (role === 'admin') {
        throw new BadRequestError('Cannot register as admin')
    }

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await User.create({
        name,
        email,
        password,
        role,
        location,
        phone,
        verificationToken,
        verificationTokenExpires: verificationTokenExpiry,
    })

    try {
        await sendVerificationEmail(email, verificationToken)
    } catch {
        await User.findByIdAndDelete(user._id)
        throw new BadRequestError('Failed to send verification email. Please try again.')
    }

    res.status(StatusCodes.CREATED).json({
        msg: 'Registration successful! Please check your email to verify your account.'
    })
}

const verifyEmail = async (req: Request, res: Response) => {
    const  { token } = req.params

    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() }
    })
    
    if (!user) {
        throw new BadRequestError('Invalid or expired verification token')
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    await user.save()

    res.status(StatusCodes.OK).json({ 
        msg: 'Email verified successfully! You can now log in to your account.' 
     })
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    if (!user.isVerified) {
        throw new UnauthenticatedError('Please verify your email before logging in')
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        user: {
            name: user.name,
            role: user.role,
            _id: user._id,
            email: user.email,
            location: user.location,
            phone: user.phone,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        },
        token
    })
}

export { register, verifyEmail, login }