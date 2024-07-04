import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialState = {
  buyingTotalPrice: 0,
  items: [
    {
      productId: '667c2ec516b36d5ff33bcaab',
      buyingQuantity: 33,
      buyingItemTotalPrice: 1650,
      product: {
        category: 'backpacks',
        colors: [],
        createdAt: '2024-07-02T20:48:40.607Z',
        description: 'Stylish and durable backpack',
        image: ['https://res.cloudinary.com/dhoopmcrq/image/upload/v1719953314/nerc07yzj9g5hwgvotvf.png'],
        price: 50,
        title: 'Rey Nylon Backpack',
        updatedAt: '2024-07-02T20:48:40.607Z',
        _id: '668467a87754637cba85238f',
      },
      _id: '6684915024481ca01b606756',
    },
    {
      productId: '668467a87754637cba85238f',
      buyingQuantity: 5,
      buyingItemTotalPrice: 255,
      product: {
        category: 'panties',
        colors: [],
        createdAt: '2024-07-02T20:48:40.607Z',
        description: 'Comfortable and breathable',
        image: ['https://res.cloudinary.com/dhoopmcrq/image/upload/v1719953314/nerc07yzj9g5hwgvotvf.png'],
        price: 51,
        title: 'iyuuiuui',
        updatedAt: '2024-07-02T20:48:40.607Z',
        _id: '668467a87754637cba85238f',
      },
      _id: '668492bd24481ca01b606771',
    },
  ],
  user: '668345d6c188cc9b30d57434',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.buyingQuantity = quantity;
        item.buyingItemTotalPrice = item.product.price * quantity;
      }
      state.buyingTotalPrice = state.items.reduce((total, item) => total + item.buyingItemTotalPrice, 0);
    },
  },
});

export const { removeFromCart, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;
