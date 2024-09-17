import axios from "axios";
import { AppDispatch } from "./store";
import {
  setProducts,
  setUserCart,
  setInsights,
  setOrders,
  setError,
  setLoading,
  setIsSuccess,
} from "./dataSlice";
import { Product, UserCart, Order, PaymentInitiation } from "./types";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProducts = async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get<Product[]>("/products");
    dispatch(setProducts(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch products"));
    dispatch(setLoading(false));
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
};

export const deleteProduct = async (dispatch: AppDispatch, id: string, token: string) => {
  try {
    dispatch(setLoading(true));
    await api.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getProducts(dispatch)
    dispatch(setIsSuccess(true));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to delete product"));
    dispatch(setLoading(false));
  }
};

export const  getUserCart = async (dispatch: AppDispatch, token: string) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get<{ cart: UserCart }>("/getcart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setUserCart(response.data.cart));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch user cart"));
    dispatch(setLoading(false));
  }
};

export const addToCart = async (
  dispatch: AppDispatch,
  token: string,
  productId: string,
  buyingQuantity: number
) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post<UserCart>(
      `/addtocart/${productId}`,
      { buyingQuantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(setUserCart(response.data));
    dispatch(setLoading(false));
    dispatch(setIsSuccess(true));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to add item to cart"));
    dispatch(setLoading(false));
  }
};

export const getOrders = async (dispatch: AppDispatch, token: string) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get<Order[]>("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setOrders(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch orders"));
    dispatch(setLoading(false));
  }
};

export const initiatePayment = async (
  dispatch: AppDispatch,
  token: string,
  paymentDetails: PaymentInitiation
): Promise<string> => {
  try {
    dispatch(setLoading(true));
    const response = await api.post<{ transactionId: string }>(
      "/initiate-payment",
      paymentDetails,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(setLoading(false));
    return response.data.transactionId;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to initiate payment"));
    dispatch(setLoading(false));
    throw error;
  }
};

export const confirmPayment = async (
  dispatch: AppDispatch,
  token: string,
  transactionId: string
): Promise<boolean> => {
  try {
    dispatch(setLoading(true));
    const response = await api.post<{ success: boolean }>(
      "/confirm-payment",
      { transactionId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(setLoading(false));
    return response.data.success;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to confirm payment"));
    dispatch(setLoading(false));
    throw error;
  }
};
