import { jwtDecode } from 'jwt-decode'
import { createContext, useState, useContext } from 'react'
import type { AuthContextType, DecodedToken, User } from '../types/index';


const AuthContext = createContext<AuthContextType | null>(null);
const isTokenExpired = (token: string) => {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.exp * 1000 < Date.now()
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken && !isTokenExpired(storedToken)) {
            return storedToken
        }
        localStorage.removeItem('token')
        return null
    })

    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            return JSON.parse(storedUser)
        }
        return null
    })

    const login = (token: string, user: User) => {
        setToken(token)
        setUser(user)
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {  
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}