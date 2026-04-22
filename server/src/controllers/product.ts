import { AuthRequest } from "../types/index";
import { Request, Response } from "express";
import { BadRequestError, UnauthenticatedError, NotFoundError, ForbiddenError } from "../errors/index";
import Product from "../models/Product";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const createProduct = async (req: AuthRequest, res: Response) => {
    const { name, description, category, unitPrice, minQuantity, unit } = req.body;
    if (!name || !description || !category || !unitPrice) {
        throw new BadRequestError('Missing required fields');
    }
    if (!req.user) {
        throw new UnauthenticatedError('Authentication required');
    }

    const product = await Product.create({ 
        vendor: new mongoose.Types.ObjectId(req.user.userId), 
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

const updateProduct = async (req: AuthRequest, res: Response) => {
    const { id: productId } = req.params
    if (!req.user) {
        throw new UnauthenticatedError('Authentication required');
    }
    const product = await Product.findById(productId)
    if (!product) {
        throw new NotFoundError('Product not found');
    }
    if (product.vendor.toString() !== req.user.userId) {
        throw new ForbiddenError('Not authorized to update this product');
    }
    const { name, description, category, unitPrice, minQuantity, unit, available } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (unitPrice !== undefined) product.unitPrice = unitPrice;
    if (minQuantity !== undefined) product.minQuantity = minQuantity;
    if (unit !== undefined) product.unit = unit;
    if (available !== undefined) product.available = available;
    await product.save();
    res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req: AuthRequest, res: Response) => {
    const { id: productId } = req.params
    if (!req.user) {
        throw new UnauthenticatedError('Authentication required');
    }
    const product = await Product.findById(productId)
    if (!product) {
        throw new NotFoundError('Product not found');
    }
    if (product.vendor.toString() !== req.user.userId) {
        throw new ForbiddenError('Not authorized to delete this product');
    }
    await Product.findByIdAndDelete(productId);
    res.status(StatusCodes.OK).json({ message: 'Product deleted successfully' });
}

export { 
    createProduct, 
    getAllProducts, 
    getProduct, 
    updateProduct, 
    deleteProduct 
}