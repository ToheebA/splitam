import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Landing = () => {
    const { user } = useAuth()

    const [activeTab, setActiveTab] = useState('buyer')
    return (
        <div>
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-500 
                flex flex-col items-center justify-center text-center px-4 md:px-6 pt-32 md:pt-0">
                <p className="text-4xl mb-6 animate-bounce">
                    🛒 🤝 📦 🌾 👥
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Buy Together. 
                    Save Together. 
                </h1>
                <p className="text-lg md:text-xl text-green-200 max-w-2xl mb-10">
                    From rice to palm oil — pool orders with people near you and pay wholesale, not retail.
                </p>
                <div className="flex flex-col md:flex-row gap-4 mb-16">
                    {user?.role === 'buyer' && (
                        <Link 
                            to="/buyer/dashboard"
                            className="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-colors duration-200"
                        >
                            Go to Dashboard 🚀
                        </Link>
                    )}
                    {user?.role === 'vendor' && (
                        <Link 
                            to="/vendor/dashboard"
                            className="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-colors duration-200"
                        >
                            Go to Dashboard 🚀
                        </Link>
                    )}
                    {!user && (
                        <>
                            <Link 
                                to="/register" 
                                state={{ role: 'buyer' }}
                                className="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-colors"
                            >
                                Start Buying Together 🛒
                            </Link>
                            <Link 
                                to="/register" 
                                state={{ role: 'vendor' }}
                                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
                            >
                                Sell in Bulk 📦
                            </Link>
                        </>
                    )}
                    {!user && (
                        <Link 
                            to="/login" 
                            className="text-sm text-white border border-white/30 px-5 py-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            Already have an account? Login
                        </Link>
                    )}
                </div>
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 text-white">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold">10,000+</span> 
                        <span className="text-green-200">Buyers</span>
                    </div>
                    <div className="hidden md:block w-px bg-green-400"></div>
                    <div className="flex flex-col items-center"> 
                        <span className="text-3xl font-bold">500+</span> 
                        <span className="text-green-200">Vendors</span>
                    </div>
                    <div className="hidden md:block w-px bg-green-400"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold">₦50M+</span> 
                        <span className="text-green-200">Saved Together</span>
                    </div>
                </div>
            </div>
            <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                    </h2>
                    <p className="text-gray-500 text-lg">
                        Get started in 3 simple steps
                    </p>
                </div>
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
                    <button 
                        onClick={() => setActiveTab('vendor')}
                        className={`px-6 py-3 rounded-full font-bold transition-colors duration-200 cursor-pointer
                            ${activeTab === 'vendor'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        For Vendors
                    </button>
                    <button 
                        onClick={() => setActiveTab('buyer')}
                        className={`px-6 py-3 rounded-full font-bold transition-colors duration-200 cursor-pointer
                            ${activeTab === 'buyer' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        For Buyers
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {activeTab === 'vendor' ? (
                        <>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">List Your Products</h4>
                                <p className="text-gray-500">Add your bulk products with pricing, minimum quantity and unit details</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Buyers Form Groups</h4>
                                <p className="text-gray-500">Buyers in your area pool together to meet your minimum order quantity</p>     
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Get Paid, Deliver</h4>
                                <p className="text-gray-500">Once all members pay, you get notified and fulfil the order - no middlemen</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Browse Products</h4>
                                <p className="text-gray-500">Find everyday essentials like rice, oil and more at wholesale prices</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Start or Join a Group</h4>
                                <p className="text-gray-500">Create a group buy or join one near you to hit the minimum order quantity</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Pay and Save</h4>
                                <p className="text-gray-500">Once the group is full, pay securely and receive your share at wholesale price</p>
                            </div>
                        </>
                    )}
                </div>
            </section>
            <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Everything you need
                    </h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Whether you're a buyer or a vendor, SplitAm has you covered
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold text-green-600 mb-6">
                            For Buyers 🛒
                        </h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-4">
                                <span className="text-3xl">💰</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Save More</h4>
                                    <p className="text-gray-500">Access wholesale prices on everyday essentials by buying in groups</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-3xl">👥</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Buy With Neighbours</h4>
                                    <p className="text-gray-500">Pool orders with people near you and split the savings</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-3xl">🔒</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Secure Payments</h4>
                                    <p className="text-gray-500">Pay safely with Paystack — only when your group is complete</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold text-green-600 mb-6">
                            For Vendors 📦
                        </h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-4">
                                <span className="text-3xl">🌾</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Sell in Bulk</h4>
                                    <p className="text-gray-500">Move large quantities without the hassle of individual retail sales</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-3xl">🤝</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">No Middlemen</h4>
                                    <p className="text-gray-500">Connect directly with buyers and keep more of your profit</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-3xl">📊</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Guaranteed Orders</h4>
                                    <p className="text-gray-500">Groups only complete when all members have paid — no bad debt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Landing