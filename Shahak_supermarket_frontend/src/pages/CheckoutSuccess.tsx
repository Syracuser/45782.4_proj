import { useNavigate } from 'react-router-dom';

function CheckoutSuccess() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                />
                </svg>
            </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Successful!
            </h1>
            
            <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
            </p>

            <button
            onClick={() => navigate('/home')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
            Continue Shopping
            </button>
        </div>
        </div>
    );
    }

export default CheckoutSuccess;