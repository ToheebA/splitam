import { AuthRequest, UserFilter, Role } from "../types";
import { Response } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";

const getAllUsers = async (req: AuthRequest, res: Response) => {
    const { role } = req.query

    const filter: UserFilter = {}

    if (role) {
        filter.role = role as Role
    }

    const users = await User.find(filter).select('-password')

    res.status(StatusCodes.OK).json({ users })
} 

export { getAllUsers }