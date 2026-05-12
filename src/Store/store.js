import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '../Redux/cryptoSlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
  },
});
