import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './reducers/productsReducer';
import ordersReducer from './reducers/ordersReducer';
import payoutsReducer from '../features/payoutSlice';
import supportReducer from '../features/supportSlice';
import notificationsReducer from '../features/notificationsSlice';
import shopsReducer from '../features/shopsSlice';
import profileReducer from '../features/profileSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
  payouts: payoutsReducer,
  shops: shopsReducer,
  support: supportReducer,
  profile: profileReducer,
  notifications: notificationsReducer,
  },
});

// persist slices lightly in localStorage
try {
  if (typeof window !== 'undefined') {
    store.subscribe(() => {
      const s = store.getState();
      try {
        localStorage.setItem('seller_payouts_state', JSON.stringify(s.payouts));
        localStorage.setItem('seller_shops_state', JSON.stringify(s.shops));
        localStorage.setItem('seller_support_state', JSON.stringify(s.support));
        localStorage.setItem('seller_profile_state', JSON.stringify(s.profile));
      } catch {
        // ignore storage errors
      }
    });
  }
} catch {
  // ignore storage errors
}

export default store;
