import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    products: [],
    errorGettingProducts: null,
    loadingProductsData: false
  },
  reducers: {
    setProducts: (state, action) =>{
      state.products = action.payload
    },
    setErrorGettingProducts: (state, action) => {
      state.errorGettingProducts = action.payload
    },
    setLoadingProductsData: (state, action) => {
      state.loadingProductsData = action.payload
    }
  },
});

export const { setProducts, setErrorGettingProducts, setLoadingProductsData } = dataSlice.actions;

export const getProducts = async (dispatch: any) => {
  try {
    dispatch(setLoadingProductsData(true))
    const res = await axios.get("http://localhost:3001/api/products");
    const data = res.data
    dispatch(setProducts(data))
    dispatch(setLoadingProductsData(false))
  } catch (error) {
    dispatch(setErrorGettingProducts(error.response))
    dispatch(setLoadingProductsData(false))
  }
};

export default dataSlice.reducer;