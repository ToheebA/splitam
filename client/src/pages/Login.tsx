import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { loginUser } from '../api/auth'
import toast from 'react-hot-toast'
import type { LoginData } from '../types/index'


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<LoginData>({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: (response) => {
            login(response.data.token, response.data.user)
            if (response.data.user.role === 'buyer') navigate('/buyer/dashboard')
            if (response.data.user.role === 'vendor') navigate('/vendor/dashboard')
            toast.success('Login successful!')
        },
        onError: (error: any) => {
            setError(error.response?.data?.msg || 'Login failed')
        }
    })

    const handleChange = (field: keyof LoginData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields')
            return
        }
        if (!emailRegex.test(formData.email)) {
            setError('Please provide a valid email address')
            return
        }
        mutate(formData)
    }
    return (
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center px-4">
            <form onSubmit = {handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-green-600 text-center mb-2">
                    SplitAm
                </h1>
                <h2 className="text-gray-500 text-center mb-6">
                    Welcome back!
                </h2>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Email</label>
                    <input
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="email"
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={(e) => handleChange('email', e.target.value)} 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Password</label>
                    <div className="relative">
                        <input 
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={(e) => handleChange('password', e.target.value)} 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>
                <button
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-pointer transition-colors duration-200"
                    type="submit"
                    disabled={isPending}
                >
                        {isPending ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
            <p className="text-center text-gray-500 mt-4">
                Don't have an account?
                <Link to="/register" className="text-green-600 font-semibold"> Register</Link>
            </p>
        </div>
    )
}
export default Login