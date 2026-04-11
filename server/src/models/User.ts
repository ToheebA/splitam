import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/index'

const UserSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['buyer', 'vendor', 'admin'],
        default: 'buyer',
    },
    location: { 
        type: String,
        required: [true, 'Please provide a location'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name, role: this.role }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: process.env.JWT_LIFETIME || '1d' } as jwt.SignOptions);
}

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

export default mongoose.model<IUser>('User', UserSchema);