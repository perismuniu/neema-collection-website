import { useDispatch, useSelector } from 'react-redux';
import { getUserCart, setIsSuccess } from '../redux/userActionSlice';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toast } from 'primereact/toast';


const ShoppingCart = () => {
  const cartItems = useSelector((state) => state.data.userCart.items);
  const subtotal = useSelector((state) => state.data.userCart.buyingTotalPrice);
  const shippingEstimate = 5.00;
  const taxEstimate = subtotal * 0.1;
  const orderTotal = subtotal + shippingEstimate + taxEstimate;
  const token = useSelector(state => state.auth.token);
  const toast = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(" I am runnig")
    getUserCart(dispatch, token);
  }, []);

  const showToast = (message) => {
    toast.current.show({severity:'success', summary: 'Success', detail: message, life: 3000});
}

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3001/api/removefromcart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      getUserCart(dispatch, token);
      showToast("Item removed from cart")
      dispatch(setIsSuccess(true));
    } catch (err) {
      console.log(err);
    }
  };

  console.log(cartItems)

  const handleQuantityChange = async (itemID, quantity, {message}) => {
    try {
      await axios.put(`http://localhost:3001/api/updatequantity`, { itemId: itemID, quantity }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      showToast(message)
      getUserCart(dispatch, token);
      dispatch(setIsSuccess(true));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      <nav className="text-gray-500 mb-4">
        Homepage / Clothing Categories / <span className="font-semibold text-gray-800">Shopping Cart</span>
      </nav>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          {cartItems.map((item) => (
            item._id?
            <div key={item._id} className="flex items-center border-b py-4">
            <img src={item.productId.image[0]} alt={item.productId.title} className="w-24 h-24" />
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-semibold">{item.productId?.title}</h2>
              <p className="text-gray-600">{item.productId?.category}</p>
              <p className="text-green-500 font-bold">{`KHs${item.productId?.price}`}</p>
              <div className="flex items-center mt-2">
                <button
                  className="text-gray-500"
                  onClick={() => handleQuantityChange(item._id, item.buyingQuantity - 1, {message: "Item quantity decreased"})}
                >
                  -
                </button>
                <span className="mx-2" min={1}>{item.buyingQuantity}</span>
                <button
                  className="text-gray-500"
                  onClick={() => handleQuantityChange(item._id, item.buyingQuantity + 1, {message: "Item quantity increased"})}
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="text-blue-500 ml-4"
              onClick={() => handleRemove(item._id)}
            >
              Remove
            </button>
            </div>
            : <div key={item.productId} className="flex items-center border-b py-4 justify-between">
              <p>This product is no more available</p>
              <button
              className="text-blue-500 ml-4"
              onClick={() => handleRemove(item._id)}
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
              <span>{`KHs ${subtotal?.toFixed(2)}`}</span>
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
            <button className="bg-black text-white w-full py-2 rounded-lg" onClick={() => navigate("/cart/checkout")}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
