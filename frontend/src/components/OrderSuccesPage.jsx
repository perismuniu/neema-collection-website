import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(30);
  const order = location.state?.order;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 30000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <CheckCircle className="mx-auto text-green-500 w-24 h-24 mb-4" />
      <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-xl mb-8">Thank you for your purchase. Your order is being processed.</p>
      
      {order && (
        <div className="bg-gray-100 p-6 rounded-lg mb-8 text-left">
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Total Amount:</strong> KSh {order.total.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Delivery Type:</strong> {order.deliveryType}</p>
          <h3 className="text-xl font-bold mt-4 mb-2">Items:</h3>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.product.title} x {item.quantity} - KSh {item.itemTotalPrice.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={handleContinueShopping}
          className="bg-pink hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Continue Shopping
        </button>
        <button
          onClick={handleViewOrders}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
        >
          View Orders
        </button>
      </div>
      <p className="text-gray-600">
        You will be redirected to the homepage in {countdown} seconds
      </p>
    </div>
  );
};

export default OrderSuccess;