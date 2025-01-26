import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Helper function to format date
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [value, setValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch orders
        const ordersRef = ref(db, `orders`);
        const ordersSnapshot = await get(ordersRef);
        const ordersData = ordersSnapshot.val();
        
        if (ordersData) {
          const userOrders = Object.entries(ordersData)
            .filter(([_, order]) => order.userId === user.uid)
            .map(([id, order]) => ({
              id,
              ...order,
              date: new Date(order.date),
            }))
            .sort((a, b) => b.date - a.date);
          setOrders(userOrders);
        }

        // Fetch payment methods
        const paymentRef = ref(db, `users/${user.uid}/paymentMethods`);
        const paymentSnapshot = await get(paymentRef);
        const paymentData = paymentSnapshot.val();
        
        if (paymentData) {
          setPaymentMethods(Object.values(paymentData));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  // Return null if no user (will redirect)
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Profile Information" />
            <Tab label="Order History" />
            <Tab label="Payment Methods" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Card>
                <CardContent>
                  <Typography variant="body1">
                    Email: {user.email}
                  </Typography>
                  <Typography variant="body1">
                    Account Type: {user.role === 'admin' ? 'Administrator' : 'Customer'}
                  </Typography>
                  <Typography variant="body1">
                    Member Since: {formatDate(user.createdAt || Date.now())}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Typography variant="h6" gutterBottom>
            Order History
          </Typography>
          <List>
            {orders.length > 0 ? (
              orders.map((order) => (
                <React.Fragment key={order.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          Order #{order.id.slice(-8)} - {formatDate(order.date)}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Total: ${order.total.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Status: <Chip
                              label={order.status}
                              color={order.status === 'completed' ? 'success' : 'warning'}
                              size="small"
                            />
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Payment Method: {order.paymentMethod}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No orders found
              </Typography>
            )}
          </List>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Typography variant="h6" gutterBottom>
            Payment Methods
          </Typography>
          <Grid container spacing={2}>
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        {method.type === 'card' ? 'Credit Card' : method.type}
                      </Typography>
                      {method.type === 'card' && (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            **** **** **** {method.lastFour}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Expires: {method.expiryMonth}/{method.expiryYear}
                          </Typography>
                        </>
                      )}
                      {method.type === 'mobile' && (
                        <Typography variant="body2" color="text.secondary">
                          Mobile Payment Account: {method.account}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">
                  No payment methods saved
                </Typography>
              </Grid>
            )}
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Profile;
