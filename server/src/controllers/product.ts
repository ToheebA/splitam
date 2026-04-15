import { AuthRequest } from "../types/index";
import { Response } from "express";
import { BadRequestError, UnauthenticatedError } from "../errors/index";
import Product from "../models/Product";
import { StatusCodes } from "http-status-codes";

const createProduct = async (req: AuthRequest, res: Response) => {
    const { name, description, category, unitPrice, minQuantity, unit } = req.body;
    if (!name || !description || !category || !unitPrice) {
        throw new BadRequestError('Missing required fields');
    }
    if (!req.user) {
        throw new UnauthenticatedError('Authentication required');
    }

    const product = await Product.create({ 
        vendor: req.user.userId, 
        name, 
        description, 
        category, 
        unitPrice, 
        minQuantity, 
        unit 
    });
    res.status(StatusCodes.CREATED).json({ product });
}