import { Request } from 'express'
import { Types } from 'mongoose'

export type Role = 'buyer' | 'vendor' | 'admin'

export type GroupStatus = 'open' | 'filled' | 'purchased' | 'delivered' | 'cancelled'

export interface AuthPayload {
    userId: string,
    role: Role
}

export interface AuthRequest extends Request {
    user?: AuthPayload
}

export interface GroupFilter {
    status?: GroupStatus
    location?: RegExp
    deadline?: { $gt: Date }
    targetQuantity?: { $gte?: number, $lte?: number }
}

export interface IUser {
    _id: Types.ObjectId,
    name: string,
    email: string,
    password: string,
    role: Role,
    location: string,
    phone?: string,
    isVerified: boolean,
    verificationToken?: string
    verificationTokenExpires?: Date,
    createdAt: Date,
    updatedAt: Date,
    comparePassword(candidate: string): Promise<boolean>
    createJWT(): string
}

export interface IProduct {
    _id: Types.ObjectId,
    vendor: Types.ObjectId,
    name: string,
    description: string,
    category: string,
    image: string,
    unitPrice: number,
    minQuantity: number,
    unit: string,
    available: boolean,
    createdAt: Date,
    updatedAt: Date 
}

export interface MemberShape {
    user: Types.ObjectId,
    quantity: number,
    paid: boolean,
    paymentRef?: string   
}

export interface IGroup {
    _id: Types.ObjectId,
    product: Types.ObjectId,
    creator: Types.ObjectId,
    targetQuantity: number,
    currentQuantity: number,
    pricePerUnit: number,
    status: GroupStatus,
    deadline: Date,
    location: string,
    members: MemberShape[],
    createdAt: Date,
    updatedAt: Date
}