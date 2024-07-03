import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    products: [],
    errorGettingProducts: null,
    loadingProductsData: false,
    loadingUserCart: false,
    errorGettingUserOreders: null,
    userCartProducts: [],
    userCart: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setErrorGettingProducts: (state, action) => {
      state.errorGettingProducts = action.payload;
    },
    setErrorGettingUserCart: (state, action) => {
      state.errorGettingUserOreders = action.payload;
    },
    setLoadingProductsData: (state, action) => {
      state.loadingProductsData = action.payload;
    },
    setUserCart: (state, action) => {
      state.userCart = action.payload;
    },
    setLoadingUserCart: (state, action) => {
      state.loadingUserCart = action.payload;
    },
    setUserCartProducts: (state, action) => {
      state.userCartProducts = action.payload;
    }
  },
});

export const {
  setProducts,
  setErrorGettingProducts,
  setLoadingProductsData,
  setUserCart,
  setLoadingUserCart,
  setErrorGettingUserCart,
  setUserCartProducts
} = dataSlice.actions;

export const getProducts = async (dispatch: any) => {
  try {
    dispatch(setLoadingProductsData(true));
    const res = await axios.get("http://localhost:3001/api/products");
    const data = res.data;
    dispatch(setProducts(data));
    dispatch(setLoadingProductsData(false));
  } catch (error) {
    dispatch(setErrorGettingProducts(error.response));
    dispatch(setLoadingProductsData(false));
  }
};

export const getProductById = async (id: any) => {
  console.log(id);
  try {
    const res = await axios.get(`http://localhost:3001/api/products/${id}`);
    const d = res.data;
    return d;
  } catch (error) {
    console.log(error);
    alert("error getting product");
  }
};
export const getUserCart = async (dispatch: any, token: any) => {
  try {
    dispatch(setErrorGettingUserCart(true));
    const res = await axios.get(`http://localhost:3001/api/getcart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data;
    console.log(data);
    dispatch(setUserCart(data.cart));
    dispatch(setUserCartProducts(data.cartProducts))
    dispatch(setLoadingUserCart(false));
  } catch (error) {
    dispatch(setErrorGettingUserCart(error.response));
    dispatch(setErrorGettingUserCart(false));
  }
};

export const addToCart = async (
  dispatch: any,
  token: any,
  productId: any,
  buyingQuantity: number
) => {
  try {
    const res = await axios.post(
      `http://localhost:3001/api/addtocart/${productId}`,
      {
        buyingQuantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = res.data;
    console.log(data);
    dispatch(setUserCart(data));
  } catch (error) {
    console.log(error);
  }
};

export default dataSlice.reducer;
