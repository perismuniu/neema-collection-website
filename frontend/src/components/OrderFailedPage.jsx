import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const OrderFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(30);
  const error = location.state?.error;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate('/checkout');
    }, 30000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  const handleTryAgain = () => {
    navigate('/checkout');
  };

  const handleContactSupport = () => {
    // Implement this when you have a support page
    // For now, we'll just redirect to home
    navigate('/support');
  };

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <XCircle className="mx-auto text-red-500 w-24 h-24 mb-4" />
      <h1 className="text-3xl font-bold mb-4">Order Failed</h1>
      <p className="text-xl mb-8">We're sorry, but there was an issue processing your order.</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={handleTryAgain}
          className="bg-pink hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={handleContactSupport}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
        >
          Contact Support
        </button>
      </div>
      <p className="text-gray-600">
        You will be redirected to the checkout page in {countdown} seconds
      </p>
    </div>
  );
};

export default OrderFailed;