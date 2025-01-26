import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      bgcolor: `${color}.light`,
      color: `${color}.dark`,
    }}
  >
    <Box sx={{ mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="h6" component="div">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Box>
  </Paper>
);

const DashboardStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toFixed(2)}`}
          icon={<TrendingUp />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart />}
          color="info"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<People />}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Inventory />}
          color="error"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
