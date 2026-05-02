import { getProducts } from "../api/products"
import type { Product } from "../types/index"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import useDebounce from "../hooks/useDebounce"

const BrowseProducts = () => {
    const navigate = useNavigate()
    const [category, setCategory] = useState('')
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', { category, search: debouncedSearch }],
        queryFn: () => getProducts({
            ...(category && { category }),
            ...(debouncedSearch && { search: debouncedSearch })
        }),
    })

    if (isError) return <div>Something went wrong</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Browse Products</h1>
            <Link to='/buyer/dashboard' className="text-sm text-green-700 hover:underline mb-6 inline-block">
                ← Back to Dashboard
            </Link>
            <div className="flex gap-3 mb-6">
                <input
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" 
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select 
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="grains">Grains</option>
                    <option value="oil">Oil</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.data?.products.length === 0 && (
                    <p className="text-center text-gray-400 py-20">No products found</p>
                )}
                {isLoading ? (
                    <p className="text-gray-400">Searching...</p>
                ) : data?.data?.products.map((product: Product) => 
                    <div key={product._id} className="bg-white border border-gray-100 rounded-xl p-5">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.available ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {product.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                        <p className="text-sm text-gray-500 mb-4">₦{product.unitPrice} / {product.unit} · Min {product.minQuantity}</p>
                        <button
                            className="w-full mt-3 bg-green-700 text-white py-2 rounded-lg text-sm hover:bg-green-800 transition-colors cursor-pointer" 
                            onClick={() => navigate('/groups/create', 
                                { state: { productId: product._id, productName: product.name } })}
                        >
                            Start Group Buy
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BrowseProducts