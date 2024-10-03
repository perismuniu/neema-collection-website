import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../redux/slices';
import ProductCard, { FeaturedProduct } from './productCard';
import ErrorBoundary from './utils/errorBoundary';
import api from './utils/api'

const HomePage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorBoundary>
        <FeaturedProduct product={products[0]} />
      </ErrorBoundary>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {products.length > 0 ? products.map((product) => (
          <ErrorBoundary key={product._id}>
            <ProductCard product={product} />
          </ErrorBoundary>
        )): <div>No products found!</div>}
      </div>
    </div>
  );
};

export default HomePage;