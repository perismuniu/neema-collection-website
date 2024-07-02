import { createSlice } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    user: {
      isAdmin: false,
      name: null,
      email: null,
      phone: null,
      address: null,
      _id: null,
      wallet: null
    },
    loginError: null,
    loginLoading: false
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoginError: (state, action) => {
      state.loginError = action.payload
    },
    setLoginLoading: (state, action) => {
      state.loginLoading = action.payload
    }
  },
});

export const { setCredentials, setUser, setLoginError, setLoginLoading } = userSlice.actions;

export const login = async (loginData:any, dispatch:any) => {

  try {
    dispatch(setLoginLoading(true))
    const res = await axios.post("http://localhost:3001/api/auth/login", loginData);
    const token = res.data.token;
    const user = res.data.user; // assuming the API returns the user data without password
    localStorage.setItem("neematoken", token);
    dispatch(setCredentials(token));
    dispatch(setUser(user));
  } catch (error) {
    console.log(error);
    dispatch(setLoginError(error.response))
    dispatch(setLoginLoading(false))
  }
}

export default userSlice.reducer;