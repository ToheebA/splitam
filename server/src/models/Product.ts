import mongoose from "mongoose";
import { IProduct } from '../types/index'

const ProductSchema = new mongoose.Schema<IProduct>({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    unitPrice: {
        type: Number,
        required: true
    },
    minQuantity: {
        type: Number,
        default: 1
    },
    unit: {
        type: String,
        default: 'kg'
    },
    available: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export default mongoose.model<IProduct>('Product', ProductSchema)