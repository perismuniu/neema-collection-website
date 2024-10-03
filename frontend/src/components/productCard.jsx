import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setUserCart } from '../redux/userActionSlice';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product page
    // dispatch(setUserCart(product));
    toast.success(`${product.title} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
        <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.title}</h3>
          <p className="text-pink-600 font-bold mb-2">KSh {product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            className="w-full bg-pink-500 text-white px-4 py-2 bg-pink rounded-full hover:bg-pink-600 transition-colors duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export const FeaturedProduct = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product page
    dispatch(addToCart(product));
    toast.success(`${product.title} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  if (!product) return null;

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="bg-gradient-to-r from-pink-100 to-pink-200 rounded-lg p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <img src={product.images[0]} alt={product.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
          </div>
          <div className="md:w-1/2 md:pl-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{product.title}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold mb-4 text-pink-600">KSh {product.price.toFixed(2)}</p>
            <button
              onClick={handleAddToCart}
              className="bg-red-800 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors duration-300 shadow-md"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;