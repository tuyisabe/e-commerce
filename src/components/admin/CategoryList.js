import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../../redux/categorySlice';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';

const CategoryList = () => {
  const dispatch = useDispatch();
  const { items: categories, status, error } = useSelector((state) => state.categories);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editedCategory, setEditedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setEditedCategory(category.name);
    setEditDialogOpen(true);
  };

  const handleDelete = async (category) => {
    try {
      await dispatch(deleteCategory(category.id)).unwrap();
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  const handleSave = async () => {
    try {
      if (!editedCategory.trim()) {
        toast.error('Category name cannot be empty');
        return;
      }

      await dispatch(
        updateCategory({
          id: selectedCategory.id,
          category: { name: editedCategory.trim() },
        })
      ).unwrap();
      
      setEditDialogOpen(false);
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error updating category');
    }
  };

  const handleAdd = async () => {
    try {
      if (!newCategory.trim()) {
        toast.error('Category name cannot be empty');
        return;
      }

      await dispatch(
        addCategory({
          name: newCategory.trim(),
          createdAt: Date.now(),
        })
      ).unwrap();
      
      setAddDialogOpen(false);
      setNewCategory('');
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
    }
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading categories: {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Categories</Typography>
        <Button
          startIcon={<Add />}
          variant="contained"
          color="primary"
          onClick={() => setAddDialogOpen(true)}
        >
          Add Category
        </Button>
      </Box>

      <List>
        {categories.map((category) => (
          <ListItem
            key={category.id}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEdit(category)}
                  sx={{ mr: 1 }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(category)}
                >
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText 
              primary={category.name}
              secondary={`Created: ${new Date(category.createdAt).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CategoryList;
