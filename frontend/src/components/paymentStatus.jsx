import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import api from './utils/api';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices';

const PaymentStatus = () => {
  const [status, setStatus] = useState('pending');
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, mpesaRequestId, mpesaCheckoutRequestId } = location.state;
  const dispatch = useDispatch()

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await api.get(`/orders/${orderId}/payment-status`);
        setStatus(response.data.status);

        if (response.data.status === 'completed') {
          dispatch(clearCart());
          setTimeout(() => navigate('/order-success'), 2000);
        } else if (response.data.status === 'cancelled') {
          setTimeout(() => navigate('/order-failed'), 2000);
        }
      } catch (error) {
        console.error('Failed to check payment status:', error);
        setStatus('error');
      }
    };

    const intervalId = setInterval(checkStatus, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [orderId, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Status</h1>
      {status === 'pending_payment' && (
        <>
          <Loader className="animate-spin h-12 w-12 mx-auto mb-4" />
          <p className="text-xl mb-4">Waiting for M-Pesa payment confirmation...</p>
          <p className="text-gray-600 mb-2">M-Pesa Request ID: {mpesaRequestId}</p>
          <p className="text-gray-600">Checkout Request ID: {mpesaCheckoutRequestId}</p>
        </>
      )}
      {status === 'completed' && (
        <p className="text-xl text-green-600 mb-4">Payment successful! Redirecting to order confirmation...</p>
      )}
      {status === 'cancelled' && (
        <p className="text-xl text-red-600 mb-4">Payment failed. Redirecting to error page...</p>
      )}
      {status === 'error' && (
        <p className="text-xl text-red-600 mb-4">An error occurred while checking the payment status. Please try again later.</p>
      )}
    </div>
  );
};

export default PaymentStatus;