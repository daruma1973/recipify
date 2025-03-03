import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalculateIcon from '@mui/icons-material/Calculate';

const Home = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          mb: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <RestaurantMenuIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Recipify
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          The ultimate platform for chefs to manage recipes, ingredients, and costs
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => navigate('/register')}
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <InventoryIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Ingredient Management
            </Typography>
            <Typography>
              Create and manage ingredients with detailed information including costs,
              nutritional data, and allergen information.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Recipe Management
            </Typography>
            <Typography>
              Create, edit, and organize recipes with detailed costing. Import recipes from the web
              and automatically match ingredients.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <CalculateIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Costing & Profitability
            </Typography>
            <Typography>
              Calculate costs, suggested selling prices, and profit margins for all your recipes.
              Make informed business decisions.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Why Choose Recipify?
        </Typography>
        <Typography variant="body1" paragraph>
          Recipify is designed by chefs, for chefs. Our platform streamlines the recipe and
          ingredient management process, allowing you to focus on what you do best - creating
          amazing food.
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={() => navigate('/register')}
        >
          Start Your Free Trial
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 