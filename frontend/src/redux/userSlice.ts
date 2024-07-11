import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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

export const login = async (loginData:any, dispatch:any) => {

  try {
    dispatch(setLoginLoading(true))
    const res = await axios.post("http://localhost:3001/api/auth/login", loginData);
    const token = res.data.token;
    const user = res.data.userData; // assuming the API returns the user data without password
    dispatch(setLoginLoading(false))
    dispatch(setCredentials(token));
    dispatch(setUser(user));
    
    return user
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoginLoading(false))
    dispatch(setLoginError(error.response.data))
  }
}



export default userSlice.reducer;