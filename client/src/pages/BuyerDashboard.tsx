import { getGroups, updateGroup } from "../api/groups"
import type { User, Group, Product, CreateGroupData } from "../types/index"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext" 
import toast from 'react-hot-toast'

const BuyerDashboard = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [editingGroup, setEditingGroup] = useState<Group | null>(null)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['myGroups', user?._id],
        queryFn: () => getGroups({ myGroups: 'true' }),
        enabled: !!user?._id
    })

    const initialFormState = {
        productId: '',
        targetQuantity: 0,
        quantity: 0,
        deadline: '',
        location: ''
    }

    const [groupForm, setGroupForm] = useState<CreateGroupData>(initialFormState)

    const { mutate: updateGroupMutation } = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Omit<CreateGroupData, 'quantity'>> }) => updateGroup(id, data),
        onSuccess: () => {
            toast.success('Group updated')
            queryClient.invalidateQueries({ queryKey: ['groups', user?._id] })
            setEditingGroup(null)
        },
        onError: (error: any) =>
            toast.error(error.response?.data?.msg || 'Update failed')
    })

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingGroup) return
        updateGroupMutation({ id: editingGroup._id, data: groupForm })
    }

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Something went wrong</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">My Groups</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}</p>
                </div>
                <div className="flex gap-3">
                    <Link 
                        to="/products"
                        className="px-4 py-2 text-sm border border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                    >
                        Browse Products
                    </Link>
                    <Link 
                        to="/groups"
                        className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                    >
                        Browse Groups
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.data?.groups.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg mb-2">No groups yet</p>
                        <p className="text-sm">Browse products to start a group buy</p>
                    </div>
                )}
                {data?.data?.groups.map((group: Group) => {
                    const product = group.product as Product;
                    const creatorId = typeof group.creator === 'string' 
                        ? group.creator 
                        : (group.creator as User)._id 
                    return ( 
                        <div key={group._id} className="bg-white border border-gray-100 rounded-xl p-5">
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${group.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {group.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                            <p className="text-sm text-gray-500 mb-4">₦{product.unitPrice} / {product.unit} · Min {product.minQuantity}</p>
                            <div className="flex gap-2 border-t border-gray-100 pt-3">
                                {creatorId === user?._id && (
                                    <button
                                        className="text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                                        onClick={() => {
                                            setEditingGroup(group)
                                            setGroupForm({
                                                productId: product._id,
                                                targetQuantity: group.targetQuantity,
                                                quantity: 1,
                                                deadline: new Date(group.deadline).toISOString().split('T')[0],
                                                location: group.location
                                            })
                                        }}
                                    >
                                            Edit Group
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            {editingGroup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-semibold">Edit Group</h2>
                        <button type="button" onClick={() => setEditingGroup(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">    
                            <label className="text-sm text-gray-500">Target Quantity</label>
                            <input 
                                type='number'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={groupForm.targetQuantity}
                                onChange={(e) => setGroupForm(prev => ({ ...prev, targetQuantity: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Deadline</label>
                            <input 
                                type='date'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={groupForm.deadline}
                                onChange={(e) => setGroupForm(prev => ({ ...prev, deadline: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500">Location</label>
                            <input 
                                type='text'
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={groupForm.location}
                                onChange={(e) => setGroupForm(prev => ({ ...prev, location: e.target.value }))}
                            />
                        </div>
                        
                        <div className="flex gap-2 justify-end mt-2">
                            <button 
                                type='button' 
                                onClick={() => setEditingGroup(null)}
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
export default BuyerDashboard