import { configureStore } from '@reduxjs/toolkit';
import authReducer from './userSlice';
import dataReducer from "./userActionSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

});

export default store