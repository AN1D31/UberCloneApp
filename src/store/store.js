import { configureStore } from '@reduxjs/toolkit';
import navReducer from './navSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    nav: navReducer,
    auth: authReducer,
  },
});