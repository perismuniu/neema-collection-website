import { useDispatch, useSelector } from 'react-redux';
import { getUserCart, removeFromCart, updateQuantity } from '../redux/userActionSlice';
import { useEffect } from 'react';

const ShoppingCart = () => {
  const cartItems = useSelector((state) => state.data.userCart.items);
  const subtotal = useSelector((state) => state.data.userCart.buyingTotalPrice);
  const shippingEstimate = 5.00;
  const taxEstimate = subtotal * 0.1;
  const orderTotal = subtotal + shippingEstimate + taxEstimate;
  const token = useSelector(state => state.auth.token)
  const userCart = useSelector(state => state.data.userCart)

  console.log(userCart)

  const dispatch = useDispatch();

  useEffect(() => {
    getUserCart(dispatch, token)
  },[])

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    console.log(productId, quantity)
    dispatch(updateQuantity({ productId, quantity }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      <nav className="text-gray-500 mb-4">
        Homepage / Clothing Categories / <span className="font-semibold text-gray-800">Shopping Cart</span>
      </nav>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center border-b py-4">
              <img src={item.product.image[0]} alt={item.product.title} className="w-24 h-24" />
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-semibold">{item.product.title}</h2>
                <p className="text-gray-600">{item.product.category}</p>
                <p className="text-green-500 font-bold">{`$${item.product.price}`}</p>
                <div className="flex items-center mt-2">
                  <button
                    className="text-gray-500"
                    onClick={() => handleQuantityChange(item.productId, item.buyingQuantity - 1)}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.buyingQuantity}</span>
                  <button
                    className="text-gray-500"
                    onClick={() => handleQuantityChange(item.productId, item.buyingQuantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="text-blue-500 ml-4"
                onClick={() => handleRemove(item.productId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="w-full md:w-1/3 md:ml-4 mt-4 md:mt-0">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{`KHs ${subtotal.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping estimate</span>
              <span>{`KHs ${shippingEstimate.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax estimate</span>
              <span>{`KHs ${taxEstimate.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Order total</span>
              <span>{`KHs ${orderTotal.toFixed(2)}`}</span>
            </div>
            <button className="bg-black text-white w-full py-2 rounded-lg">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
