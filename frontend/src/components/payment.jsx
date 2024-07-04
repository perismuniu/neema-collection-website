// src/components/Checkout.js
import { useSelector, useDispatch } from 'react-redux';
import { updateContactInfo, updatePaymentMethod, updateShippingAddress } from '../redux/checkoutSlice';
const Payment = () => {
  const dispatch = useDispatch();
  const contactInfo = useSelector((state) => state.checkout.contactInfo);
  const shippingAddress = useSelector((state) => state.checkout.shippingAddress);
  const paymentMethod = useSelector((state) => state.checkout.paymentMethod);
  const orderSummary = useSelector((state) => state.checkout.orderSummary);

  const subtotal = orderSummary.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingEstimate = 5.00;
  const taxEstimate = subtotal * 0.10;
  const orderTotal = subtotal + shippingEstimate + taxEstimate;

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateContactInfo({ ...contactInfo, [name]: value }));
  };

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateShippingAddress({ ...shippingAddress, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    dispatch(updatePaymentMethod(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 flex">
        <div className="w-2/3 pr-4">
          <h2 className="text-xl font-semibold mb-4">Checkout</h2>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Contact Info</h3>
            <div className="border p-4 rounded-lg">
              <input
                type="text"
                name="name"
                value={contactInfo.name}
                onChange={handleContactInfoChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Name"
              />
              <input
                type="text"
                name="phone"
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
                className="w-full p-2 border rounded"
                placeholder="Phone"
              />
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <div className="border p-4 rounded-lg">
              <input
                type="text"
                name="firstName"
                value={shippingAddress.firstName}
                onChange={handleShippingAddressChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastName"
                value={shippingAddress.lastName}
                onChange={handleShippingAddressChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Last Name"
              />
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleShippingAddressChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Address"
              />
              <input
                type="text"
                name="aptSuite"
                value={shippingAddress.aptSuite}
                onChange={handleShippingAddressChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Apt, Suite"
              />
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleShippingAddressChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="City"
              />
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleShippingAddressChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="State/Province"
              />
              <input
                type="text"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleShippingAddressChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Postal Code"
              />
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleShippingAddressChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Country"
              />
              <div className="flex items-center">
                <input
                  type="radio"
                  name="addressType"
                  value="home"
                  checked={shippingAddress.addressType === 'home'}
                  onChange={handleShippingAddressChange}
                  className="mr-2"
                />
                <label>Home (All Day Delivery)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="addressType"
                  value="office"
                  checked={shippingAddress.addressType === 'office'}
                  onChange={handleShippingAddressChange}
                  className="mr-2"
                />
                <label>Office (Delivery 9 AM - 5 PM)</label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <div className="border p-4 rounded-lg">
              <input
                type="text"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                className="w-full p-2 border rounded"
                placeholder="Payment Method"
              />
            </div>
          </div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Save and Next to Payment</button>
        </div>
        <div className="w-1/3 pl-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="border p-4 rounded-lg mb-4">
            {orderSummary.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                </div>
                <p>${item.price}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Shipping Estimate</p>
                <p>${shippingEstimate.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Tax Estimate</p>
                <p>${taxEstimate.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-semibold">
                <p>Order Total</p>
                <p>${orderTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full">Confirm Order</button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
