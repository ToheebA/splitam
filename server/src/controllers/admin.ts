import { Request, Response } from "express";
import { AuthRequest, UserFilter, Role } from "../types";
import User from "../models/User";
import Product from "../models/Product";
import Group from "../models/Group";
import { StatusCodes } from "http-status-codes";

const getStats = async(req: Request, res: Response) => {
    const [totalUsers, totalProducts, totalGroups] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Group.countDocuments()
    ])
    res.status(StatusCodes.OK).json({
        totalUsers,
        totalProducts,
        totalGroups
    })
}

const getAllUsers = async (req: AuthRequest, res: Response) => {
    const { role } = req.query

    const filter: UserFilter = {}

    if (role) {
        filter.role = role as Role
    }

    const users = await User.find(filter).select('-password')

    res.status(StatusCodes.OK).json({ users })
}

export { 
    getStats,
    getAllUsers 
}