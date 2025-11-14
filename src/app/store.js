import { configureStore } from '@reduxjs/toolkit';
import productsReducer from "./slices/products";
import settingsReducer from "./slices/settings";
import userReducer from "./slices/user";

export const store = configureStore({
  reducer: {
     products: productsReducer,
     user: userReducer,
     settings: settingsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Timestamp'leri ignore et (zaten string'e çeviriyoruz)
        ignoredActions: ['products/fetchProducts/fulfilled', 'products/fetchProductById/fulfilled'],
        ignoredPaths: ['products.products', 'products.single'],
      },
    }),
});
