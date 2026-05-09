import { Link, useSearchParams } from 'react-router-dom'

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const reference = searchParams.get('reference')

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">✅</span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-500 mb-6">
                    Your payment has been received. The group status will be updated once all members have paid.
                </p>
                {reference && (
                    <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6">
                        <p className="text-xs text-gray-400 mb-1">Transaction Reference</p>
                        <p className="text-sm font-mono text-gray-700 break-all">{reference}</p>
                    </div>
                )}
                <Link
                    to="/buyer/dashboard"
                    className="block w-full bg-green-700 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}

export default PaymentSuccess