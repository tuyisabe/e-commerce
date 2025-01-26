import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  ShoppingCart,
  Category,
  Inventory,
  Person,
  Home,
  Settings,
  AdminPanelSettings,
} from '@mui/icons-material';

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const drawerWidth = 240;

  const commonRoutes = [
    { name: 'Home', path: '/', icon: <Home /> },
    { name: 'Products', path: '/products', icon: <Inventory /> },
    { name: 'Cart', path: '/cart', icon: <ShoppingCart /> },
  ];

  const adminRoutes = [
    { name: 'Admin Dashboard', path: '/admin', icon: <Dashboard /> },
    { name: 'Manage Products', path: '/admin/products', icon: <Inventory /> },
    { name: 'Manage Categories', path: '/admin/categories', icon: <Category /> },
  ];

  const userRoutes = [
    { name: 'Profile', path: '/profile', icon: <Person /> },
    { name: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  const getRoutes = () => {
    const routes = [...commonRoutes];
    if (user) {
      routes.push(...userRoutes);
      if (user.role === 'admin') {
        routes.push({ name: 'Admin', path: '/admin', icon: <AdminPanelSettings /> });
      }
    }
    return routes;
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(2),
          color: theme.palette.primary.main,
        }}
      >
        <ShoppingCart sx={{ mr: 1 }} />
        <Typography variant="h6" component="div">
          E-Commerce
        </Typography>
      </Box>
      <Divider />
      <List>
        {getRoutes().map((route) => (
          <ListItem
            button
            key={route.path}
            onClick={() => navigate(route.path)}
            sx={{
              backgroundColor: isActive(route.path)
                ? theme.palette.action.selected
                : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(route.path)
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              }}
            >
              {route.icon}
            </ListItemIcon>
            <ListItemText
              primary={route.name}
              sx={{
                color: isActive(route.path)
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          left: open ? drawerWidth : 0,
          top: theme.spacing(1),
          zIndex: theme.zIndex.drawer + 2,
          bgcolor: theme.palette.background.paper,
          boxShadow: 1,
          display: isMobile ? 'flex' : 'none',
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
