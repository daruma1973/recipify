import React, { useState, useContext, useEffect } from 'react';
import { 
  Container, 
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
  Snackbar,
  Alert,
  useTheme,
  OutlinedInput
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import AuthContext from '../../context/auth/authContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';

const ProductForm = () => {
  const theme = useTheme();
  const alertContext = useContext(AlertContext);
  const ingredientContext = useContext(IngredientContext);

  // States
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  
  // Custom color scheme
  const purpleColor = '#8A70D6';
  const lightPurple = '#F0EBFF';

  // Product classification options
  const productFamilies = ["Spirit", "Wine", "Beer", "Soft Drink", "Mixer", "Raw Material", "Consumable", "Non-Consumable", "Equipment", "Other"];
  const categories = ["Garnish", "Ingredient", "Tool", "Container", "Packaging", "Cleaning", "Office", "Bar", "Kitchen"];
  
  const subcategories = {
    "Spirit": ["Whiskey", "Vodka", "Gin", "Rum", "Tequila", "Brandy", "Liqueur"],
    "Wine": ["Red", "White", "Rosé", "Sparkling", "Dessert"],
    "Beer": ["Lager", "Ale", "IPA", "Stout", "Porter"],
    "Garnish": ["Fruit", "Herb", "Spice", "Syrup", "Bitters"]
  };

  // Function to add a new product
  const handleAddProduct = () => {
    if (!newProductName.trim()) return;
    
    const newProduct = {
      id: Date.now(),  // Temporary ID
      name: newProductName.trim(),
      productFamily: '',
      category: '',
      subcategory: ''
    };
    
    setProducts([...products, newProduct]);
    setNewProductName('');
    
    // Show success notification
    alertContext.setAlert('Product added', 'success');
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={1} sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: '#FFFFFF' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Product Management
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Product creation form */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Add New Product
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              placeholder="Enter a product name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 20,
                  borderColor: '#E0E0E0',
                  '&:hover fieldset': {
                    borderColor: purpleColor,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: purpleColor,
                  }
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddProduct();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddProduct}
              disabled={!newProductName.trim()}
              sx={{
                bgcolor: purpleColor,
                borderRadius: 20,
                minWidth: 150,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#7560C0',
                },
              }}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        {/* Product list */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Products
          </Typography>
          
          {products.length === 0 ? (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 2,
                borderStyle: 'dashed',
                borderColor: '#E0E0E0'
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No products added yet. Add a product above to get started.
              </Typography>
            </Paper>
          ) : (
            products.map(product => (
              <Paper 
                key={product.id} 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  mb: 2, 
                  borderRadius: 2,
                  position: 'relative',
                  border: '1px solid #E0E0E0',
                }}
              >
                <Typography variant="h6" component="h2" fontWeight={600}>
                  {product.name}
                </Typography>
              </Paper>
            ))
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductForm; 