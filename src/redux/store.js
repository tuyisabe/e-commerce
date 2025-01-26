import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    categories: categoryReducer,
  },
});
