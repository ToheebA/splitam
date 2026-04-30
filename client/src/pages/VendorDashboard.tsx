import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/products"
import type { Product } from "../types/index"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useAuth } from "../context/AuthContext" 
import toast from 'react-hot-toast'

type modifiedProduct = Omit<Product, '_id' | 'vendor' | 'createdAt' | 'updatedAt'>

const VendorDashboard = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [showCreateForm, setShowCreateForm] = useState(false)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', user?.userId],
        queryFn: () => getProducts({ vendor: user?.userId as string }),
        enabled: !!user?.userId
    })

    const initialFormState = {
        name: '',
        description: '',
        category: '',
        unitPrice: 0,
        minQuantity: 0,
        unit: '',
        image: '',
        available: true
    }

    const [productForm, setProductForm] = useState<modifiedProduct>(initialFormState)

    const { mutate: createProductMutation } = useMutation({
        mutationFn: (data: modifiedProduct & { vendor: string }) => createProduct(data),
        onSuccess: () => {
            toast.success('Product created')
            queryClient.invalidateQueries({ queryKey: ['products', user?.userId] })
            setShowCreateForm(false)
            setProductForm(initialFormState)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to create product')
        }
    })

    const { mutate: updateProductMutation } = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<modifiedProduct> }) => updateProduct(id, data),
        onSuccess: () => {
            toast.success('Product updated')
            queryClient.invalidateQueries({ queryKey: ['products', user?.userId] })
            setEditingProduct(null)
        },
        onError: (error: any) =>
            toast.error(error.response?.data?.msg || 'Update failed')
    })

    const { mutate: deleteProductMutation } = useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onSuccess: () => {
            toast.success('Product deleted')
            queryClient.invalidateQueries({ queryKey: ['products', user?.userId] })
        },
        onError: (error: any) => toast.error(error.response?.data?.msg || 'Delete failed')
    })


    const handleSubmit = (e: React.FormEvent) => {
        console.log('current user:', user)
        e.preventDefault()
        if (!user?.userId) {
            toast.error('You must be logged in');
            return;
        }
        createProductMutation({ ...productForm, vendor: user?.userId })
    }

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingProduct) return
        updateProductMutation({ id: editingProduct._id, data: productForm })
    }

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Something went wrong</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">My Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}</p>
                </div>
                <button
                    onClick={() => { setShowCreateForm(true); setEditingProduct(null); setProductForm(initialFormState)}} 
                    className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
                >
                    + Create Product
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.data?.products.map((product: Product) => 
                    <div key={product._id} className="bg-white border border-gray-100 rounded-xl p-5">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.available ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {product.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                        <p className="text-sm text-gray-500 mb-4">₦{product.unitPrice} / {product.unit} · Min {product.minQuantity}</p>
                        <div className="flex gap-2 border-t border-gray-100 pt-3">
                            <button
                                className="text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                                onClick={() => {
                                    setEditingProduct(product)
                                    setShowCreateForm(false)
                                    setProductForm({
                                        name: product.name,
                                        description: product.description,
                                        category: product.category,
                                        unitPrice: product.unitPrice,
                                        minQuantity: product.minQuantity,
                                        unit: product.unit,
                                        image: product.image,
                                        available: product.available
                                    })
                                }}
                            >
                                    Edit Product
                            </button>
                            <button
                                className="text-sm text-red-600 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50" 
                                onClick={() => deleteProductMutation(product._id)}
                            >
                                    Delete Product
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold">Create Product</h2>
                            <button type="button" onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">    
                            <label className="text-sm text-gray-500">Name</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.name}
                                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Description</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.description}
                                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Category</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.category}
                                onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Unit Price</label>
                            <input 
                                type='number'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.unitPrice}
                                onChange={(e) => setProductForm(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Minimum Quantity</label>
                            <input 
                                type='number'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.minQuantity}
                                onChange={(e) => setProductForm(prev => ({ ...prev, minQuantity: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Unit</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.unit}
                                onChange={(e) => setProductForm(prev => ({ ...prev, unit: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Product Image</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.image}
                                onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-gray-500">
                            <input
                                type="checkbox"
                                checked={productForm.available}
                                onChange={(e) => setProductForm(prev => ({ ...prev, available: e.target.checked }))}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            Available
                        </label>
                        <div className="flex gap-2 justify-end mt-2">
                            <button 
                                type='button' 
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 text-sm border border-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button type='submit' className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800">Create</button>
                        </div>
                    </form>
                    </div>
                </div>
            )}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-semibold">Edit Product</h2>
                        <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">    
                            <label className="text-sm text-gray-500">Name</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.name}
                                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Description</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.description}
                                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Category</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.category}
                                onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Unit Price</label>
                            <input 
                                type='number'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.unitPrice}
                                onChange={(e) => setProductForm(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Minimum Quantity</label>
                            <input 
                                type='number'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.minQuantity}
                                onChange={(e) => setProductForm(prev => ({ ...prev, minQuantity: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Unit</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.unit}
                                onChange={(e) => setProductForm(prev => ({ ...prev, unit: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Product Image</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={productForm.image}
                                onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-gray-500">
                            <input
                                type="checkbox"
                                checked={productForm.available}
                                onChange={(e) => setProductForm(prev => ({ ...prev, available: e.target.checked }))}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            Available
                        </label>
                        <div className="flex gap-2 justify-end mt-2">
                            <button 
                                type='button' 
                                onClick={() => setEditingProduct(null)}
                                className="px-4 py-2 text-sm border border-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button type='submit' className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800">Save Changes</button>
                        </div>
                    </form>
                    </div>
                </div>
            )} 
        </div>
    )
}
export default VendorDashboard