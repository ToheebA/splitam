import { getGroup, updateGroup } from "../api/groups"
import { initializePayment } from "../api/payment"
import type { User, Group, Product, CreateGroupData, GroupMember } from "../types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import Spinner from "../components/Spinner"

const GroupDetail = () => {
    const { user } = useAuth()
    const { id } = useParams()
    const queryClient = useQueryClient()
    const [editingGroup, setEditingGroup] = useState<Group | null>(null)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['group', id],
        queryFn: () => getGroup(id as string),
        enabled: !!id
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
            queryClient.invalidateQueries({ queryKey: ['group'] })
            queryClient.invalidateQueries({ queryKey: ['groups'] })
            queryClient.invalidateQueries({ queryKey: ['myGroups'] })
            setEditingGroup(null)
        },
        onError: (error: any) =>
            toast.error(error.response?.data?.msg || 'Update failed')
    })

    const { mutate: initializePaymentMutation } = useMutation({
        mutationFn: (groupId: string) => initializePayment(groupId),
        onSuccess: (response) => {
            window.location.href = response.data.authorizationUrl
        },
        onError: (error: any) =>
            toast.error(error.response?.data?.msg || 'Unable to initialize payment')
    })

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingGroup) return
        updateGroupMutation({ id: editingGroup._id, data: groupForm })
    }

    if (isLoading) return <Spinner />
    if (isError) return <div>Something went wrong</div>

    const group = data?.data?.group as Group
    const product = group?.product as Product
    const creatorId = typeof group?.creator === 'string'
        ? group?.creator
        : (group?.creator as User)?._id

    return (
        <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
            <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">{product?.name}</h1>
                        <p className="text-sm text-gray-500">{product?.category}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${group?.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {group?.status}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">📍 {group?.location}</p>
                <p className="text-sm text-gray-500 mb-4">₦{group?.pricePerUnit} per unit</p>
                <p className="text-xs text-gray-500 mb-1">{group?.currentQuantity} / {group?.targetQuantity} units filled</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                    <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${((group?.currentQuantity ?? 0) / (group?.targetQuantity ?? 1)) * 100}%` }}
                    />
                </div>

                <p className="text-sm text-gray-500 mb-4">
                    Deadline: {group?.deadline ? new Date(group.deadline).toLocaleDateString() : ''}
                </p>
                {creatorId === user?._id && (
                    <button
                        className="text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                            setEditingGroup(group)
                            setGroupForm({
                                productId: (product as Product)?._id || '',
                                targetQuantity: group?.targetQuantity || 0,
                                quantity: 1,
                                deadline: group?.deadline ? new Date(group.deadline).toISOString().split('T')[0] : '',
                                location: group?.location || ''
                            })
                        }}
                    >
                        Edit Group
                    </button>
                )}
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Members</h2>
                {group?.members.map((member: GroupMember) => {
                    const memberId = typeof member.user === 'string' ? member.user : (member.user as User)._id
                    const isCurrentUser = memberId === user?._id
                    return (
                        <div key={memberId} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                            <div>
                                <p className="text-sm text-gray-700">
                                    {isCurrentUser ? 'You' : typeof member.user === 'string' ? 'Member' : (member.user as User).name}
                                </p>
                                <p className="text-xs text-gray-500">Quantity: {member.quantity}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded-full ${member.paid ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                    {member.paid ? 'Paid' : 'Unpaid'}
                                </span>
                                {isCurrentUser && group?.status === 'filled' && !member.paid && (
                                    <button
                                        onClick={() => initializePaymentMutation(group._id)}
                                        className="text-sm bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 cursor-pointer"
                                    >
                                        Pay Now
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
                                <button type='submit' className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    </div>
    )
}

export default GroupDetail