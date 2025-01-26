import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { createOrder } from '../redux/orderSlice';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';

const steps = ['Shipping address', 'Payment details', 'Review order'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast.error('Please log in to proceed with checkout');
    }
    if (items.length === 0) {
      navigate('/cart');
      toast.error('Your cart is empty');
    }
  }, [user, items, navigate]);

  const validateShippingData = () => {
    const newErrors = {};
    
    if (shippingData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    if (shippingData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    if (shippingData.address.trim().length < 5) {
      newErrors.address = 'Please enter a valid address';
    }
    if (shippingData.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }
    if (shippingData.state.trim().length < 2) {
      newErrors.state = 'Please enter a valid state';
    }
    if (!/^\d{5}(-\d{4})?$/.test(shippingData.zip)) {
      newErrors.zip = 'Please enter a valid ZIP code';
    }
    if (!/^\d{10}$/.test(shippingData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCardData = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!/^\d{3,4}$/.test(cardData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setErrors({});
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShippingData()) {
      handleNext();
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validateCardData()) {
      handleNext();
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        shipping: shippingData,
        payment: {
          method: paymentMethod,
          details: paymentMethod === 'card' ? {
            cardNumber: cardData.cardNumber.slice(-4),
            expiryDate: cardData.expiryDate
          } : {}
        }
      };

      await dispatch(createOrder({ orderData, userId: user.uid })).unwrap();
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error('Failed to place order: ' + err.message);
    }
  };

  const handleShippingChange = (field) => (e) => {
    const value = e.target.value;
    setShippingData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCardDataChange = (field) => (e) => {
    const value = e.target.value;
    setCardData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const AddressForm = () => (
    <form onSubmit={handleShippingSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="First name"
            value={shippingData.firstName}
            onChange={handleShippingChange('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Last name"
            value={shippingData.lastName}
            onChange={handleShippingChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address"
            value={shippingData.address}
            onChange={handleShippingChange('address')}
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            value={shippingData.city}
            onChange={handleShippingChange('city')}
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="State"
            value={shippingData.state}
            onChange={handleShippingChange('state')}
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="ZIP code"
            value={shippingData.zip}
            onChange={handleShippingChange('zip')}
            error={!!errors.zip}
            helperText={errors.zip}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Phone number"
            value={shippingData.phone}
            onChange={handleShippingChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button type="submit" variant="contained">
          Next
        </Button>
      </Box>
    </form>
  );

  const PaymentForm = () => (
    <form onSubmit={handlePaymentSubmit}>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="card" control={<Radio />} label="Credit Card" />
          <FormControlLabel value="mobile" control={<Radio />} label="Mobile Payment" />
          <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
        </RadioGroup>
      </FormControl>

      {paymentMethod === 'card' && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Card number"
              value={cardData.cardNumber}
              onChange={handleCardDataChange('cardNumber')}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              inputProps={{ maxLength: 16 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Expiry date"
              placeholder="MM/YY"
              value={cardData.expiryDate}
              onChange={handleCardDataChange('expiryDate')}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              inputProps={{ maxLength: 5 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="CVV"
              type="password"
              value={cardData.cvv}
              onChange={handleCardDataChange('cvv')}
              error={!!errors.cvv}
              helperText={errors.cvv}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack}>Back</Button>
        <Button type="submit" variant="contained">
          Next
        </Button>
      </Box>
    </form>
  );

  const ReviewOrder = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={item.name}
              secondary={`Quantity: ${item.quantity}`}
            />
            <Typography variant="body2">
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItem>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${total.toFixed(2)}
          </Typography>
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Shipping
      </Typography>
      <Typography gutterBottom>
        {shippingData.firstName} {shippingData.lastName}
      </Typography>
      <Typography gutterBottom>
        {shippingData.address}
      </Typography>
      <Typography gutterBottom>
        {shippingData.city}, {shippingData.state} {shippingData.zip}
      </Typography>
      <Typography gutterBottom>
        Phone: {shippingData.phone}
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Payment Method
      </Typography>
      <Typography gutterBottom>
        {paymentMethod === 'card'
          ? `Credit Card (ending in ${cardData.cardNumber.slice(-4)})`
          : paymentMethod === 'mobile'
          ? 'Mobile Payment'
          : 'Cash on Delivery'}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack}>Back</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlaceOrder}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Place Order'
          )}
        </Button>
      </Box>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm />;
      case 1:
        return <PaymentForm />;
      case 2:
        return <ReviewOrder />;
      default:
        throw new Error('Unknown step');
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {getStepContent(activeStep)}
      </Paper>
    </Container>
  );
};

export default Checkout;
