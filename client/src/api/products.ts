import API from "./axios";
import type { Product } from "../types/index";

export const getProducts = (params?: Record<string, string>) => 
    API.get('/products', { params })

export const getProduct = (id: string) => 
    API.get(`/products/${id}`)

export const createProduct = (productData: Omit<Product, '_id' | 'vendor' | 'createdAt' | 'updatedAt'>) =>
    API.post('/products', productData)

export const updateProduct = (id: string, productData: Partial<Omit<Product, '_id' | 'vendor' | 'createdAt' | 'updatedAt'>>) =>
    API.patch(`/products/${id}`, productData)

export const deleteProduct = (id: string) =>
    API.delete(`/products/${id}`)