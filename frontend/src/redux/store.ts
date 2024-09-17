import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dataReducer from "./dataSlice";
import userReducer from "./userSlice";
import searchReducer from "./searchSlice"; // Import the search slice

const dataPersistConfig = {
  key: "data",
  storage,
  whitelist: ["userCart"],
};

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "token"],
};

const persistedDataReducer = persistReducer(dataPersistConfig, dataReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    data: persistedDataReducer,
    auth: persistedUserReducer,
    search: searchReducer, // Add the search reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;