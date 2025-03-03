import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          mt: 8, 
          mb: 6, 
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h3" component="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
        
        <Typography variant="h6" color="text.secondary" paragraph>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          The page you requested could not be found. It might have been removed, 
          renamed, or is temporarily unavailable.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          component={RouterLink} 
          to="/"
          startIcon={<HomeIcon />}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound; 