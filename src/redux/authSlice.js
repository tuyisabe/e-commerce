import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAdmin: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state, action) => {
      state.user = action.payload;
      state.isAdmin = action.payload?.role === 'admin';
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { authenticateUser: login, logout, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;
