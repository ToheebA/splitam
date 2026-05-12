import { Request, Response } from "express";
import { AuthRequest, UserFilter, Role } from "../types";
import User from "../models/User";
import Product from "../models/Product";
import Group from "../models/Group";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";

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

const deleteUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params

    if (id === req.user?.userId) {
        throw new BadRequestError('You cannot delete your own account')
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
        throw new NotFoundError('User not found')
    }

    res.status(StatusCodes.OK).json({ message: 'User deleted successfully' })
}

export { 
    getStats,
    getAllUsers,
    deleteUser
}