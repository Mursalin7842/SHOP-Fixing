import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/productSlice';
import ordersReducer from '../features/orderSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
  },
});
