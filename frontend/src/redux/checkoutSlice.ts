// src/features/checkout/checkoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contactInfo: {
    name: 'Enrico Smith',
    phone: '555-666-7744',
  },
  shippingAddress: {
    firstName: 'Cole',
    lastName: 'Enrico',
    address: '123, Dream Avenue',
    aptSuite: '5BU - DDS',
    city: 'Norris',
    state: 'Texas',
    postalCode: '2500',
    country: 'United States',
    addressType: 'home',
  },
  paymentMethod: 'Google / Apple Wallet',
  orderSummary: [
    { id: 1, name: 'Rey Nylon Backpack', price: 74, qty: 1 },
    { id: 2, name: 'Waffle Knit Beanie', price: 132, qty: 1 },
    { id: 3, name: 'Travel Pet Carrier', price: 28, qty: 1 },
  ],
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateContactInfo: (state, action) => {
      state.contactInfo = action.payload;
    },
    updateShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    updatePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    updateOrderSummary: (state, action) => {
      state.orderSummary = action.payload;
    },
  },
});

export const { updateContactInfo, updateShippingAddress, updatePaymentMethod, updateOrderSummary } = checkoutSlice.actions;
export default checkoutSlice.reducer;
