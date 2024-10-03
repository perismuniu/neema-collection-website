import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from './utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Your Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded">
              <h3 className="font-bold">Order ID: {order._id}</h3>
              <p>Total: ${order.total}</p>
              <p>Status: {order.status}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <h4 className="font-bold mt-2">Items:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>{item.title} - Quantity: {item.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;