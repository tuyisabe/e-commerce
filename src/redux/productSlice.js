import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, get, set, update } from 'firebase/database';
import { db } from '../firebase/config';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const productsRef = ref(db, 'products');
    const snapshot = await get(productsRef);
    const data = snapshot.val();
    // Convert the object to array if data exists, otherwise return empty array
    if (!data) return [];
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product) => {
    const productsRef = ref(db, `products/${product.id}`);
    await set(productsRef, product);
    return product;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updates }) => {
    const productRef = ref(db, `products/${id}`);
    await update(productRef, updates);
    return { id, updates };
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        if (!state.items) state.items = [];
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const existingProduct = state.items.find(product => product.id === id);
        if (existingProduct) {
          Object.assign(existingProduct, updates);
        }
      });
  },
});

export default productSlice.reducer;
