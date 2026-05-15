import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
    const { user, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const handleLogout = () => {
        logout()
        navigate('/')
    }
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="flex items-center justify-between px-8 py-4">
                <Link to="/" className="text-2xl font-bold text-green-600">
                    SplitAm
                </Link>
                <button
                    className="md:hidden cursor-pointer text-xl"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? '✕' : '☰'}
                </button>
                <div className="hidden md:flex gap-6">
                    <Link
                        to="/groups"
                        className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
                    >
                        Browse Groups
                    </Link>
                    <Link
                        to="/products"
                        className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
                    >
                        Browse Products
                    </Link>
                </div>
                <div>
                    {user ? ( 
                        <>  
                            <span className="text-gray-600 font-small mr-4">
                                Hi, {user.name}!
                            </span>                  
                            <Link 
                                to={`/${user.role}/dashboard`}
                                className="text-green-600 hover:text-green-700 font-small transition-colors duration-200"
                            >
                                Dashboard
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 text-white ml-2 px-2 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className="text-green-600 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200 font-medium"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden flex flex-col px-8 pb-4 gap-4 border-t border-gray-100">
                    {user ? (
                        <>
                            <span className="text-gray-600 font-medium">
                                Hi, {user.name}!
                            </span>
                            <Link 
                                to={`/${user.role}/dashboard`}
                                onClick={() => setIsOpen(false)}
                                className="text-green-600 font-medium py-2"
                            >
                                Dashboard
                            </Link>
                            <Link 
                                to="/browse"
                                onClick={() => setIsOpen(false)}
                                className="text-gray-600 hover:text-green-600 font-medium py-2"
                            >
                                Browse Skits
                            </Link>
                            <Link 
                                to="/creators"
                                onClick={() => setIsOpen(false)}
                                className="text-gray-600 hover:text-green-600 font-medium py-2"
                            >
                                Creators
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer w-full"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-green-600 border border-green-600 px-4 py-2 rounded-lg text-center font-medium"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register"
                                onClick={() => setIsOpen(false)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-center font-medium"
                            >
                                Register
                            </Link>
                            <Link 
                                to="/browse"
                                onClick={() => setIsOpen(false)}
                                className="text-gray-600 hover:text-green-600 font-medium py-2"
                            >
                                Browse Skits
                            </Link>
                            <Link 
                                to="/creators"
                                onClick={() => setIsOpen(false)}
                                className="text-gray-600 hover:text-green-600 font-medium py-2"
                            >
                                Creators
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar