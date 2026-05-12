import API from './axios'

export const getStats = () => API.get('/admin/stats')
export const getAllUsers = (params?: Record<string, string>) => 
    API.get('/admin/users', { params })
export const deleteUser = (id: string) => API.delete(`/admin/users/${id}`)
export const updateGroupStatus = (id: string, status: string) =>
    API.patch(`/groups/${id}`, { status })