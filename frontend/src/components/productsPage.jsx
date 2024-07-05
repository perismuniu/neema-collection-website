import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { addToCart } from "../redux/userActionSlice";
import { useState } from "react";

const ProductDetail = () => {

  const products = useSelector(state => state.data.products)
  const [buyingQuantity, setByingQuantity] =useState(1)
  const location = useLocation().pathname
  const id = location.slice(location.lastIndexOf('/') + 2);
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  
  const product = products.find(pro => pro._id == id)

  const handleAddToCart = () => {
    addToCart(dispatch, token, product._id, buyingQuantity )
  }

  return (
    <div className="flex flex-col md:flex-row bg-off-white p-4">
      <div className="md:w-1/2">
        <div className="relative">
          <img 
            src={product.image}
            alt="Big Italian Sofa" 
            className="w-full"
          />
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
            &lt;
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
            &gt;
          </button>
        </div>
        <div className="flex space-x-2 mt-2">
          {product.image.map(index => {
            <img src={index} alt="Thumbnail" className="w-16 h-16 border border-gray-300" />
          })}
        </div>
      </div>
      <div className="md:w-1/2 p-4">
        <h1 className="text-2xl font-bold text-gray">{product.title}</h1>
        <div className="flex items-center mt-2">
          <div className="text-yellow-400 flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current">
                <use href="#star" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-gray">(150)</span>
        </div>
        <p className="text-green-500 mt-2">Availability: In Stock</p>
        <p className="mt-1 text-gray"><span className="font-semibold">Material:</span> Cotton </p>
        <p className="mt-1 text-gray"><span className="font-semibold">Category:</span> {product.category}</p>
        {/* <p className="mt-1"><span className="font-semibold">SKU:</span> BE45VGTRK</p> */}
        <p className="text-3xl font-bold text-light-pink mt-4">Kshs. {product.price} <span className="text-gray-500 line-through">Kshs. {product.price + 48}</span></p>
        <p className="text-gray mt-4">{product.description}</p>
        <div className="mt-4">
          <h2 className="font-semibold mb-2 text-gray">Size</h2>
          <div className="flex space-x-2">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button key={size} className="border border-gray rounded-lg px-4 py-2">{size}</button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h2 className="font-semibold mb-2 text-gray">Color</h2>
          <div className="flex space-x-2">
            {['black', 'blue', 'red', 'gray'].map((color) => (
              <button key={color} className={`w-6 h-6 rounded-full border border-gray bg-${color}-500`}></button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center">

          <h2 className="font-semibold mr-2">Quantity</h2>
          <button className="border rounded-l-lg px-4 py-2" onClick={() => setByingQuantity(buyingQuantity - 1)}>-</button>
          <span className="border-t border-b px-4 py-2">{buyingQuantity < 1 ? setByingQuantity(1) : buyingQuantity}</span>
          <button className="border rounded-r-lg px-4 py-2" onClick={() => setByingQuantity(buyingQuantity + 1)}>+</button>
        </div>
        <div className="mt-4 flex space-x-2">
          <button className="bg-light-pink text-white px-6 py-2 rounded-lg font-bold text-lg" onClick={() => handleAddToCart()}>Add to cart</button>
          <button className="border border-light-pink gray px-6 py-2 rounded-lg text-light-pink font-bold text-lg">Wishlist</button>
          {/*<h2 className="font-semibold mr-2 text-gray">Quantity</h2>*/}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;