import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices';
import api from './utils/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(state => state.cart);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const user = useSelector((state) => state.auth.user);

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [deliveryType, setDeliveryType] = useState('Shop pick-up');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    if (!user.phone) {
      toast.error('Please add your M-Pesa phone number to continue');
      navigate('/user/settings', { 
        state: { 
          returnTo: '/checkout',
          message: 'Please add your M-Pesa phone number to continue with the payment'
        }
      });
      return;
    }


    try {
      const response = await api.post('/orders', {
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          color: item.selectedColor,
          size: item.selectedSize,
          itemTotalPrice: item.price * item.quantity
        })),
        shippingInfo,
        total,
        paymentMethod,
        deliveryType,
      });
      
      if (paymentMethod === 'mpesa') {
        navigate('/payment-status', { 
          state: { 
            orderId: response.data.order._id,
            mpesaRequestId: response.data.mpesaRequestId,
            mpesaCheckoutRequestId: response.data.mpesaCheckoutRequestId
          } 
        });
      } else {
        dispatch(clearCart());
        navigate('/order-success');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      navigate('/order-failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-[25%]">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit}>
        {/* Existing form fields */}
        {/* ... */}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Payment Method
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="mpesa">M-Pesa</option>
            <option value="payment on delivery">Payment on Delivery</option>
            {/* <option value="wallet">Wallet</option> */}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Delivery Type
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
          >
            <option value="Shop pick-up">Shop Pick-up</option>
            <option value="Home delivery">Home Delivery</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold">Order Summary</h3>
          {items.map(item => (
            <div key={`${item._id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between">
              <span>{item.title} - {item.selectedColor}, {item.selectedSize} x {item.quantity}</span>
              <span>KSh {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="font-bold mt-2">
            Total: KSh {total.toFixed(2)}
          </div>
        </div>
        <button
          type="submit"
          className="bg-pink text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;