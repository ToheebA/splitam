import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { registerUser } from '../api/auth'
import toast from 'react-hot-toast'
import type { RegisterData } from '../types/index'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\W]{8,}$/

const Register = () => {
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [confirmTouched, setConfirmTouched] = useState(false)
    const [formData, setFormData] = useState<RegisterData>({
        name: '',
        email: '',
        password: '',
        confirmPassword:'',
        role: 'buyer',
        location: ''
    })
    const { mutate, isPending } = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success('Registration successful! Check your email.')
            navigate('/login')
        },
        onError: (error: any) => {
            setError(error.response?.data?.msg || 'Registration failed')
        }
    })

    const handleChange = (field: keyof RegisterData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value}))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!formData.name || !formData.email || !formData.password || !formData.location || !formData.confirmPassword) {
            setError('Please fill in all fields')
            return
        }
        if (!emailRegex.test(formData.email)) {
            setError('Please provide a valid email address')
            return
        }
        if (!passwordRegex.test(formData.password)) {
            setError('Password must be at least 8 characters and include uppercase, lowercase, number and special character')
            return
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }
    
        mutate(formData)
        
    }

    return (
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center mt-2 px-4">
            <form onSubmit = {handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-green-600 text-center mb-2">
                    SplitAm
                </h1>
                <h2 className="text-gray-500 text-center mb-6">
                    Create your account
                </h2>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Name</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text" 
                        placeholder="Name" 
                        value={formData.name} 
                        onChange={(e) => handleChange('name', e.target.value)} 
                    />
                </div>
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
                    <p className="text-xs text-gray-400">
                        Min 8 characters with uppercase, lowercase, number and special character (@$!%*?&)
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Re-enter Password</label>
                    <div className="relative">
                        <input 
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password" 
                            value={formData.confirmPassword} 
                            onBlur={() => setConfirmTouched(true)}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)} 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {confirmTouched && formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-400">Passwords do not match</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Role</label>
                    <select
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        value={formData.role} 
                        onChange={(e) => handleChange('role', e.target.value)} 
                    >
                        <option value="buyer">Buyer</option>
                        <option value="vendor">Vendor</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Location</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text" 
                        placeholder="Location" 
                        value={formData.location} 
                        onChange={(e) => handleChange('location', e.target.value)} 
                    />
                </div>
                <button
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-pointer transition-colors duration-200"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? 'Registering...' : 'Register'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
            <p className="text-center text-gray-500 mt-4">
                Already have an account?
                <Link to="/login" className="text-green-600 font-semibold"> Login</Link>
            </p>
        </div>
    )
}
export default Register