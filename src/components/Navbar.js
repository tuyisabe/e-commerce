import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Badge,
  useTheme,
} from '@mui/material';
import {
  AccountCircle,
  ShoppingCart,
  ExitToApp,
  Home,
  Inventory,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
         
          SURE SHOP
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!user && (
            <>
              <Button
                color="inherit"
                startIcon={<Home />}
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Button
                color="inherit"
                startIcon={<Inventory />}
                onClick={() => navigate('/products')}
              >
                Products
              </Button>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}

          {user && (
            <>
              <IconButton
                color="inherit"
                onClick={() => navigate('/cart')}
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton
                onClick={handleMenu}
                color="inherit"
                edge="end"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
