import { createContext, useContext, useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'
import type { SocketContextType } from '../types'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext<SocketContextType | null>(null)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth()
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        if (!user) return

        const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
            query: { userId: user._id },
            autoConnect: false,
        })

        newSocket.on('connect', () => {
            newSocket.emit('join', user._id)
            console.log('Connected to socket server!')
        })

        newSocket.on('notification', (data) => {
            toast.success(data.message, {
                duration: 5000,
                icon: '🔔'
            })
        })

        newSocket.on('groupPurchased', () => {
            toast.success('A group buy has been completed! Check your dashboard.', {
                duration: 5000,
                icon: '🎉'
            })
        })

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server!')
        })

        newSocket.connect()
        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [user])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => { 
    const context = useContext(SocketContext)
    if (!context) throw new Error('useSocket must be used within SocketProvider')
    return context
}