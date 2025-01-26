import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, get, set, push, remove, update } from 'firebase/database';
import { db } from '../firebase/config';

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const categoriesRef = ref(db, 'categories');
    const snapshot = await get(categoriesRef);
    if (snapshot.exists()) {
      const categories = [];
      snapshot.forEach((childSnapshot) => {
        categories.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      return categories;
    }
    return [];
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category) => {
    const categoriesRef = ref(db, 'categories');
    const newCategoryRef = push(categoriesRef);
    await set(newCategoryRef, category);
    return {
      id: newCategoryRef.key,
      ...category,
    };
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, category }) => {
    const categoryRef = ref(db, `categories/${id}`);
    await update(categoryRef, category);
    return {
      id,
      ...category,
    };
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id) => {
    const categoryRef = ref(db, `categories/${id}`);
    await remove(categoryRef);
    return id;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((cat) => cat.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
