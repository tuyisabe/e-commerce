import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase/config';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ orderData, userId }) => {
    try {
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      const order = {
        ...orderData,
        userId,
        status: 'pending',
        createdAt: Date.now(),
      };
      await set(newOrderRef, order);
      return order;
    } catch (error) {
      throw new Error('Failed to create order: ' + error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
