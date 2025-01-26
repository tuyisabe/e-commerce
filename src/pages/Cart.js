import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../redux/cartSlice';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity: parseInt(quantity) }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100%',
                            maxWidth: '100px',
                            height: 'auto',
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography color="textSecondary">
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          type="number"
                          label="Quantity"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          InputProps={{ inputProps: { min: 1 } }}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton
                          onClick={() => handleRemoveItem(item.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    Total Items: {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" color="primary" gutterBottom>
                      Total: ${total.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleCheckout}
                      fullWidth
                    >
                      Proceed to Checkout
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Cart;
