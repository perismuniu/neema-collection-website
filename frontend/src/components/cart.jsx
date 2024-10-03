import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(state => state.cart);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Generate a unique key for each cart item based on product ID, color, and size
  const getItemKey = (item) => `${item._id}-${item.selectedColor}-${item.selectedSize}`;

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart({
      id: item._id,
      color: item.selectedColor,
      size: item.selectedSize
    }));
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({
        id: item._id,
        color: item.selectedColor,
        size: item.selectedSize,
        quantity: newQuantity
      }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.map(item => (
        <div key={getItemKey(item)} className="flex items-center justify-between border-b py-4">
          <div className="flex items-center">
            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover mr-4" />
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-gray-600">
                Color: <span className="capitalize">{item.selectedColor}</span>, 
                Size: {item.selectedSize}
              </p>
              <p className="text-gray-600">KSh {item.price.toFixed(2)} x {item.quantity}</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
              className="bg-gray-200 px-2 py-1 rounded-l"
            >
              -
            </button>
            <span className="bg-gray-100 px-4 py-1">{item.quantity}</span>
            <button
              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
              className="bg-gray-200 px-2 py-1 rounded-r"
            >
              +
            </button>
            <button
              onClick={() => handleRemoveItem(item)}
              className="ml-4 text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="mt-8">
        <p className="text-xl font-bold">Total: KSh {total.toFixed(2)}</p>
        <div className="mt-4">
          <button
            onClick={handleClearCart}
            className="bg-red-500 text-white px-4 py-2 rounded mr-4 hover:bg-red-600 transition-colors"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="bg-pink text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;