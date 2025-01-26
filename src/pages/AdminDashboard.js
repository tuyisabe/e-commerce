import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ref, get, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { addProduct } from '../redux/productSlice';
import { fetchCategories } from '../redux/categorySlice';
import { initializeDatabase, initializeUsers } from '../utils/initializeDatabase';
import DashboardStats from '../components/admin/DashboardStats';
import ProductList from '../components/admin/ProductList';
import CategoryList from '../components/admin/CategoryList';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [products, setProducts] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch orders for sales and order stats
        const ordersRef = ref(db, 'orders');
        const ordersSnapshot = await get(ordersRef);
        const ordersData = ordersSnapshot.val() || {};
        
        const totalSales = Object.values(ordersData).reduce(
          (sum, order) => sum + order.total,
          0
        );
        const totalOrders = Object.keys(ordersData).length;

        // Fetch customers
        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);
        const usersData = usersSnapshot.val() || {};
        const totalCustomers = Object.values(usersData).filter(
          user => user.role === 'customer'
        ).length;

        // Fetch products
        const productsRef = ref(db, 'products');
        onValue(productsRef, (snapshot) => {
          const productsData = snapshot.val() || {};
          setProducts(productsData);
          setStats({
            totalSales,
            totalOrders,
            totalCustomers,
            totalProducts: Object.keys(productsData).length,
          });
          setLoading(false);
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      setImageUpload(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUpload(null);
    setImagePreview(null);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = 'https://via.placeholder.com/300';

      if (imageUpload) {
        // Sanitize filename and create unique name
        const sanitizedName = imageUpload.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `${Date.now()}_${sanitizedName}`;
        const imageRef = storageRef(storage, `products/${filename}`);
        
        // Set metadata with CORS headers
        const metadata = {
          contentType: imageUpload.type,
          customMetadata: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD',
          }
        };

        try {
          // Upload with metadata
          const snapshot = await uploadBytes(imageRef, imageUpload, { metadata });
          imageUrl = await getDownloadURL(snapshot.ref);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }

      const product = {
        ...newProduct,
        id: Date.now().toString(),
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        image: imageUrl,
      };

      await dispatch(addProduct(product));
      setNewProduct({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
        image: '',
      });
      setImageUpload(null);
      setImagePreview(null);
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeDatabase = async () => {
    try {
      await initializeDatabase();
      dispatch(fetchCategories());
      toast.success('Database initialized with sample data');
    } catch (error) {
      toast.error('Error initializing database: ' + error.message);
    }
  };

  const handleInitializeUsers = async () => {
    try {
      await initializeUsers();
      toast.success('Sample users created successfully');
      toast.info('Admin: admin@example.com / admin123');
      toast.info('Customer: customer@example.com / customer123');
    } catch (error) {
      toast.error('Error creating sample users: ' + error.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleInitializeDatabase}
            >
              Initialize Database with Sample Data
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleInitializeUsers}
            >
              Create Sample Users
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab label="Dashboard" />
          <Tab label="Products" />
          <Tab label="Categories" />
          <Tab label="Add New" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <Typography variant="h6" gutterBottom>
            Dashboard Overview
          </Typography>
          <DashboardStats stats={stats} loading={loading} />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Typography variant="h6" gutterBottom>
            Manage Products
          </Typography>
          <ProductList
            products={products}
            categories={categories}
            onProductUpdate={() => {}}
          />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Typography variant="h6" gutterBottom>
            Manage Categories
          </Typography>
          <CategoryList />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Add New Product
                </Typography>
                <form onSubmit={handleProductSubmit}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    margin="normal"
                    required
                  />
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    margin="normal"
                    required
                  />
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="product-image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="product-image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCamera />}
                        fullWidth
                      >
                        Upload Product Image
                      </Button>
                    </label>
                    {imagePreview && (
                      <Box sx={{ mt: 2, position: 'relative' }}>
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          style={{
                            width: '100%',
                            maxHeight: '200px',
                            objectFit: 'contain',
                          }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'background.paper',
                          }}
                          onClick={handleRemoveImage}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Add Product'}
                  </Button>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
