import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Divider,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AlertContext from '../../context/alert/alertContext';

const NewProductSystem = () => {
  // State
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  
  // Theme colors
  const purpleColor = '#8A70D6'; // Primary purple
  const lightPurple = '#F0EBFF'; // Light purple for backgrounds
  
  // Context
  const alertContext = useContext(AlertContext);
  
  // Add a new product
  const handleAddProduct = () => {
    if (!productName.trim()) return;
    
    const newProduct = {
      id: Date.now(),
      name: productName.trim(),
      createdAt: new Date().toISOString()
    };
    
    setProducts([...products, newProduct]);
    setProductName('');
    
    alertContext.setAlert('Product added', 'success');
  };
  
  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          mt: 4, 
          mb: 2, 
          borderRadius: 3, 
          backgroundColor: '#FFFFFF' 
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          New Product System
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body1" paragraph>
          This is your new product management system. We're starting from scratch with a clean interface.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Add New Product
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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
              disabled={!productName.trim()}
              sx={{
                bgcolor: purpleColor,
                borderRadius: 20,
                minWidth: 150,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#7560C0',
                },
              }}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Product
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Products List */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          my: 4, 
          borderRadius: 3, 
          backgroundColor: '#FFFFFF' 
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
          Products
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {products.length === 0 ? (
          <Box sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 2, 
            border: '1px dashed #E0E0E0',
            backgroundColor: '#FAFAFA'
          }}>
            <Typography variant="body1" color="text.secondary">
              No products added yet. Add your first product above to get started.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 2, 
                    border: '1px solid #E0E0E0',
                    height: '100%'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="h3" fontWeight={600}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Added on {new Date(product.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      
      {/* Help info */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3, 
          backgroundColor: lightPurple 
        }}
      >
        <Typography variant="h6" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body1" paragraph>
          This is just a starting point for your new product system. Next, we'll add:
        </Typography>
        <ul>
          <li><Typography variant="body1">Classification options (Product Family, Category, Subcategory)</Typography></li>
          <li><Typography variant="body1">The ability to add custom classification options</Typography></li>
          <li><Typography variant="body1">Product detail editing</Typography></li>
          <li><Typography variant="body1">Database integration</Typography></li>
        </ul>
      </Paper>
    </Container>
  );
};

export default NewProductSystem; 