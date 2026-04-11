import mongoose from 'mongoose';
import { IGroup } from '../types/index'

const GroupSchema = new mongoose.Schema<IGroup>({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetQuantity: {
        type: Number,
        required: true
    },
    currentQuantity: {
        type: Number,
        default: 0
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'filled', 'purchased', 'delivered', 'cancelled'],
        default: 'open'
    },
    deadline: {
        type: Date,
        required: true
    },
    location: { 
        type: String,
        required: [true, 'Please provide a location'],
        trim: true
    },
    members: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            quantity: { type: Number, required: true },
            paid: { type: Boolean, default: false },
            paymentRef: String,
        }
    ],
}, { timestamps: true })

export default mongoose.model<IGroup>('Group', GroupSchema)