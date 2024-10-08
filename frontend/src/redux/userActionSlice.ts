import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as io from "socket.io-client";

// const socket = io.connect("http://localhost:3001");

const dataSlice = createSlice({
  name: "data",
  initialState: {
    products: [],
    loading: false,
    isSuccess: false,
    error: null,
    insights: [] ,
    userCart: {
      items: [{
        productId: '',
        buyingQuantity: 0,
        buyingItemTotalPrice: 0,
        product: {
          category: '',
          colors: [],
          createdAt: '',
          description: '',
          image: [],
          price: 0,
          title: '',
          updatedAt: '',
          _id: '',
        },
        _id: '',
      }],
      totalQuantity: 0,
      buyingTotalPrice: 0,
      user: null

    },
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
    setInsights: (state, action) => {
      state.insights = action.payload;
    },
    setIsSuccess: (state, action) => {
      state.isSuccess = action.payload;
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
  setLoading
} = dataSlice.actions;

// export const inSight = (dispatch:any)=> {
//   const interval = setInterval(async () => {      
//     try {
//       socket.emit("get_insight_data");
//       socket.on("insight_data", (response) => {
//           dispatch(setInsights(response));
//         })
//     } catch (error) {
//       setError(error.message);
//     }
//   }, 3000);

//   return () => {
//     clearInterval(interval);
//     socket.off("get_all_products_response");
//   };
// }

export const getProducts = async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const res = await axios.get(`http://localhost:3000/api/products`);
    console.log("Getting products", res.data);
    const data = res.data;
    dispatch(setProducts(data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response.data));
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

export const deleteProduct = async (dispatch:any, id:any, token:any) => {

  try {
    dispatch(setLoading(true))
    const res = await axios.delete(`http://localhost:3001/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    res.status === 200 ? dispatch(getProducts(dispatch)) : alert("something went wrong")
    dispatch(setLoading(false))
    dispatch
  } catch (error) {
    dispatch(setError(error.data))
    dispatch(setLoading(false))
  }
}

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
    // console.log(data);
    dispatch(setUserCart(data));
  } catch (error) {
    console.log(error);
  }
};

export default dataSlice.reducer;