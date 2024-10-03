import React from 'react';
import { useSelector } from 'react-redux';
import { ShoppingCart } from 'lucide-react';

const CartIcon = () => {
  const cartItems = useSelector(state => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative">
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;