import API from './axios'

export const getStats = () => API.get('/admin/stats')
export const getAllUsers = (params?: Record<string, string>) => API.get('/admin/users', { params })