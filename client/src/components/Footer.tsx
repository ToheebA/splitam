import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const { user } = useAuth();

    return (
        <footer className="bg-gray-900 text-gray-400 pt-10 md:pt-16 pb-8 px-4 md:px-6">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-xl font-bold text-green-400">SplitAm</h1>
                <div className="flex gap-6">
                    <Link to='/groups' className="hover:text-green-400">Browse Groups</Link>
                    <Link to='/products' className="hover:text-green-400">Browse Products</Link>
                    {!user && (
                        <>
                            <Link to='/login' className="hover:text-green-400">Login</Link>
                            <Link to='/register' className="hover:text-green-400">Register</Link>
                        </>
                    )}
                </div>
                <p>© 2026 SplitAm 🇳🇬</p>
            </div>
        </footer>
    )
}

export default Footer