import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Shopping',
      description: 'Browse through our wide range of products and add them to your cart with ease.',
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly and safely to your doorstep.',
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Payments',
      description: 'Multiple payment options available with secure transaction processing.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Buyer Protection',
      description: 'Shop with confidence with our buyer protection policy.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Welcome to Our Store
              </Typography>
              <Typography variant="h5" paragraph>
                Discover amazing products at great prices
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/products')}
                sx={{ mt: 2 }}
              >
                Shop Now
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <img
                src="https://via.placeholder.com/600x400"
                alt="Shopping"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to Start Shopping?
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Join our community of satisfied customers and experience the best in online shopping.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/products')}
            >
              Explore Products
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
