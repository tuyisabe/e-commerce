import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';
import { fetchCategories } from '../redux/categorySlice';
import { addToCart } from '../redux/cartSlice';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';

const Products = () => {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity > product.quantity) {
      toast.error('Not enough stock available');
      return;
    }
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity
    }));
    toast.success('Product added to cart');
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(value)
    });
  };

  // Handle loading state
  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (status === 'failed') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">Error loading products: {error}</Typography>
      </Box>
    );
  }

  const productsList = products || [];
  const filteredProducts = selectedCategory === 'all'
    ? productsList
    : productsList.filter(product => product.category === selectedCategory);

  // Handle empty products state
  if (productsList.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <Typography variant="h5" color="textSecondary">
                No products available. Please check back later.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.image || 'https://via.placeholder.com/140'}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ${product.price?.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available: {product.quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantities[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  InputProps={{ inputProps: { min: 1, max: product.quantity } }}
                  size="small"
                  sx={{ mr: 2 }}
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity === 0}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
