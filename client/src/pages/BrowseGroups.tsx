import { getGroups, joinGroup } from "../api/groups"
import type { Group, Product, User } from "../types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"
import useDebounce from "../hooks/useDebounce"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"

const BrowseGroups = () => {
    const { user } = useAuth()
    const [location, setLocation] = useState('')
    const [status, setStatus] = useState('')
    const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null)
    const [joinQuantity, setJoinQuantity] = useState(1)
    const debouncedSearch = useDebounce(location)
    const queryClient = useQueryClient()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['groups', { status, location: debouncedSearch }],
        queryFn: () => getGroups({
            ...(status && { status }),
            ...(debouncedSearch && { location: debouncedSearch })
        }),
    })

    const { mutate: joinGroupMutation } = useMutation({
        mutationFn: ({ id, quantity }: { id: string, quantity: number }) => joinGroup(id, quantity),
        onSuccess: () => {
            toast.success('You have successfully joined the group')
            queryClient.invalidateQueries({ queryKey: ['groups'] })
            setJoiningGroupId(null)
            setJoinQuantity(1)
        },
        onError: (error: any) =>
            toast.error(error.response?.data?.msg || 'Group joining failed')
    })

    if (isError) return <div>Something went wrong</div>
 
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Browse Groups</h1>
            <Link to='/buyer/dashboard' className="text-sm text-green-700 hover:underline mb-6 inline-block">
                ← Back to Dashboard
            </Link>
            <div className="flex gap-3 mb-6">
                <input
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" 
                    type="text"
                    placeholder="Search groups by location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <select 
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="filled">Filled</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.data?.groups.length === 0 && (
                    <p className="text-center text-gray-400 py-20">No products found</p>
                )}
                {isLoading ? (
                    <p className="text-gray-400">Searching...</p>
                ) : data?.data?.groups.map((group: Group) => {
                    const isMember = group.members.some(m => {
                        const memberId = typeof m.user === 'string' ? m.user : (m.user as User)._id
                        return memberId === user?._id
                    })
                    const product = group.product as Product;
                    return (
                        <div key={group._id} className="bg-white border border-gray-100 rounded-xl p-5">
                            <div className="flex flex-col justify-between items-start mb-2">
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="font-medium text-gray-900">{group.location}</p>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${group.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {group.status}
                                </span>
                                <p className="text-xs text-gray-500">{group.currentQuantity} / {group.targetQuantity} units filled</p>
                                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                    <div 
                                        className="bg-green-600 h-2 rounded-full transition-all"
                                        style={{ width: `${(group.currentQuantity / group.targetQuantity) * 100}%` }}
                                    />
                                </div>
                                <p className="font-medium text-gray-900">Deadline: {new Date(group.deadline).toLocaleDateString()}</p>
                                <p className="font-medium text-gray-900">₦{group.pricePerUnit} per unit</p>
                            </div>
                            {joiningGroupId === group._id ? (
                                <div className="flex gap-2 mt-3">
                                    <input
                                        type="number"
                                        min={1}
                                        value={joinQuantity}
                                        onChange={(e) => setJoinQuantity(Number(e.target.value))}
                                        className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm"
                                    />
                                    <button 
                                        onClick={() => joinGroupMutation({ id: group._id, quantity: joinQuantity })}
                                        className="flex-1 bg-green-700 text-white py-1.5 rounded-lg text-sm hover:bg-green-800 transition-colors cursor-pointer"
                                    >
                                        Confirm
                                    </button>
                                    <button 
                                        onClick={() => setJoiningGroupId(null)}
                                        className="flex-1 border border-gray-200 text-gray-600 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setJoiningGroupId(group._id)}
                                    disabled={isMember}
                                    className={`w-full mt-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                                        isMember 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-green-700 text-white hover:bg-green-800'
                                    }`}
                                >
                                    {isMember ? 'Already Joined' : 'Join Group'}
                                </button>
                            )}
                        </div>
                    )
                }
                    
                )}
            </div>
        </div>
    )
}

export default BrowseGroups