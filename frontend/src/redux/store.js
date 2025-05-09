import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import shopReducer from "../redux/features/shop/shopSlice";
import petShopReducer from "../redux/features/petshop/petshopSlice";
import cartReducer from "./features/cart/cartSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    shop: shopReducer,
    petShop: petShopReducer,
    cart: cartReducer,
  },

  preloadedState: {
    // favorites: initialFavorites,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
