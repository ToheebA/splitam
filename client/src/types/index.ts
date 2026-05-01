export type Role = 'buyer' | 'vendor' | 'admin';

export type GroupStatus = 'open' | 'filled' | 'purchased' | 'delivered' | 'cancelled';

export interface AuthResponse {
    user: User,
    token: string
}

export interface DecodedToken {
    userId: string,
    role: Role,
    name: string,
    exp: number
}

export interface AuthContextType {
    user: User | null,
    token: string | null,
    login: (token: string, user: User) => void,
    logout: () => void
}

export interface RegisterData {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: Role,
    location: string,
    phone?: string
}

export interface LoginData {
    email: string,
    password: string
}

export interface User {
    _id: string,
    name: string,
    email: string,
    role: Role,
    location: string,
    phone?: string,
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export interface Product {
     _id: string
    vendor: string | User,
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

export interface GroupMember {
    user: string | User,
    quantity: number,
    paid: boolean,
    paymentRef?: string
}

export interface Group {
    _id: string,
    product: string | Product,
    creator: string | User,
    targetQuantity: number,
    currentQuantity: number,
    pricePerUnit: number,
    status: GroupStatus,
    deadline: Date,
    location: string,
    members: GroupMember[],
    createdAt: Date,
    updatedAt: Date
}

export interface CreateGroupData {
    productId: string,
    targetQuantity: number,
    quantity: number,
    deadline: string,
    location: string
}