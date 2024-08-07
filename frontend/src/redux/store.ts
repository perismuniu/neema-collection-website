import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './userSlice';
import dataReducer from "./userActionSlice";
import cartSlice from "./cartSlice"
import searchSlice from './searchSlice';
import checkoutSlice from './checkoutSlice';

// Initialize reducers
const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
  cart: cartSlice,
  search: searchSlice,
  checkout: checkoutSlice
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };




// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { combineReducers } from 'redux';
// import authReducer from './userSlice';
// import dataReducer from "./userActionSlice";
// import cartSlice from "./cartSlice"
// import searchSlice from './searchSlice';
// import checkoutSlice from './checkoutSlice';

// const rootReducer = combineReducers({
//   auth: authReducer,
//   data: dataReducer,
//   cart: cartSlice,
//   search: searchSlice,
//   checkout: checkoutSlice
// });

// const persistConfig = {
//   key: 'root',
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// const persistor = persistStore(store);

// export { store, persistor };