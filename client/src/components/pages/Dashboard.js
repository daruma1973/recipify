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
  Divider,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@mui/material';
import Container from '../layout/Container';
import BentoCard from '../common/BentoCard';

// Icons
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalBarIcon from '@mui/icons-material/LocalBar';
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import LiquorIcon from '@mui/icons-material/Liquor';
import WineBarIcon from '@mui/icons-material/WineBar';

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

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
  '& .MuiAlert-icon': {
    alignItems: 'center',
  }
}));

const RecipeCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  overflow: 'hidden',
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: theme.shadows[1],
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[3],
  }
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
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
  
  // Recent recipes
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
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Decorative elements */}
        <DecorativeCircle color="primary.main" size={180} opacity={0.05} top={-50} right={-50} />
        <DecorativeCircle color="secondary.main" size={120} opacity={0.05} bottom={100} left={-60} />
        <DecorativeShape color="info.main" opacity={0.05} top={120} right={60} shape="square" />
        
        <Box mb={4} mt={2} className="animate-fade-in">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            {getTimeBasedGreeting()}, <GradientText>{user?.name?.split(' ')[0] || 'Bartender'}</GradientText>
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's what's happening with your cocktails and bar inventory today.
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Key Stats Row - Colorful cards with big numbers */}
          <Grid item xs={6} sm={4} md={3} lg={2} className="animate-slide-up" sx={{ animationDelay: '0.1s' }}>
            <BentoCard
              colorVariant="purple"
              accent="primary"
              clickable
              avatar={<LocalBarIcon />}
              avatarBg="primary.main"
              statsNumber={stats.recipes}
              statsCaption="Cocktails"
              statsColorVariant="primary"
              onClick={() => window.location.href = '/recipes'}
            />
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2} className="animate-slide-up" sx={{ animationDelay: '0.2s' }}>
            <BentoCard
              colorVariant="blue"
              accent="info"
              clickable
              avatar={<LiquorIcon />}
              avatarBg="info.main"
              statsNumber={stats.ingredients}
              statsCaption="Bar Stock"
              statsColorVariant="info"
              onClick={() => window.location.href = '/inventory'}
            />
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2} className="animate-slide-up" sx={{ animationDelay: '0.3s' }}>
            <BentoCard
              colorVariant="orange"
              accent="secondary"
              clickable
              avatar={<LocalShippingIcon />}
              avatarBg="secondary.main"
              statsNumber={stats.suppliers}
              statsCaption="Distributors"
              statsColorVariant="secondary"
              onClick={() => window.location.href = '/suppliers'}
            />
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2} className="animate-slide-up" sx={{ animationDelay: '0.4s' }}>
            <BentoCard
              colorVariant="green"
              accent="success"
              clickable
              avatar={<CategoryIcon />}
              avatarBg="success.main"
              statsNumber={stats.categories}
              statsCaption="Categories"
              statsColorVariant="success"
              onClick={() => window.location.href = '/recipes?view=categories'}
            />
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2} className="animate-slide-up" sx={{ animationDelay: '0.5s' }}>
            <BentoCard
              colorVariant="yellow"
              accent="warning"
              clickable
              avatar={<WarningIcon />}
              avatarBg="warning.main"
              statsNumber={stats.lowStock}
              statsCaption="Low Stock"
              statsColorVariant="warning"
              onClick={() => window.location.href = '/inventory?filter=lowStock'}
            />
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2} className="animate-slide-up" sx={{ animationDelay: '0.6s' }}>
            <BentoCard
              colorVariant="default"
              accent="none"
              clickable
              avatar={<AddIcon />}
              avatarBg="primary.main"
              title="Quick Add"
              subtitle="Create new item"
              onClick={() => {}}
              footer={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button 
                    component={Link} 
                    to="/recipes/add" 
                    size="small" 
                    startIcon={<LocalBarIcon />}
                    fullWidth
                    variant="outlined"
                  >
                    Cocktail
                  </Button>
                  <Button 
                    component={Link} 
                    to="/inventory/add" 
                    size="small" 
                    startIcon={<LiquorIcon />}
                    fullWidth
                    variant="outlined"
                  >
                    Spirit/Mixer
                  </Button>
                </Box>
              }
            />
          </Grid>
          
          {/* Low Stock Alerts */}
          <Grid item xs={12} md={6} lg={4} className="animate-slide-up" sx={{ animationDelay: '0.7s' }}>
            <BentoCard
              title="Low Stock Alerts"
              subtitle="Items that need attention"
              avatar={<WarningIcon />}
              avatarBg="warning.main"
              accent="warning"
              action={
                <Button 
                  component={Link} 
                  to="/inventory?filter=lowStock" 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                >
                  View All
                </Button>
              }
            >
              {alerts.length > 0 ? (
                <List disablePadding>
                  {alerts.map((alert, index) => (
                    <React.Fragment key={alert._id || index}>
                      <ListItem 
                        component={Link} 
                        to={`/inventory/${alert._id}`}
                        sx={{ 
                          px: 0, 
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'warning.light',
                              color: 'warning.dark'
                            }}
                          >
                            <LiquorIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle2" fontWeight={600}>
                              {alert.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {alert.currentStock} {alert.unit} remaining (min: {alert.minStock} {alert.unit})
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Chip 
                            label="Low" 
                            size="small" 
                            color="warning"
                            sx={{ fontWeight: 600 }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < alerts.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No low stock alerts at the moment
                  </Typography>
                </Box>
              )}
            </BentoCard>
          </Grid>
          
          {/* Recent Cocktails */}
          <Grid item xs={12} md={6} lg={4} className="animate-slide-up" sx={{ animationDelay: '0.8s' }}>
            <BentoCard
              title="Recent Cocktails"
              subtitle="Your latest creations"
              avatar={<LocalBarIcon />}
              avatarBg="primary.main"
              accent="primary"
              action={
                <Button 
                  component={Link} 
                  to="/recipes" 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                >
                  View All
                </Button>
              }
            >
              {recentRecipes.length > 0 ? (
                <List disablePadding>
                  {recentRecipes.map((recipe, index) => (
                    <React.Fragment key={recipe._id || index}>
                      <ListItem 
                        component={Link} 
                        to={`/recipes/${recipe._id}`}
                        sx={{ 
                          px: 0, 
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.light',
                              color: 'primary.dark'
                            }}
                          >
                            <LocalBarIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle2" fontWeight={600}>
                              {recipe.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {recipe.primaryCategory || 'Uncategorized'} • {recipe.yield?.quantity || ''} {recipe.yield?.unit || ''}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            component={Link} 
                            to={`/recipes/${recipe._id}`}
                            size="small"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < recentRecipes.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No cocktails created yet
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/recipes/add" 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                  >
                    Create Cocktail
                  </Button>
                </Box>
              )}
            </BentoCard>
          </Grid>
          
          {/* Quick Actions */}
          <Grid item xs={12} lg={4} className="animate-slide-up" sx={{ animationDelay: '0.9s' }}>
            <BentoCard
              title="Quick Actions"
              subtitle="Common tasks and shortcuts"
              avatar={<RocketLaunchIcon />}
              avatarBg="secondary.main"
              accent="secondary"
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    component={Link}
                    to="/inventory/take"
                    variant="outlined"
                    fullWidth
                    startIcon={<LiquorIcon />}
                    sx={{ mb: 2, height: '100%' }}
                  >
                    Take Bar Inventory
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    component={Link}
                    to="/recipes/import"
                    variant="outlined"
                    fullWidth
                    startIcon={<LocalBarIcon />}
                    sx={{ mb: 2, height: '100%' }}
                  >
                    Import Cocktail
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    component={Link}
                    to="/suppliers/add"
                    variant="outlined"
                    fullWidth
                    startIcon={<LocalShippingIcon />}
                    sx={{ mb: 2, height: '100%' }}
                  >
                    Add Distributor
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    component={Link}
                    to="/inventory/locations"
                    variant="outlined"
                    fullWidth
                    startIcon={<CategoryIcon />}
                    sx={{ mb: 2, height: '100%' }}
                  >
                    Manage Bar Sections
                  </Button>
                </Grid>
              </Grid>
            </BentoCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 