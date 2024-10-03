import React from 'react';
import { MessageCircle, Bell } from 'lucide-react';

const RightSidePanel = ({ notifications, orders }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      <div className="px-6 py-4 border-b">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-center mb-2">
            <Bell size={18} className="mr-2 text-green-500" />
            <span>{notification.message}</span>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Orders</h3>
      </div>
      <div className="px-6 py-4">
        {orders.map((order, index) => (
          <div key={index} className="flex items-center mb-2">
            <MessageCircle size={18} className="mr-2 text-blue-500" />
            <span>Order #{order.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidePanel;