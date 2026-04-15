import { AuthRequest } from "../types/index";
import { Request, Response } from "express";
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index";
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

const getAllProducts = async (req: Request, res: Response) => {
    const products = await Product.find({ available: true })
        .populate("vendor", "name location")
    res.status(StatusCodes.OK).json({ products })
}

const getProduct = async (req: Request, res: Response) => {
    const { id: productId } = req.params
    const product = await Product.findById(productId)
        .populate("vendor", "name location")
    if (!product) {
        throw new NotFoundError('Product not found');
    }
    res.status(StatusCodes.OK).json({ product })
}