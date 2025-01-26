import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit, Delete, Image } from '@mui/icons-material';
import { ref, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { fetchCategories } from '../../redux/categorySlice';
import { toast } from 'react-toastify';

const ProductList = ({ products, onProductUpdate }) => {
  const dispatch = useDispatch();
  const { items: categories, status: categoryStatus } = useSelector((state) => state.categories);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialog, setEditDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditDialog(true);
  };

  const handleCloseDialog = () => {
    setEditDialog(false);
    setEditProduct(null);
    setImageUpload(null);
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImageUpload(event.target.files[0]);
    }
  };

  const handleSaveProduct = async () => {
    try {
      let imageUrl = editProduct.image;

      if (imageUpload) {
        const imageRef = storageRef(storage, `products/${editProduct.id}/${imageUpload.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const productRef = ref(db, `products/${editProduct.id}`);
      await update(productRef, {
        ...editProduct,
        image: imageUrl,
      });

      toast.success('Product updated successfully');
      onProductUpdate();
      handleCloseDialog();
    } catch (error) {
      toast.error('Error updating product: ' + error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const productRef = ref(db, `products/${productId}`);
        await remove(productRef);
        toast.success('Product deleted successfully');
        onProductUpdate();
      } catch (error) {
        toast.error('Error deleting product: ' + error.message);
      }
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(products || {})
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(([id, product]) => (
                <TableRow key={id}>
                  <TableCell>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick({ id, ...product })}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteProduct(id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Object.keys(products || {}).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={editDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {editProduct && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Product Name"
                value={editProduct.name}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
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
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={editProduct.quantity}
                onChange={(e) => setEditProduct({ ...editProduct, quantity: parseInt(e.target.value) })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={editProduct.description}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                margin="normal"
              />
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="edit-product-image"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="edit-product-image">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Image />}
                    fullWidth
                  >
                    Change Product Image
                  </Button>
                </label>
                {imageUpload && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    New image selected: {imageUpload.name}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductList;
