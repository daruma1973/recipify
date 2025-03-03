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
  Autocomplete
} from '@mui/material';
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
import AuthContext from '../../context/auth/authContext';
import RecipeContext from '../../context/recipe/recipeContext';
import AlertContext from '../../context/alert/alertContext';
import IngredientContext from '../../context/ingredient/ingredientContext';

const RecipeDetail = () => {
  const authContext = useContext(AuthContext);
  const recipeContext = useContext(RecipeContext);
  const alertContext = useContext(AlertContext);
  const ingredientContext = useContext(IngredientContext);

  const { 
    getRecipe, 
    current, 
    clearCurrentRecipe, 
    deleteRecipe, 
    loading,
    updateRecipe,
    error 
  } = recipeContext;
  const { setAlert } = alertContext;
  const { ingredients, getIngredients } = ingredientContext;

  const navigate = useNavigate();
  const { id } = useParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Add state for ingredient editing
  const [ingredientEditDialogOpen, setIngredientEditDialogOpen] = useState(false);
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [replacementIngredient, setReplacementIngredient] = useState(null);
  const [editedIngredients, setEditedIngredients] = useState([]);
  
  // Load user data and recipe data
  useEffect(() => {
    // Remove loadUser since we've disabled authentication
    // loadUser();
    getRecipe(id);

    // Load ingredients for editing
    getIngredients();

    return () => {
      clearCurrentRecipe();
    };
    // eslint-disable-next-line
  }, [id]);

  // Initialize edited ingredients when current recipe changes
  useEffect(() => {
    if (current && current.ingredients) {
      setEditedIngredients(current.ingredients);
    }
  }, [current]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteRecipe(id);
    setAlert('Recipe deleted successfully', 'success');
    setOpenDeleteDialog(false);
    navigate('/recipes');
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Open ingredient edit dialog
  const handleEditIngredient = (index) => {
    setEditingIngredientIndex(index);
    setReplacementIngredient(null);
    setIngredientEditDialogOpen(true);
  };

  // Close ingredient edit dialog
  const handleCloseIngredientEdit = () => {
    setIngredientEditDialogOpen(false);
    setEditingIngredientIndex(null);
    setReplacementIngredient(null);
  };

  // Replace ingredient with selected one
  const handleReplaceIngredient = () => {
    if (editingIngredientIndex === null || !replacementIngredient) {
      setAlert('Please select a replacement ingredient', 'error');
      return;
    }
    
    const updatedIngredients = [...editedIngredients];
    const originalIngredient = updatedIngredients[editingIngredientIndex];
    
    // Create updated ingredient with new ID and name but keep quantity and unit
    updatedIngredients[editingIngredientIndex] = {
      ...originalIngredient,
      _id: replacementIngredient._id,
      name: replacementIngredient.name,
      // If the unit type is different, suggest the new ingredient's unit type
      unit: replacementIngredient.unitType || originalIngredient.unit
    };
    
    setEditedIngredients(updatedIngredients);
    setAlert(`Replaced ${originalIngredient.name} with ${replacementIngredient.name}`, 'success');
    handleCloseIngredientEdit();
  };

  // Save all ingredient changes
  const handleSaveIngredientChanges = () => {
    if (!current) return;
    
    const updatedRecipe = {
      ...current,
      ingredients: editedIngredients
    };
    
    updateRecipe(updatedRecipe);
    setAlert('Recipe ingredients updated successfully', 'success');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Recipe
          </Typography>
          <Typography variant="body1" paragraph>
            {error}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/recipes')}
          >
            Back to Recipes
          </Button>
        </Box>
      </Container>
    );
  }

  if (!current) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recipe Not Found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/recipes')}
          >
            Back to Recipes
          </Button>
        </Box>
      </Container>
    );
  }

  const { 
    name, 
    category, 
    description, 
    servings, 
    prepTime, 
    cookTime, 
    image, 
    videoUrl,
    instructions = [],
    isActive,
    recipeYield
  } = current;

  // Use current.ingredients with a default empty array
  const recipeIngredients = current.ingredients || [];

  // Calculate total time
  const totalTime = (parseInt(prepTime) || 0) + (parseInt(cookTime) || 0);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeVideoId = getYouTubeVideoId(videoUrl);

  // Default recipe image
  const defaultImage = 'https://via.placeholder.com/800x400?text=No+Image';

  // Check if image is a base64 string
  const isBase64Image = image && image.startsWith('data:image');
  
  // Log image information for debugging
  console.log('Recipe image:', image ? 'Present' : 'Not present');
  if (image) {
    console.log('Image preview:', image.substring(0, 30) + '...');
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {name}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/recipes')}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button
            component={Link}
            to={`/recipes/edit/${id}`}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Bento Grid Layout */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          gridAutoRows: 'auto',
          gap: 3
        }}
      >
        {/* Hero Image - Spans full width on mobile, half on desktop */}
        <Box 
          sx={{ 
            gridColumn: { xs: '1', md: '1 / 3', lg: '1 / 3' },
            gridRow: { xs: '1', md: '1 / 3' },
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            position: 'relative',
            backgroundColor: '#f5f5f5'
          }}
        >
          <Box sx={{ position: 'relative', height: { xs: 250, md: '100%' }, minHeight: 300 }}>
            <CardMedia
              component="img"
              image={image || defaultImage}
              alt={name}
              sx={{ 
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                position: 'absolute'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                color: 'white',
                p: 3,
                pt: 6
              }}
            >
              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                {category && (
                  <Chip 
                    label={category} 
                    color="primary" 
                    size="small" 
                    sx={{ fontWeight: 'medium' }}
                  />
                )}
                {!isActive && (
                  <Chip 
                    label="Inactive" 
                    color="default" 
                    size="small"
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Recipe Info Card */}
        <Box 
          sx={{ 
            gridColumn: { xs: '1', md: '3 / 4', lg: '3 / 5' },
            gridRow: { xs: '2', md: '1' },
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recipe Details
            </Typography>
            <List dense sx={{ '& .MuiListItem-root': { px: 0 } }}>
              {servings && (
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PeopleIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="medium">Servings: {servings}</Typography>}
                  />
                </ListItem>
              )}
              {recipeYield && (
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <RestaurantIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="medium">Yield: {recipeYield.value} {recipeYield.unit || 'serving(s)'}</Typography>}
                  />
                </ListItem>
              )}
              {prepTime && (
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccessTimeIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="medium">Prep Time: {prepTime} mins</Typography>}
                  />
                </ListItem>
              )}
              {cookTime && (
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccessTimeIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="medium">Cook Time: {cookTime} mins</Typography>}
                  />
                </ListItem>
              )}
              {totalTime > 0 && (
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccessTimeIcon fontSize="small" color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="medium">Total Time: {totalTime} mins</Typography>}
                  />
                </ListItem>
              )}
            </List>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                startIcon={<PrintIcon />} 
                onClick={handlePrint}
                size="small"
                sx={{ mr: 1 }}
              >
                Print
              </Button>
              <Button startIcon={<ShareIcon />} size="small">
                Share
              </Button>
            </Box>
          </Box>

          {/* Description section */}
          {description && (
            <Box sx={{ p: 3, pt: 0 }}>
              <Divider />
              <Typography variant="body2" sx={{ pt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                {description}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Financial Information Card */}
        {(current?.actualSellingPrice > 0 || current?.costOfSalesPercentage > 0) && (
          <Box 
            sx={{ 
              gridColumn: { xs: '1', md: '3 / 4', lg: '3 / 4' },
              gridRow: { xs: '3', md: '2' },
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Financial Information
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {current?.actualSellingPrice > 0 && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', pl: 0 }}>Selling Price:</TableCell>
                        <TableCell align="right" sx={{ borderBottom: 'none', pr: 0 }}>${Number(current.actualSellingPrice).toFixed(2)}</TableCell>
                      </TableRow>
                    )}
                    {current?.costPrice > 0 && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', pl: 0 }}>Cost Price:</TableCell>
                        <TableCell align="right" sx={{ borderBottom: 'none', pr: 0 }}>${Number(current.costPrice).toFixed(2)}</TableCell>
                      </TableRow>
                    )}
                    {current?.grossProfit > 0 && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', pl: 0 }}>Gross Profit:</TableCell>
                        <TableCell align="right" sx={{ borderBottom: 'none', pr: 0 }}>${Number(current.grossProfit).toFixed(2)}</TableCell>
                      </TableRow>
                    )}
                    {current?.grossProfitPercentage > 0 && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', pl: 0 }}>GP%:</TableCell>
                        <TableCell align="right" sx={{ borderBottom: 'none', pr: 0 }}>{Number(current.grossProfitPercentage).toFixed(2)}%</TableCell>
                      </TableRow>
                    )}
                    {current?.costOfSalesPercentage > 0 && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', pl: 0 }}>Cost of Sales%:</TableCell>
                        <TableCell align="right" sx={{ borderBottom: 'none', pr: 0 }}>{Number(current.costOfSalesPercentage).toFixed(2)}%</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
        
        {/* Classification/Categories Card */}
        <Box 
          sx={{ 
            gridColumn: { xs: '1', md: '3 / 4', lg: '4 / 5' },
            gridRow: { xs: '4', md: '2' },
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Classification
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {current?.itemClass && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', pl: 0 }}>Item Class:</TableCell>
                      <TableCell sx={{ borderBottom: 'none', pr: 0 }}>{current.itemClass.charAt(0).toUpperCase() + current.itemClass.slice(1)}</TableCell>
                    </TableRow>
                  )}
                  {current?.revenueOutlet && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', pl: 0 }}>Revenue Outlet:</TableCell>
                      <TableCell sx={{ borderBottom: 'none', pr: 0 }}>{current.revenueOutlet}</TableCell>
                    </TableRow>
                  )}
                  {current?.vatPercentage > 0 && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', pl: 0 }}>VAT/Tax%:</TableCell>
                      <TableCell sx={{ borderBottom: 'none', pr: 0 }}>{Number(current.vatPercentage).toFixed(2)}%</TableCell>
                    </TableRow>
                  )}
                  {current?.wastagePercentage > 0 && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', pl: 0 }}>Wastage%:</TableCell>
                      <TableCell sx={{ borderBottom: 'none', pr: 0 }}>{Number(current.wastagePercentage).toFixed(2)}%</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* Recipe Ingredients Card */}
        <Box 
          sx={{ 
            gridColumn: { xs: '1', md: '1', lg: '1 / 2' },
            gridRow: { xs: '5', md: '3' },
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" component="h3">
                Ingredients
              </Typography>
              {!loading && current && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleSaveIngredientChanges}
                  disabled={JSON.stringify(current.ingredients) === JSON.stringify(editedIngredients)}
                >
                  Save
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {editedIngredients.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No ingredients listed for this recipe.
              </Typography>
            ) : (
              <List dense>
                {editedIngredients.map((ingredient, index) => (
                  <ListItem 
                    key={`${ingredient._id}-${index}`}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="edit" 
                        size="small"
                        onClick={() => handleEditIngredient(index)}
                      >
                        <SwapHorizIcon fontSize="small" />
                      </IconButton>
                    }
                    sx={{ px: 0, py: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{ingredient.quantity} {ingredient.unit}</strong> {ingredient.name}
                          {ingredient.note && ` (${ingredient.note})`}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>

        {/* Cost Information Card */}
        <Box 
          sx={{ 
            gridColumn: { xs: '1', md: '2', lg: '2 / 3' },
            gridRow: { xs: '6', md: '3' },
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Cost Breakdown
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', pl: 0 }}>Item</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', pr: 0 }}>Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipeIngredients.map((ingredient, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" sx={{ pl: 0 }}>
                        {ingredient.name}
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 0 }}>
                        ${(Math.random() * 5).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', pl: 0, borderBottom: 'none' }}>Total Cost</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', pr: 0, borderBottom: 'none' }}>
                      ${(Math.random() * 20).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {servings && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', pl: 0, borderBottom: 'none' }}>Cost per Serving</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', pr: 0, borderBottom: 'none' }}>
                        ${(Math.random() * 5).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* Video Tutorial Card (conditionally shown if video exists) */}
        {youtubeVideoId && (
          <Box 
            sx={{ 
              gridColumn: { xs: '1', md: '3 / 4', lg: '3 / 5' },
              gridRow: { xs: '7', md: '3' },
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ p: 3, pb: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <YouTubeIcon sx={{ mr: 1 }} color="error" />
                Video Tutorial
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', width: '100%' }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="Recipe Video Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </Box>
          </Box>
        )}

        {/* Recipe Instructions - Wide Card */}
        <Box 
          sx={{ 
            gridColumn: { xs: '1', md: '1 / 4', lg: '1 / 5' },
            gridRow: { xs: '8', md: '4' },
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Instructions
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            {instructions && instructions.length > 0 ? (
              <Grid container spacing={2}>
                {instructions.map((instruction, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        p: 2, 
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        height: '100%'
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          minWidth: 36,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          fontWeight: 'bold',
                          alignSelf: 'flex-start'
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body2">
                        {instruction.length > 3 ? instruction : 'Missing instruction step'}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No instructions available for this recipe.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Dietary & Allergen Information Card (if relevant) */}
        {current?.suitability && Object.values(current.suitability).some(val => val) && (
          <Box 
            sx={{ 
              gridColumn: { xs: '1', md: '1 / 3', lg: '1 / 3' },
              gridRow: { xs: '9', md: '5' },
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Dietary Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {current.suitability.vegetarian && <Chip label="Vegetarian" color="success" size="small" />}
                {current.suitability.vegan && <Chip label="Vegan" color="success" size="small" />}
                {current.suitability.glutenFree && <Chip label="Gluten Free" color="success" size="small" />}
                {current.suitability.dairyFree && <Chip label="Dairy Free" color="success" size="small" />}
                {current.suitability.nutFree && <Chip label="Nut Free" color="success" size="small" />}
                {current.suitability.kosher && <Chip label="Kosher" color="success" size="small" />}
                {current.suitability.lowCarb && <Chip label="Low Carb" color="success" size="small" />}
                {current.suitability.plantBased && <Chip label="Plant Based" color="success" size="small" />}
              </Box>
            </Box>
          </Box>
        )}

        {/* Allergen Warnings Card (if relevant) */}
        {current?.allergens && Object.values(current.allergens).some(val => val) && (
          <Box 
            sx={{ 
              gridColumn: { xs: '1', md: '3 / 4', lg: '3 / 5' },
              gridRow: { xs: '10', md: '5' },
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              bgcolor: '#FFF4E5' // Light warning color for allergens
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.dark">
                Allergen Warnings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {current.allergens.gluten && <Chip label="Gluten" color="warning" size="small" />}
                {current.allergens.crustaceans && <Chip label="Crustaceans" color="warning" size="small" />}
                {current.allergens.eggs && <Chip label="Eggs" color="warning" size="small" />}
                {current.allergens.fish && <Chip label="Fish" color="warning" size="small" />}
                {current.allergens.peanuts && <Chip label="Peanuts" color="warning" size="small" />}
                {current.allergens.nuts && <Chip label="Tree Nuts" color="warning" size="small" />}
                {current.allergens.milk && <Chip label="Milk" color="warning" size="small" />}
                {current.allergens.celery && <Chip label="Celery" color="warning" size="small" />}
                {current.allergens.mustard && <Chip label="Mustard" color="warning" size="small" />}
                {current.allergens.sesameSeeds && <Chip label="Sesame Seeds" color="warning" size="small" />}
                {current.allergens.soybeans && <Chip label="Soybeans" color="warning" size="small" />}
                {current.allergens.sulphurDioxide && <Chip label="Sulphur Dioxide" color="warning" size="small" />}
                {current.allergens.lupin && <Chip label="Lupin" color="warning" size="small" />}
                {current.allergens.molluscs && <Chip label="Molluscs" color="warning" size="small" />}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Recipe?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ingredient Edit Dialog */}
      <Dialog open={ingredientEditDialogOpen} onClose={handleCloseIngredientEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Replace Ingredient</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editingIngredientIndex !== null && editedIngredients[editingIngredientIndex] && (
              <>
                Replace <strong>{editedIngredients[editingIngredientIndex].name}</strong> with another ingredient from your database:
              </>
            )}
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              id="replacement-ingredient-select"
              options={ingredients || []}
              getOptionLabel={(option) => option.name}
              value={replacementIngredient}
              onChange={(event, value) => setReplacementIngredient(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Replacement Ingredient"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIngredientEdit} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleReplaceIngredient} 
            color="primary" 
            variant="contained"
            disabled={!replacementIngredient}
          >
            Replace
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecipeDetail; 