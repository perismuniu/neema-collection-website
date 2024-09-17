import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, UserCart, Order, Insight } from "./types";

interface DataState {
  products: Product[];
  loading: boolean;
  isSuccess: boolean;
  error: string | null;
  insights: Insight[];
  userCart: UserCart;
  orders: Order[];
}

const initialState: DataState = {
  products: [],
  loading: false,
  isSuccess: false,
  error: null,
  insights: [],
  userCart: {
    items: [],
    totalQuantity: 0,
    buyingTotalPrice: 0,
    user: null,
  },
  orders: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserCart: (state, action: PayloadAction<UserCart>) => {
      state.userCart = action.payload;
    },
    setInsights: (state, action: PayloadAction<Insight[]>) => {
      state.insights = action.payload;
    },
    setIsSuccess: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.userCart.items.find((item) => item.productId === productId);
      if (item) {
        const newQuantity = Math.max(1, quantity);
        item.buyingQuantity = newQuantity;
        item.buyingItemTotalPrice = item.product.price * newQuantity;
      }
      state.userCart.buyingTotalPrice = state.userCart.items.reduce(
        (total, item) => total + item.buyingItemTotalPrice,
        0
      );
      state.userCart.totalQuantity = state.userCart.items.reduce(
        (total, item) => total + item.buyingQuantity,
        0
      );
    },
  },
});

export const {
  setProducts,
  setUserCart,
  setInsights,
  setOrders,
  setError,
  setIsSuccess,
  setLoading,
  updateCartItemQuantity,
} = dataSlice.actions;

export default dataSlice.reducer;
