import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth/authContext';
import RecipeContext from '../../context/recipe/recipeContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import SupplierContext from '../../context/supplier/supplierContext';
import {
  Box,
  Grid,
  Typography,
  Alert,
  Chip,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import Card from '../common/Card';
import Button from '../common/Button';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Dashboard = () => {
  console.log('Dashboard component rendering');
  
  const authContext = useContext(AuthContext);
  const recipeContext = useContext(RecipeContext);
  const ingredientContext = useContext(IngredientContext);
  const supplierContext = useContext(SupplierContext);
  
  const { loadUser, user } = authContext;
  const { recipes, getRecipes } = recipeContext;
  const { ingredients, getIngredients } = ingredientContext;
  const { suppliers, getSuppliers } = supplierContext;
  
  // State for inventory value
  const [inventoryValue, setInventoryValue] = useState(0);
  const [error, setError] = useState(null);
  
  const theme = useTheme();

  useEffect(() => {
    console.log('Dashboard: Loading user and data');
    try {
      loadUser();
      getRecipes();
      getIngredients();
      getSuppliers();
    } catch (err) {
      console.error('Dashboard: Error loading data', err);
      setError(err.message);
    }
    
    // eslint-disable-next-line
  }, []);
  
  // Calculate inventory value whenever ingredients change
  useEffect(() => {
    if (ingredients && ingredients.length > 0) {
      console.log('Dashboard: Calculating inventory value');
      const totalValue = ingredients.reduce((total, ingredient) => {
        const quantity = ingredient.stockQuantity || 0;
        const cost = ingredient.unitCost || 0;
        return total + (quantity * cost);
      }, 0);
      setInventoryValue(totalValue);
    }
  }, [ingredients]);

  // Quick stats
  const statsCards = [
    {
      title: 'Recipes',
      count: recipes?.length || 0,
      icon: <RestaurantMenuIcon sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      link: '/recipes',
      color: theme.palette.primary.main
    },
    {
      title: 'Inventory Items',
      count: ingredients?.length || 0,
      icon: <InventoryIcon sx={{ fontSize: '2rem', color: theme.palette.secondary.main }} />,
      link: '/inventory',
      color: theme.palette.secondary.main
    },
    {
      title: 'Suppliers',
      count: suppliers?.length || 0,
      icon: <LocalShippingIcon sx={{ fontSize: '2rem', color: theme.palette.success.main }} />,
      link: '/suppliers',
      color: theme.palette.success.main
    },
    {
      title: 'Inventory Value',
      count: `$${inventoryValue.toFixed(2)}`,
      icon: <AttachMoneyIcon sx={{ fontSize: '2rem', color: theme.palette.info.main }} />,
      link: '/inventory',
      color: theme.palette.info.main
    }
  ];

  // Quick action cards
  const actionCards = [
    {
      title: 'Manage Recipes',
      description: 'Create and update recipes, or calculate costs and portions.',
      icon: <RestaurantMenuIcon sx={{ fontSize: '2.5rem' }} />,
      link: '/recipes',
      color: theme.palette.primary.light
    },
    {
      title: 'Take Inventory',
      description: 'Update stock levels and review current inventory status.',
      icon: <ReceiptLongIcon sx={{ fontSize: '2.5rem' }} />,
      link: '/inventory/take',
      color: theme.palette.secondary.light
    },
    {
      title: 'Calculate Costs',
      description: 'Determine recipe costs based on current ingredient prices.',
      icon: <CalculateIcon sx={{ fontSize: '2.5rem' }} />,
      link: '/recipes',
      color: theme.palette.error.light
    },
    {
      title: 'Manage Suppliers',
      description: 'Update supplier information and manage inventory sources.',
      icon: <LocalShippingIcon sx={{ fontSize: '2.5rem' }} />,
      link: '/suppliers',
      color: theme.palette.success.light
    },
    {
      title: 'Track Trends',
      description: 'Analyze usage patterns and identify popular items.',
      icon: <TrendingUpIcon sx={{ fontSize: '2.5rem' }} />,
      link: '/reports',
      color: theme.palette.warning.light
    },
    {
      title: 'View Reports',
      description: 'Get insights into inventory, recipes, and supplier performance.',
      icon: <AssessmentIcon sx={{ fontSize: '2.5rem' }} />,
      link: '/reports',
      color: theme.palette.info.light
    }
  ];

  // Popular recipes
  const popularRecipes = recipes?.slice(0, 3) || [];

  return (
    <Container 
      disablePaper
      maxWidth="lg"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Error: {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            mb: 1
          }}
        >
          Welcome{user ? `, ${user.name}` : ''}
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ maxWidth: 600 }}
        >
          Manage your recipes, inventory, and suppliers all in one place. Here's your kitchen at a glance.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{ height: '100%' }}
            >
              <Box 
                sx={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 1
                }}
              >
                <Typography 
                  variant="h4" 
                  component="p"
                  sx={{ 
                    fontWeight: 700,
                    color: stat.color
                  }}
                >
                  {stat.count}
                </Typography>
                {stat.icon}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography 
                  variant="h6" 
                  component="h3"
                  sx={{ 
                    fontWeight: 500,
                  }}
                >
                  {stat.title}
                </Typography>
                <Button 
                  variant="text" 
                  component={Link} 
                  to={stat.link}
                  sx={{ 
                    fontSize: '0.875rem',
                    color: stat.color
                  }}
                >
                  View
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions Section */}
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          pb: 1
        }}
      >
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {actionCards.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <Box 
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    color: action.color,
                    mr: 2
                  }}
                >
                  {action.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  component="h3"
                  sx={{ fontWeight: 600 }}
                >
                  {action.title}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {action.description}
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to={action.link}
                  fullWidth
                >
                  {action.title}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Popular Recipes */}
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          pb: 1
        }}
      >
        Popular Recipes
      </Typography>
      {popularRecipes.length > 0 ? (
        <Grid container spacing={3}>
          {popularRecipes.map((recipe, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                title={recipe.name}
                subheader={`${recipe.category || 'Uncategorized'} • ${recipe.prepTime || '--'} prep`}
                sx={{ height: '100%' }}
                footer={
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                      variant="text" 
                      component={Link} 
                      to={`/recipes/${recipe._id}`}
                    >
                      View Details
                    </Button>
                    <Chip 
                      icon={<WhatshotIcon />} 
                      label="Popular" 
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Box>
                }
              >
                <Typography variant="body2" color="text.secondary">
                  {recipe.description 
                    ? (recipe.description.length > 100 
                      ? recipe.description.substring(0, 100) + '...' 
                      : recipe.description)
                    : 'No description available'}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No recipes found. Start creating your recipe collection!
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/recipes/add"
            >
              Add Your First Recipe
            </Button>
          </Box>
        </Card>
      )}
    </Container>
  );
};

export default Dashboard; 