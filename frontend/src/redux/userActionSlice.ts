import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    products: [],
    loading: false,
    error: null,
    userCart: [],
    orders: []
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserCart: (state, action) => {
      state.userCart = action.payload;
    },
  },
});

export const {
  setProducts,
  setUserCart,
  setOrders,
  setError,
  setLoading
} = dataSlice.actions;

export const getProducts = async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const res = await axios.get(`http://localhost:3001/api/products`);
    const data = res.data;
    dispatch(setProducts(data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(error(error.response));
    dispatch(setLoading(false));
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
    dispatch(setError(true));
    const res = await axios.get(`http://localhost:3001/api/getcart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data;

    // Use $lookup to fetch product details
    const cartWithProducts = await axios.post(`http://localhost:3001/api/getcartwithproducts`, data.cart);
    console.log(cartWithProducts.data)

    dispatch(setUserCart(cartWithProducts.data));
    dispatch(setLoading(false));
  } catch (error) {
    alert(error.data)

    dispatch(setError(error.response));
    dispatch(setLoading(false));
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

export const removeFromCart = async (dispatch: any, token: any, productId: any) => {
  try {
    const res = await axios.delete(`http://localhost:3001/api/removefromcart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { productId },
    });
    const data = res.data;
    console.log(data)
    dispatch(setUserCart(data));
  } catch (error) {
    console.log(error);
  }
};

export const getOrders = async (dispatch: any, token: any) => {
  try {
    const res = await axios.get(`http://localhost:3001/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data;
    console.log(data)
    dispatch(setOrders(data));
  } catch (error) {
    
  }
}


export const logout = async (token: any, dispatch: any) => {
  try {
    await axios.get("http://localhost:3001/api/auth/logout", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }) 
    dispatch(setUserCart({}))
  } catch (error) {
    alert("Error Logging out!")
  }
}

export default dataSlice.reducer;