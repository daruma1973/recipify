import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  Grid,
  Card,
  CardContent,
  Link
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import WarningIcon from '@mui/icons-material/Warning';

const ProductSystemReset = () => {
  // Theme colors
  const purpleColor = '#8A70D6'; // Primary purple
  const lightPurple = '#F0EBFF'; // Light purple for backgrounds
  
  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          mt: 4, 
          borderRadius: 3, 
          backgroundColor: '#FFFFFF' 
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Product System Reset
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <WarningIcon sx={{ color: 'warning.main', fontSize: 28, mr: 2 }} />
          <Typography variant="h6">
            Important Information
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          You've requested to completely reset the product management system. This process involves two steps:
        </Typography>
        
        <ol>
          <li>
            <Typography variant="body1" fontWeight={600} paragraph>
              Delete all existing products from the database
            </Typography>
            <Typography variant="body1" paragraph>
              This will permanently remove all product data and cannot be undone.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" fontWeight={600} paragraph>
              Start using the new product system
            </Typography>
            <Typography variant="body1" paragraph>
              After deleting the old data, you'll use a completely new interface to manage products.
            </Typography>
          </li>
        </ol>
      </Paper>
      
      <Grid container spacing={4} sx={{ mt: 2, mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 4, 
              borderRadius: 3, 
              backgroundColor: '#FFF8F8',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DeleteForeverIcon sx={{ color: 'error.main', fontSize: 28, mr: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom fontWeight={600} color="error.main">
                Step 1: Delete All Products
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              This action will permanently remove all products from the database. This cannot be undone and all product data will be lost.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ color: 'error.main', fontWeight: 500 }}>
              Only proceed if you are absolutely sure you want to delete everything.
            </Typography>
            
            <Box sx={{ mt: 'auto', pt: 3 }}>
              <Button
                component={RouterLink}
                to="/reset-products"
                variant="contained"
                color="error"
                startIcon={<DeleteForeverIcon />}
                sx={{ 
                  borderRadius: 20,
                  px: 3,
                  py: 1
                }}
              >
                Go to Reset Tool
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 4, 
              borderRadius: 3, 
              backgroundColor: lightPurple,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AddCircleOutlineIcon sx={{ color: purpleColor, fontSize: 28, mr: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom fontWeight={600} color={purpleColor}>
                Step 2: New Product System
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              After deleting the old data, use this link to access the new product management system. 
            </Typography>
            
            <Typography variant="body1" paragraph>
              The new system provides a clean, fresh start with improved organization and a modern interface.
            </Typography>
            
            <Box sx={{ mt: 'auto', pt: 3 }}>
              <Button
                component={RouterLink}
                to="/new-product-system"
                variant="contained"
                sx={{ 
                  bgcolor: purpleColor,
                  borderRadius: 20,
                  px: 3,
                  py: 1,
                  '&:hover': {
                    bgcolor: '#7560C0',
                  },
                }}
                startIcon={<AddCircleOutlineIcon />}
              >
                Go to New Product System
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductSystemReset; 