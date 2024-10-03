import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setCurrentProduct, addToCart } from '../redux/slices';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3002/api/products/${id}`);
        setProduct(response.data);
        dispatch(setCurrentProduct(response.data));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!product) {
      console.error("Product not available");
      return;
    }
  
    if (!selectedColor || !selectedSize) {
      toast.error('Please select a color and size');
      return;
    }
  
    const selectedVariant = product.variants.find(v => v.color === selectedColor);
    const selectedStockItem = selectedVariant?.stock.find(s => s.size === selectedSize);
    
    if (!selectedStockItem || selectedStockItem.quantity < quantity) {
      toast.error('Selected quantity not available');
      return;
    }
  
    dispatch(addToCart({
      _id: product._id,
      title: product.title,
      price: product.price,
      selectedColor,
      selectedSize,
      quantity,
      image: product.images[0]
    }));
    toast.success(`${product.title} added to cart!`);
    navigate('/user/cart');
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 flex justify-center items-center h-64"
    >
      Loading...
    </motion.div>
  );
  
  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 text-red-500"
    >
      Error: {error}
    </motion.div>
  );

  if (!product) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      Product not found
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row -mx-4">
        <motion.div 
          className="md:flex-1 px-4"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
        >
          <div className="h-64 md:h-80 rounded-lg bg-gray-100 mb-4">
            <img 
              src={product.images[0]} 
              alt={product.title}
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
        </motion.div>
        <motion.div 
          className="md:flex-1 px-4"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h2>
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
          <div className="flex mb-4">
            <div className="mr-4">
              <span className="font-bold text-gray-700">Price:</span>
              <span className="text-gray-600">KShs {product.price.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">Availability:</span>
              <span className="text-gray-600">
                {product.variants.some(v => v.stock.some(s => s.quantity > 0)) ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <span className="font-bold text-gray-700">Select Color:</span>
            <div className="flex items-center mt-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.color}
                  className={`w-6 h-6 rounded-full mr-2 ${
                    selectedColor === variant.color ? 'ring-2 ring-offset-2 ring-gray-800' : ''
                  } ${variant.stock.every(s => s.quantity === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: variant.color.toLowerCase() }}
                  onClick={() => variant.stock.some(s => s.quantity > 0) && setSelectedColor(variant.color)}
                  disabled={variant.stock.every(s => s.quantity === 0)}
                ></button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <span className="font-bold text-gray-700">Select Size:</span>
            <div className="flex items-center mt-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                const selectedVariant = product.variants.find(v => v.color === selectedColor);
                const isAvailable = selectedVariant?.stock.some(s => s.size === size && s.quantity > 0);
                return (
                  <button
                    key={size}
                    className={`bg-gray-300 text-gray-700 py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 ${
                      selectedSize === size ? 'bg-gray-500 text-pink' : ''
                    } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-pink text-white py-2 px-4 rounded-full font-bold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={!selectedColor || !selectedSize || quantity === 0}
          >
            <ShoppingCart className="inline-block mr-2" />
            Add to Cart
          </motion.button>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <motion.div 
              key={index} 
              className="mb-4 bg-gray-100 p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-gray-600">{review.username}</span>
              </div>
              <p className="text-gray-700">{review.review}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductPage;