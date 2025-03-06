import React, { useState, useContext, useEffect } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  Select, 
  MenuItem, 
  Box,
  Paper,
  Divider,
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';

const IngredientForm = () => {
  const alertContext = useContext(AlertContext);
  const ingredientContext = useContext(IngredientContext);
  const { setAlert } = alertContext;
  const { addIngredient, updateIngredient, current, clearCurrent, getIngredient } = ingredientContext;
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Form state
  const [ingredient, setIngredient] = useState({
    name: '',
    productFamily: '',
    category: '',
    subcategory: '',
    abv: '',
    region: '',
    producer: '',
    rawMaterial: '',
    vintage: '',
    appellation: '',
    wineStyle: '',
    grapeVariety: '',
    color: '',
    sweetness: '',
    body: '',
    price: '',
    stock: '',
    location: '',
    status: 'Active'
  });

  // Load ingredient data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      getIngredient(id);
    } else {
      clearCurrent();
    }
    // eslint-disable-next-line
  }, [id]);

  // Set form data when current changes
  useEffect(() => {
    if (current) {
      setIngredient(current);
    }
  }, [current]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngredient({
      ...ingredient,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!ingredient.name) {
      setAlert('Please enter a product name', 'error');
      return;
    }

    if (isEditMode) {
      updateIngredient(ingredient);
      setAlert('Product updated', 'success');
    } else {
      addIngredient(ingredient);
      setAlert('Product added', 'success');
    }

    // Navigate back to inventory list
    navigate('/inventory');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </Typography>
      
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider style={{ marginBottom: '20px' }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={ingredient.name}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={ingredient.status || 'Active'}
                  onChange={handleChange}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Low Stock">Low Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Product Family</InputLabel>
                <Select
                  name="productFamily"
                  value={ingredient.productFamily || ''}
                  onChange={handleChange}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Spirit">Spirit</MenuItem>
                  <MenuItem value="Wine">Wine</MenuItem>
                  <MenuItem value="Beer">Beer</MenuItem>
                  <MenuItem value="Soft Drink">Soft Drink</MenuItem>
                  <MenuItem value="Mixer">Mixer</MenuItem>
                  <MenuItem value="Raw Material">Raw Material</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={ingredient.category || ''}
                  onChange={handleChange}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Red Wine">Red Wine</MenuItem>
                  <MenuItem value="White Wine">White Wine</MenuItem>
                  <MenuItem value="Rosé Wine">Rosé Wine</MenuItem>
                  <MenuItem value="Sparkling Wine">Sparkling Wine</MenuItem>
                  <MenuItem value="Dessert Wine">Dessert Wine</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  name="subcategory"
                  value={ingredient.subcategory || ''}
                  onChange={handleChange}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Cabernet Sauvignon">Cabernet Sauvignon</MenuItem>
                  <MenuItem value="Merlot">Merlot</MenuItem>
                  <MenuItem value="Pinot Noir">Pinot Noir</MenuItem>
                  <MenuItem value="Chardonnay">Chardonnay</MenuItem>
                  <MenuItem value="Sauvignon Blanc">Sauvignon Blanc</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Wine Details */}
            <Grid item xs={12} style={{ marginTop: '20px' }}>
              <Typography variant="h6" gutterBottom>
                Wine Details
              </Typography>
              <Divider style={{ marginBottom: '20px' }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ABV %"
                name="abv"
                value={ingredient.abv || ''}
                onChange={handleChange}
                type="number"
                inputProps={{ step: 0.1 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Region"
                name="region"
                value={ingredient.region || ''}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Producer"
                name="producer"
                value={ingredient.producer || ''}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Raw Material"
                name="rawMaterial"
                value={ingredient.rawMaterial || ''}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Vintage"
                name="vintage"
                value={ingredient.vintage || ''}
                onChange={handleChange}
                type="number"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Appellation"
                name="appellation"
                value={ingredient.appellation || ''}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Wine Style"
                name="wineStyle"
                value={ingredient.wineStyle || ''}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Grape Variety"
                name="grapeVariety"
                value={ingredient.grapeVariety || ''}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={ingredient.color || ''}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sweetness"
                name="sweetness"
                value={ingredient.sweetness || ''}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Body"
                name="body"
                value={ingredient.body || ''}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Inventory Details */}
            <Grid item xs={12} style={{ marginTop: '20px' }}>
              <Typography variant="h6" gutterBottom>
                Inventory Details
              </Typography>
              <Divider style={{ marginBottom: '20px' }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                value={ingredient.price || ''}
                onChange={handleChange}
                type="number"
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                value={ingredient.stock || ''}
                onChange={handleChange}
                type="number"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={ingredient.location || ''}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12} style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={isEditMode ? <EditIcon /> : <AddIcon />}
              >
                {isEditMode ? 'Update Product' : 'Add Product'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => navigate('/inventory')}
                style={{ marginLeft: '10px' }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default IngredientForm; 