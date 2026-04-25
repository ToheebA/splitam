import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom'
import type { Role } from '../types/index';

const ProtectedRoute = ({  children, allowedRoles }: { children: React.ReactNode, allowedRoles?: Role[] }) => {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'vendor') return <Navigate to="/vendor/dashboard" />
        if (user.role === 'buyer') return <Navigate to="/buyer/dashboard" />
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" />
    }
    return children
}

export default ProtectedRoute