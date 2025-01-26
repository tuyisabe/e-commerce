import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar />
        {user && <Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: user ? { sm: `calc(100% - 240px)` } : '100%',
            ml: user ? { sm: '240px' } : 0,
            mt: '64px',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Box>
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

export default App;
