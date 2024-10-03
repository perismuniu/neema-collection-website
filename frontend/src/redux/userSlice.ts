import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const userSlice = createSlice({
  name: 'auth',
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
   logout: null,
    loginError: "",
    loginLoading: false,
    logoutError: null
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
    },
    setLogoutError: (state, action) => {
      state.logoutError = action.payload
    },
    setLogout: (state, action) => {
      state.logout = action.payload
    }
  },
});

export const { setCredentials, setUser, setLoginError, setLoginLoading, setLogout } = userSlice.actions;



export default userSlice.reducer;