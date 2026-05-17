import { getStats, getAllUsers, deleteUser, updateGroupStatus } from '../api/admin'
import { getGroups } from '../api/groups'
import { getProducts } from '../api/products'
import type { User, Group, Product } from '../types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner'

const AdminDashboard = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['stats'],
        queryFn: () => getStats(),
        enabled: user?.role === 'admin'
    })

    const { data: usersData, isLoading: usersLoading, isError: usersError } = useQuery({
        queryKey: ['users'],
        queryFn: () => getAllUsers(),
        enabled: user?.role === 'admin'
    })

    const { data: groupsData, isLoading: groupsLoading, isError: groupsError } = useQuery({
        queryKey: ['groups'],
        queryFn: () => getGroups(),
        enabled: user?.role === 'admin'
    })

    const { data: productsData, isLoading: productsLoading, isError: productsError } = useQuery({
        queryKey: ['products'],
        queryFn: () => getProducts(),
        enabled: user?.role === 'admin'
    })

    console.log('stats:', data?.data)
    console.log('users:', usersData?.data)
    console.log('groups:', groupsData?.data)
    console.log('products:', productsData?.data)

    const { mutate: deleteUserMutation } = useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            toast.success('User deleted')
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['stats'] })
        },
        onError: (error: any) => toast.error(error.response?.data?.msg || 'Delete failed')
    })

    const { mutate: updateGroupStatusMutation } = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => updateGroupStatus(id, status),
        onSuccess: () => {
            toast.success('Group status updated')
            queryClient.invalidateQueries({ queryKey: ['groups'] })
        },
        onError: (error: any) => toast.error(error.response?.data?.msg || 'Update failed')
    })

    if (isLoading) return <Spinner />
    if (isError) return <p>Error loading stats</p>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">Admin Dashboard</h1>
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <p className="text-sm text-gray-500 mb-1">Total Users</p>
                        <p className="text-3xl font-semibold text-gray-900">{data?.data?.totalUsers}</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <p className="text-sm text-gray-500 mb-1">Total Products</p>
                        <p className="text-3xl font-semibold text-gray-900">{data?.data?.totalProducts}</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <p className="text-sm text-gray-500 mb-1">Total Groups</p>
                        <p className="text-3xl font-semibold text-gray-900">{data?.data?.totalGroups}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Users</h2>
                    {usersLoading && <p>Loading users...</p>}
                    {usersError && <p>Error loading users</p>}
                    <div>
                        {usersData?.data?.users.map((u: User) => (
                            <div key={u._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                                    <p className="text-xs text-gray-500">{u.email} · {u.role}</p>
                                </div>
                                <button 
                                    onClick={() => deleteUserMutation(u._id)}
                                    className="text-sm text-red-600 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Groups</h2>
                    {groupsLoading && <p>Loading groups...</p>}
                    {groupsError && <p>Error loading groups</p>}
                    {groupsData?.data?.groups.map((g: Group) => (
                        <div key={g._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {typeof g.product === 'string' ? g.product : (g.product as Product).name}
                                </p>
                                <p className="text-xs text-gray-500">{g.location} · {g.currentQuantity}/{g.targetQuantity} units</p>
                            </div>
                            <select
                                value={g.status}
                                onChange={(e) => updateGroupStatusMutation({ id: g._id, status: e.target.value })}
                                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="open">Open</option>
                                <option value="filled">Filled</option>
                                <option value="purchased">Purchased</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    ))}
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
                    {productsLoading && <p>Loading products...</p>}
                    {productsError && <p>Error loading products</p>}
                    {productsData?.data?.products.map((p: Product) => (
                        <div key={p._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                                <p className="text-xs text-gray-500">
                                    ₦{p.unitPrice} / {p.unit} · {p.available ? 'Available' : 'Unavailable'}
                                </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.available ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {p.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard