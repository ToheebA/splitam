import { createGroup } from "../api/groups";
import type { CreateGroupData } from "../types/index"
import { useAuth } from "../context/AuthContext" 
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'

const CreateGroup = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { productId, productName } = location.state || {}
    const { user } = useAuth()
    const queryClient = useQueryClient()
    
    const initialFormState = {
        productId,
        targetQuantity: 0,
        quantity: 0,
        deadline: '',
        location: ''
    }

    const [groupForm, setGroupForm] = useState<CreateGroupData>(initialFormState)
    
    const { mutate: createGroupMutation } = useMutation({
        mutationFn: (data: CreateGroupData) => createGroup(data),
        onSuccess: () => {
            toast.success('Group created')
            queryClient.invalidateQueries({ queryKey: ['myGroups', user?._id] })
            navigate('/buyer/dashboard')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to create group')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?._id) {
            toast.error('You must be logged in');
            return;
        }
        createGroupMutation({ ...groupForm })
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">My Groups</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}</p>
                </div>
            </div>
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-semibold">Create Group for {productName}</h2>
                    </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                        <label className="text-sm text-gray-500">Quantity</label>
                        <input 
                            type='number'
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={groupForm.quantity}
                            onChange={(e) => setGroupForm(prev => ({ ...prev, quantity: Number(e.target.value) }))}
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
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-sm border border-gray-200 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button type='submit' className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800">Create</button>
                    </div>
                </form>
                </div>
            </div> 
        </div>
    )
}

export default CreateGroup