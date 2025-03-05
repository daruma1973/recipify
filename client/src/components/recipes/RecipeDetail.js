import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Autocomplete,
  useTheme,
  useMediaQuery,
  Avatar,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import AuthContext from '../../context/auth/authContext';
import RecipeContext from '../../context/recipe/recipeContext';
import AlertContext from '../../context/alert/alertContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import BentoCard from '../common/BentoCard';

// Styled components
const RecipeImage = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  minHeight: 48,
}));

const StepsItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  alignItems: 'flex-start',
  '&:last-child': {
    borderBottom: 'none',
  }
}));

const StepNumber = styled(Box)(({ theme }) => ({
  minWidth: 36,
  height: 36,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginRight: theme.spacing(2),
  marginTop: theme.spacing(0.5),
}));

const AllergenChip = styled(Chip)(({ theme, active }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  backgroundColor: active ? theme.palette.error.light : theme.palette.grey[100],
  color: active ? theme.palette.error.dark : theme.palette.text.secondary,
  '& .MuiChip-icon': {
    color: active ? theme.palette.error.dark : theme.palette.text.secondary,
  }
}));

const SuitabilityChip = styled(Chip)(({ theme, active }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  backgroundColor: active ? theme.palette.success.light : theme.palette.grey[100],
  color: active ? theme.palette.success.dark : theme.palette.text.secondary,
  '& .MuiChip-icon': {
    color: active ? theme.palette.success.dark : theme.palette.text.secondary,
  }
}));

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const authContext = useContext(AuthContext);
  const recipeContext = useContext(RecipeContext);
  const alertContext = useContext(AlertContext);
  const ingredientContext = useContext(IngredientContext);
  
  const { isAuthenticated } = authContext;
  const { recipe, getRecipe, loading, deleteRecipe, clearRecipes } = recipeContext;
  const { setAlert } = alertContext;
  const { getIngredients, ingredients } = ingredientContext;
  
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editIngredientDialog, setEditIngredientDialog] = useState(false);
  const [currentIngredientIndex, setCurrentIngredientIndex] = useState(null);
  const [replacementIngredient, setReplacementIngredient] = useState(null);
  const [replacementQuantity, setReplacementQuantity] = useState('');
  const [replacementUnit, setReplacementUnit] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    getRecipe(id);
    getIngredients();
    
    return () => {
      clearRecipes();
    };
    // eslint-disable-next-line
  }, [isAuthenticated, id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Keep existing handlers
  const handleDeleteClick = () => {
    setDeleteDialog(true);
  };
  
  const handleDeleteConfirm = () => {
    deleteRecipe(recipe._id);
    setDeleteDialog(false);
    setAlert('Recipe deleted', 'success');
    navigate('/recipes');
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialog(false);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleEditIngredient = (index) => {
    setCurrentIngredientIndex(index);
    setReplacementIngredient(null);
    setReplacementQuantity(recipe.ingredients[index].quantity);
    setReplacementUnit(recipe.ingredients[index].unit);
    setEditIngredientDialog(true);
  };
  
  const handleCloseIngredientEdit = () => {
    setEditIngredientDialog(false);
    setCurrentIngredientIndex(null);
    setReplacementIngredient(null);
    setReplacementQuantity('');
    setReplacementUnit('');
  };
  
  const handleReplaceIngredient = () => {
    // Keep existing implementation
  };
  
  const handleSaveIngredientChanges = () => {
    // Keep existing implementation
  };
  
  // Keep other handlers as they are
  
  if (loading || !recipe) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  const recipeImage = recipe.image || 'https://via.placeholder.com/800x500?text=No+Recipe+Image';
  
  const allergens = [
    { key: 'celery', label: 'Celery', value: recipe.allergens?.celery },
    { key: 'gluten', label: 'Gluten', value: recipe.allergens?.gluten },
    { key: 'crustaceans', label: 'Crustaceans', value: recipe.allergens?.crustaceans },
    { key: 'eggs', label: 'Eggs', value: recipe.allergens?.eggs },
    { key: 'fish', label: 'Fish', value: recipe.allergens?.fish },
    { key: 'lupin', label: 'Lupin', value: recipe.allergens?.lupin },
    { key: 'milk', label: 'Milk', value: recipe.allergens?.milk },
    { key: 'molluscs', label: 'Molluscs', value: recipe.allergens?.molluscs },
    { key: 'mustard', label: 'Mustard', value: recipe.allergens?.mustard },
    { key: 'nuts', label: 'Nuts', value: recipe.allergens?.nuts },
    { key: 'peanuts', label: 'Peanuts', value: recipe.allergens?.peanuts },
    { key: 'sesameSeeds', label: 'Sesame Seeds', value: recipe.allergens?.sesameSeeds },
    { key: 'soybeans', label: 'Soybeans', value: recipe.allergens?.soybeans },
    { key: 'sulphurDioxide', label: 'Sulphur Dioxide', value: recipe.allergens?.sulphurDioxide }
  ];
  
  const dietarySuitability = [
    { key: 'vegan', label: 'Vegan', value: recipe.suitability?.vegan },
    { key: 'vegetarian', label: 'Vegetarian', value: recipe.suitability?.vegetarian },
    { key: 'plantBased', label: 'Plant Based', value: recipe.suitability?.plantBased },
    { key: 'kosher', label: 'Kosher', value: recipe.suitability?.kosher },
    { key: 'lowCarb', label: 'Low Carb', value: recipe.suitability?.lowCarb },
    { key: 'glutenFree', label: 'Gluten Free', value: recipe.suitability?.glutenFree },
    { key: 'dairyFree', label: 'Dairy Free', value: recipe.suitability?.dairyFree },
    { key: 'nutFree', label: 'Nut Free', value: recipe.suitability?.nutFree }
  ];
  
  const getYouTubeVideoId = (url) => {
    // Keep existing implementation
  };

  // New bento grid layout
  return (
    <Box sx={{ py: 4, px: { xs: 1, sm: 3 } }}>
      {/* Header with back button, title, and action buttons */}
      <Box mb={3} display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'} justifyContent="space-between">
        <Box display="flex" alignItems="center" mb={isMobile ? 2 : 0}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/recipes')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" fontWeight="700">
            {recipe.name}
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Print
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Share
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/recipes/edit/${recipe._id}`}
          >
            Edit
          </Button>
          
          <IconButton 
            color="error" 
            onClick={handleDeleteClick}
            sx={{ ml: 0.5 }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Recipe Image and Key Details - Left Column on Desktop */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Recipe Image */}
            <Grid item xs={12}>
              <BentoCard>
                <RecipeImage sx={{ height: { xs: 250, md: 300 } }}>
                  <img src={recipeImage} alt={recipe.name} />
                </RecipeImage>
              </BentoCard>
            </Grid>
            
            {/* Quick Stats */}
            <Grid item xs={6} sm={4} lg={6}>
              <BentoCard
                accent="primary"
                avatar={<PeopleIcon />}
                avatarBg="primary.main"
                statsNumber={recipe.recipeYield?.value || '-'}
                statsCaption={`${recipe.recipeYield?.unit || 'servings'}`}
                title="Yield"
              />
            </Grid>
            
            <Grid item xs={6} sm={4} lg={6}>
              <BentoCard
                accent="secondary"
                avatar={<AccessTimeIcon />}
                avatarBg="secondary.main"
                statsNumber={recipe.prepTime ? recipe.prepTime : '-'}
                statsCaption="Prep Time"
                title="Time"
              />
            </Grid>
            
            {/* Cost Info */}
            <Grid item xs={12} sm={4} lg={12}>
              <BentoCard
                accent="success"
                avatar={<AttachMoneyIcon />}
                avatarBg="success.main"
                title="Cost Information"
              >
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Cost Per Unit
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="600">
                      ${recipe.costPrice?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      With Wastage
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="600">
                      ${recipe.costPriceWithWastage?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Selling Price
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="600">
                      ${recipe.actualSellingPrice?.toFixed(2) || recipe.suggestedSellingPrice?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Gross Profit
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="600" color={recipe.grossProfitPercentage >= 70 ? 'success.main' : recipe.grossProfitPercentage >= 50 ? 'warning.main' : 'error.main'}>
                      {recipe.grossProfitPercentage?.toFixed(0) || 0}%
                    </Typography>
                  </Grid>
                </Grid>
              </BentoCard>
            </Grid>
            
            {/* Recipe Metadata */}
            <Grid item xs={12}>
              <BentoCard title="Recipe Details">
                <List disablePadding>
                  <ListItem sx={{ py: 1.5 }} disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CategoryIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Category"
                      secondary={recipe.primaryCategory || 'Uncategorized'}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                    />
                  </ListItem>
                  
                  {recipe.subCategory && (
                    <ListItem sx={{ py: 1.5 }} disableGutters>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LocalOfferIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Subcategory"
                        secondary={recipe.subCategory}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                      />
                    </ListItem>
                  )}
                  
                  <ListItem sx={{ py: 1.5 }} disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <RestaurantIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Status"
                      secondary={recipe.status ? recipe.status.charAt(0).toUpperCase() + recipe.status.slice(1) : 'Development'}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                    />
                  </ListItem>
                  
                  {recipe.revenueOutlet && (
                    <ListItem sx={{ py: 1.5 }} disableGutters>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <MoneyOffIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Revenue Outlet"
                        secondary={recipe.revenueOutlet}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        secondaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                      />
                    </ListItem>
                  )}
                  
                  <ListItem sx={{ py: 1.5 }} disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <ScheduleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Date Created"
                      secondary={new Date(recipe.date).toLocaleDateString()}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                    />
                  </ListItem>
                </List>
              </BentoCard>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Recipe Content - Right Column */}
        <Grid item xs={12} lg={8}>
          <BentoCard>
            {/* Tabs for Recipe Content */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                allowScrollButtonsMobile
              >
                <StyledTab label="Ingredients" icon={<InventoryIcon />} iconPosition="start" />
                <StyledTab label="Method" icon={<MenuBookIcon />} iconPosition="start" />
                <StyledTab label="Allergens" icon={<WarningAmberIcon />} iconPosition="start" />
                <StyledTab label="Notes" icon={<InfoIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            {/* Ingredients Tab */}
            {tabValue === 0 && (
              <Box>
                {recipe.description && (
                  <Box mb={3}>
                    <Typography variant="body1">{recipe.description}</Typography>
                  </Box>
                )}
                
                <Box mb={3}>
                  <Typography variant="h6" fontWeight={600} mb={2}>Ingredients</Typography>
                  
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <TableContainer>
                      <Table sx={{ minWidth: 550 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Ingredient</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Unit</TableCell>
                            <TableCell align="right">Cost</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recipe.ingredients.map((ingredient, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {ingredient.name}
                              </TableCell>
                              <TableCell align="right">{ingredient.quantity}</TableCell>
                              <TableCell align="right">{ingredient.unit}</TableCell>
                              <TableCell align="right">${ingredient.cost ? ingredient.cost.toFixed(2) : '0.00'}</TableCell>
                              <TableCell align="right">
                                <IconButton size="small" onClick={() => handleEditIngredient(index)}>
                                  <SwapHorizIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info">No ingredients added to this recipe.</Alert>
                  )}
                </Box>
                
                {recipe.subRecipes && recipe.subRecipes.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Sub-Recipes</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Recipe</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Unit</TableCell>
                            <TableCell align="right">Cost</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recipe.subRecipes.map((subRecipe, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {subRecipe.name}
                              </TableCell>
                              <TableCell align="right">{subRecipe.quantity}</TableCell>
                              <TableCell align="right">{subRecipe.unit}</TableCell>
                              <TableCell align="right">${subRecipe.cost ? subRecipe.cost.toFixed(2) : '0.00'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Method Tab */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={2}>Method</Typography>
                
                {recipe.instructions && recipe.instructions.length > 0 ? (
                  <List disablePadding>
                    {recipe.instructions.map((instruction, index) => (
                      <StepsItem key={index} alignItems="flex-start" disableGutters>
                        <StepNumber>{index + 1}</StepNumber>
                        <ListItemText 
                          primary={instruction} 
                          primaryTypographyProps={{ style: { whiteSpace: 'pre-line' } }}
                        />
                      </StepsItem>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info">No instructions added to this recipe.</Alert>
                )}
                
                {recipe.videoUrl && (
                  <Box mt={4}>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      <YouTubeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Video Instructions
                    </Typography>
                    <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 2, overflow: 'hidden' }}>
                      <iframe
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(recipe.videoUrl)}`}
                        title="Recipe Video"
                        allowFullScreen
                      ></iframe>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Allergens Tab */}
            {tabValue === 2 && (
              <Box>
                <Box mb={4}>
                  <Typography variant="h6" fontWeight={600} mb={2}>Allergens</Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {allergens.map(allergen => (
                      <AllergenChip 
                        key={allergen.key}
                        label={allergen.label}
                        icon={allergen.value ? <WarningAmberIcon /> : undefined}
                        active={allergen.value}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="h6" fontWeight={600} mb={2}>Dietary Suitability</Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {dietarySuitability.map(item => (
                      <SuitabilityChip 
                        key={item.key}
                        label={item.label}
                        icon={item.value ? <CheckCircleIcon /> : undefined}
                        active={item.value}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
            
            {/* Notes Tab */}
            {tabValue === 3 && (
              <Box>
                {recipe.criticalControl && (
                  <Box mb={4}>
                    <Typography variant="h6" fontWeight={600} mb={2}>Critical Control Points</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {recipe.criticalControl}
                    </Typography>
                  </Box>
                )}
                
                {recipe.serviceNotes && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} mb={2}>Service Notes</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {recipe.serviceNotes}
                    </Typography>
                  </Box>
                )}
                
                {!recipe.criticalControl && !recipe.serviceNotes && (
                  <Alert severity="info">No additional notes for this recipe.</Alert>
                )}
              </Box>
            )}
          </BentoCard>
        </Grid>
      </Grid>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this recipe? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Ingredient Edit Dialog */}
      <Dialog
        open={editIngredientDialog}
        onClose={handleCloseIngredientEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Replace Ingredient</DialogTitle>
        <DialogContent>
          <Box my={2}>
            <Typography variant="subtitle1" gutterBottom>
              Current Ingredient: {currentIngredientIndex !== null && recipe.ingredients[currentIngredientIndex].name}
            </Typography>
            
            <Autocomplete
              options={ingredients || []}
              getOptionLabel={(option) => option.name}
              value={replacementIngredient}
              onChange={(event, newValue) => setReplacementIngredient(newValue)}
              renderInput={(params) => <TextField {...params} label="Replacement Ingredient" fullWidth margin="normal" />}
            />
            
            <Box mt={2} display="flex" gap={2}>
              <TextField
                label="Quantity"
                type="number"
                value={replacementQuantity}
                onChange={(e) => setReplacementQuantity(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Unit"
                value={replacementUnit}
                onChange={(e) => setReplacementUnit(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIngredientEdit}>Cancel</Button>
          <Button onClick={handleReplaceIngredient} color="primary">Replace</Button>
          <Button onClick={handleSaveIngredientChanges} color="primary">Update Quantity/Unit Only</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeDetail; 