import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth/authContext';
import RecipeContext from '../../context/recipe/recipeContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import SupplierContext from '../../context/supplier/supplierContext';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Typography,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
  Button,
  IconButton,
  LinearProgress,
  Divider
} from '@mui/material';
import Container from '../layout/Container';
import BentoCard from '../common/BentoCard';

// Icons
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InventoryIcon from '@mui/icons-material/Inventory';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import WarningIcon from '@mui/icons-material/Warning';

// Styled components for decorative elements
const DecorativeCircle = styled(Box)(({ theme, color = 'primary.main', size = 100, opacity = 0.1, top, left, right, bottom }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  backgroundColor: theme.palette[color.split('.')[0]][color.split('.')[1]] || color,
  opacity: opacity,
  top: top,
  left: left,
  right: right,
  bottom: bottom,
  zIndex: 0,
}));

const DecorativeShape = styled(Box)(({ theme, color = 'primary.main', opacity = 0.1, top, left, right, bottom, shape = 'square' }) => ({
  position: 'absolute',
  width: shape === 'square' ? 80 : 100,
  height: shape === 'square' ? 80 : 50,
  borderRadius: shape === 'square' ? 16 : shape === 'pill' ? 25 : '50%',
  backgroundColor: theme.palette[color.split('.')[0]][color.split('.')[1]] || color,
  opacity: opacity,
  top: top,
  left: left,
  right: right,
  bottom: bottom,
  zIndex: 0,
  transform: shape === 'square' ? 'rotate(20deg)' : 'none',
}));

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const recipeContext = useContext(RecipeContext);
  const ingredientContext = useContext(IngredientContext);
  const supplierContext = useContext(SupplierContext);
  const { user } = authContext;
  const { recipes, getRecipes } = recipeContext;
  const { ingredients, getIngredients } = ingredientContext;
  const { suppliers, getSuppliers } = supplierContext;
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Stats
  const [stats, setStats] = useState({
    recipes: 0,
    activeRecipes: 0,
    ingredients: 0,
    lowStock: 0,
    suppliers: 0,
    categories: 0,
  });
  
  // Low stock alerts
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    getRecipes();
    getIngredients();
    getSuppliers();
    // We don't need getInventoryAlerts, we'll filter ingredients ourselves
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    // Calculate stats
    if (recipes) {
      const activeRecipes = recipes.filter(recipe => recipe.status === 'active').length;
      
      // Extract unique categories
      const categories = new Set();
      recipes.forEach(recipe => {
        if (recipe.primaryCategory) categories.add(recipe.primaryCategory);
      });
      
      setStats(prevStats => ({
        ...prevStats,
        recipes: recipes.length,
        activeRecipes,
        categories: categories.size
      }));
    }
    
    if (ingredients) {
      // Count low stock items
      const lowStock = ingredients.filter(ingredient => 
        ingredient.currentStock && 
        ingredient.minStock && 
        ingredient.currentStock <= ingredient.minStock
      ).length;
      
      setStats(prevStats => ({
        ...prevStats,
        ingredients: ingredients.length,
        lowStock
      }));
      
      // Set low stock alerts
      const alertItems = ingredients
        .filter(ingredient => 
          ingredient.currentStock && 
          ingredient.minStock && 
          ingredient.currentStock <= ingredient.minStock
        )
        .slice(0, 4);
      
      setAlerts(alertItems);
    }
    
    if (suppliers) {
      setStats(prevStats => ({
        ...prevStats,
        suppliers: suppliers.length
      }));
    }
  }, [recipes, ingredients, suppliers]);
  
  // Mock data for recent activity
  const recentRecipes = recipes?.slice(0, 3) || [];
  
  // Welcome message based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  return (
    <Container>
      <Box mb={4} mt={2}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          {getTimeBasedGreeting()}, {user?.name?.split(' ')[0] || 'Chef'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's what's happening with your recipes and ingredients today.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Key Stats Row - Colorful cards with big numbers */}
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <BentoCard
            colorVariant="purple"
            accent="primary"
            clickable
            avatar={<MenuBookIcon />}
            avatarBg="primary.main"
            statsNumber={stats.recipes}
            statsCaption="Recipes"
            onClick={() => window.location.href = '/recipes'}
          />
        </Grid>
        
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <BentoCard
            colorVariant="blue"
            accent="info"
            clickable
            avatar={<InventoryIcon />}
            avatarBg="info.main"
            statsNumber={stats.ingredients}
            statsCaption="Ingredients"
            onClick={() => window.location.href = '/inventory'}
          />
        </Grid>
        
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <BentoCard
            colorVariant="orange"
            accent="secondary"
            clickable
            avatar={<LocalShippingIcon />}
            avatarBg="secondary.main"
            statsNumber={stats.suppliers}
            statsCaption="Suppliers"
            onClick={() => window.location.href = '/suppliers'}
          />
        </Grid>
        
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <BentoCard
            colorVariant="green"
            accent="success"
            clickable
            avatar={<CategoryIcon />}
            avatarBg="success.main"
            statsNumber={stats.categories}
            statsCaption="Categories"
            onClick={() => window.location.href = '/recipes?view=categories'}
          />
        </Grid>
        
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <BentoCard
            colorVariant="yellow"
            accent="warning"
            clickable
            avatar={<WarningIcon />}
            avatarBg="warning.main"
            statsNumber={stats.lowStock}
            statsCaption="Low Stock"
            onClick={() => window.location.href = '/inventory?filter=lowStock'}
          />
        </Grid>
        
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <BentoCard
            colorVariant="purple"
            accent="primary"
            clickable
            avatar={<RocketLaunchIcon />}
            avatarBg="primary.main"
            statsNumber={stats.activeRecipes}
            statsCaption="Active Recipes"
            onClick={() => window.location.href = '/recipes?status=active'}
          />
        </Grid>
        
        {/* Welcome Card - Larger banner with greeting and quick actions */}
        <Grid item xs={12} md={8}>
          <BentoCard
            title="Welcome to Recipify"
            subtitle="Your recipes and inventory at a glance"
            colorVariant="blue"
            sx={{ position: 'relative', overflow: 'hidden' }}
          >
            <DecorativeCircle color="info.light" size={150} opacity={0.2} top="-40px" right="-40px" />
            <DecorativeShape color="primary.light" opacity={0.15} bottom="10px" right="30px" shape="square" />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<AddIcon />}
                    component={Link}
                    to="/recipes/add"
                    sx={{ py: 1.5 }}
                  >
                    New Recipe
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<AddIcon />}
                    component={Link}
                    to="/inventory/add"
                    sx={{ py: 1.5 }}
                  >
                    Add Ingredient
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<AttachMoneyIcon />}
                    component={Link}
                    to="/costing/calculator"
                    sx={{ py: 1.5 }}
                  >
                    Cost Calculator
                  </Button>
                </Grid>
              </Grid>
              
              <Box mt={4} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body1">
                  Explore your dashboard to see your recipe performance and inventory status.
                </Typography>
                
                <Button 
                  variant="text" 
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  component={Link}
                  to="/profile"
                >
                  View Profile
                </Button>
              </Box>
            </Box>
          </BentoCard>
        </Grid>
        
        {/* Low Stock Alerts Card */}
        <Grid item xs={12} md={4}>
          <BentoCard
            title="Low Stock Alerts"
            subtitle="Items that need your attention"
            avatar={<NotificationsIcon />}
            avatarBg="warning.main"
            colorVariant="yellow"
            sx={{ height: '100%' }}
          >
            {alerts.length > 0 ? (
              <Box>
                {alerts.map((item, index) => (
                  <Box key={item._id || index} mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.name}
                      </Typography>
                      <Chip 
                        label={item.currentStock < (item.minStock / 2) ? "Critical" : "Low"} 
                        color={item.currentStock < (item.minStock / 2) ? "error" : "warning"}
                        size="small"
                      />
                    </Box>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Box width="100%" mr={1}>
                        <LinearProgress 
                          variant="determinate" 
                          value={(item.currentStock / item.minStock) * 50} 
                          color={item.currentStock < (item.minStock / 2) ? "error" : "warning"}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="body2" fontWeight={500}>
                        {item.currentStock} / {item.minStock}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                
                <Button
                  variant="outlined"
                  color="warning"
                  fullWidth
                  component={Link}
                  to="/inventory?filter=lowStock"
                  sx={{ mt: 1 }}
                >
                  View All Alerts
                </Button>
              </Box>
            ) : (
              <Alert severity="success" sx={{ mt: 2 }}>
                Good job! All items are well stocked.
              </Alert>
            )}
          </BentoCard>
        </Grid>
        
        {/* Recent Recipes */}
        <Grid item xs={12} md={6}>
          <BentoCard
            title="Recent Recipes"
            subtitle="Your latest culinary creations"
            avatar={<StarIcon />}
            avatarBg="primary.main"
            colorVariant="purple"
            divider
          >
            {recentRecipes.length > 0 ? (
              <Box>
                {recentRecipes.map((recipe, index) => (
                  <Box key={recipe._id || index} mb={index < recentRecipes.length - 1 ? 2 : 0}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          src={recipe.image}
                          alt={recipe.name}
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            mr: 2,
                            bgcolor: recipe.image ? 'transparent' : 'primary.light',
                          }}
                        >
                          {!recipe.image && <RestaurantIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {recipe.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {recipe.primaryCategory || 'Uncategorized'} • {recipe.status ? recipe.status.charAt(0).toUpperCase() + recipe.status.slice(1) : 'Draft'}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton 
                        size="small" 
                        component={Link} 
                        to={`/recipes/${recipe._id}`}
                        color="primary"
                        sx={{ 
                          bgcolor: 'primary.light', 
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'primary.main', color: 'white' }
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </Box>
                    {index < recentRecipes.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
                
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  component={Link}
                  to="/recipes"
                  sx={{ mt: 2 }}
                >
                  View All Recipes
                </Button>
              </Box>
            ) : (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  You haven't created any recipes yet.
                </Alert>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  component={Link}
                  to="/recipes/add"
                  fullWidth
                >
                  Create Your First Recipe
                </Button>
              </Box>
            )}
          </BentoCard>
        </Grid>
        
        {/* Financial Metrics Card */}
        <Grid item xs={12} md={6}>
          <BentoCard
            title="Financial Insights"
            subtitle="Cost analysis and profitability overview"
            avatar={<BarChartIcon />}
            avatarBg="success.main"
            colorVariant="green"
            divider
          >
            <DecorativeShape color="success.light" opacity={0.2} bottom="20px" right="20px" shape="pill" />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Cost of Sales
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="success.dark">
                    32%
                  </Typography>
                  <Typography variant="body2" color="success.dark" fontWeight={500} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    2% better than target
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Gross Profit
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="success.dark">
                    68%
                  </Typography>
                  <Typography variant="body2" color="success.dark" fontWeight={500}>
                    Top recipe: 78%
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Top Performing Recipes
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <BentoCard
                        colorVariant="default"
                        avatar={<EmojiEventsIcon />}
                        avatarBg="warning.main"
                        title="Highest Margin"
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {recipes?.[0]?.name || 'New York Cheesecake'}
                        </Typography>
                        <Typography variant="h5" fontWeight={800} color="warning.dark">
                          78%
                        </Typography>
                      </BentoCard>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <BentoCard
                        colorVariant="default"
                        avatar={<TimelineIcon />}
                        avatarBg="info.main"
                        title="Most Consistent"
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {recipes?.[1]?.name || 'Classic Lasagna'}
                        </Typography>
                        <Typography variant="h5" fontWeight={800} color="info.dark">
                          65%
                        </Typography>
                      </BentoCard>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              
              <Button
                variant="outlined"
                color="success"
                fullWidth
                component={Link}
                to="/costing/reports"
                sx={{ mt: 3 }}
              >
                View Financial Reports
              </Button>
            </Box>
          </BentoCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 