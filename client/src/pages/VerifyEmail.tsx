import { verifyEmail } from '../api/auth'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const VerifyEmail = () => {
    const { token } = useParams<{ token: string }>()
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')

    useEffect(() => {
        const verify = async () => {
            try {
                await verifyEmail(token!)
                setStatus('success')
            } catch {
                setStatus('failed')
            }
        }
        if {token} verify()
        else setStatus('failed')
    }, [token])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-sm">
                {status === 'verifying' && (
                    <>
                        <p className="text-4xl mb-4">⏳</p>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Verifying your email...
                        </h1>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <p className="text-4xl mb-4">🎉</p>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Email Verified!
                        </h1>
                        <p className="text-gray-500 mb-6">
                            Your account is now active. You can log in!
                        </p>
                        <Link
                            to="/login"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                        >
                            Login Now
                        </Link>
                    </>
                )}
                {status === 'failed' && (
                    <>
                        <p className="text-4xl mb-4">❌</p>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Verification Failed!
                        </h1>
                        <p className="text-gray-500 mb-6">
                            Link is invalid or expired. Please register again.
                        </p>
                        <Link
                            to="/register"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                        >
                            Register Again
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail