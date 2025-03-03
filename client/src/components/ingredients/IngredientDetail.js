import React, { useState, useEffect, useContext } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  AlertTitle,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from '../../context/auth/authContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';

const IngredientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const ingredientContext = useContext(IngredientContext);
  const alertContext = useContext(AlertContext);

  const { loadUser } = authContext;
  const { getIngredient, current, deleteIngredient, loading, error, clearCurrent } = ingredientContext;
  const { setAlert } = alertContext;

  // Delete confirmation dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Load user data and ingredient data when component mounts
  useEffect(() => {
    loadUser();
    getIngredient(id);

    // Set a timeout to show a message if loading takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoadingTimeout(true);
      }
    }, 5000);

    // Cleanup function to clear current ingredient when component unmounts
    return () => {
      clearTimeout(timeoutId);
      clearCurrent();
    };
    // eslint-disable-next-line
  }, [id]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteIngredient = () => {
    deleteIngredient(id);
    setOpenDialog(false);
    setAlert('Ingredient deleted successfully', 'success');
    navigate('/ingredients');
  };

  const handleRetry = () => {
    getIngredient(id);
    setLoadingTimeout(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5">Loading ingredient details...</Typography>
          <CircularProgress />
          
          {loadingTimeout && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <AlertTitle>Loading is taking longer than expected</AlertTitle>
              This could be due to server issues or network connectivity problems.
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleRetry}>
                  Retry
                </Button>
                <Button 
                  variant="text" 
                  onClick={() => navigate('/ingredients')}
                  sx={{ ml: 1 }}
                >
                  Back to Ingredients
                </Button>
              </Box>
            </Alert>
          )}
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error Loading Ingredient</AlertTitle>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/ingredients')}
        >
          Back to Ingredients
        </Button>
      </Container>
    );
  }

  if (!current) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Ingredient Not Found</AlertTitle>
          The ingredient you're looking for could not be found.
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/ingredients')}
        >
          Back to Ingredients
        </Button>
      </Container>
    );
  }

  // Get allergens that are true
  const activeAllergens = Object.entries(current.allergens || {})
    .filter(([_, value]) => value)
    .map(([key, _]) => key.charAt(0).toUpperCase() + key.slice(1));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Development Mode</AlertTitle>
        Authentication is bypassed. All features should work without requiring login.
        If you encounter any issues, check the browser console for details.
      </Alert>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {current.name}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/ingredients')}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/ingredients/edit/${id}`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleOpenDialog}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1">{current.category}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={current.isActive ? 'Active' : 'Inactive'}
                  color={current.isActive ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Cost
                </Typography>
                <Typography variant="body1">${current.cost?.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Unit
                </Typography>
                <Typography variant="body1">{`${current.unitSize} ${current.unitType}`}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Pack Size
                </Typography>
                <Typography variant="body1">{current.packSize}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Class
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {current.class}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tax Value
                </Typography>
                <Typography variant="body1">{current.taxValue}%</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Supplier Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Supplier Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {current.supplier ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Supplier Name
                  </Typography>
                  <Typography variant="body1">
                    <Link to={`/suppliers/${current.supplier._id}`} style={{ textDecoration: 'none' }}>
                      {current.supplier.name}
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Person
                  </Typography>
                  <Typography variant="body1">{current.supplier.contact}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{current.supplier.phone}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    <a href={`mailto:${current.supplier.email}`} style={{ textDecoration: 'none' }}>
                      {current.supplier.email}
                    </a>
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No supplier information available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Allergens */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Allergens
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {activeAllergens.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {activeAllergens.map((allergen) => (
                  <Chip key={allergen} label={allergen} color="warning" size="small" />
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No allergens
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Nutritional Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nutritional Information (per 100g/ml)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Calories
                </Typography>
                <Typography variant="body1">
                  {current.nutritionalInfo?.calories ? `${current.nutritionalInfo.calories} kcal` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Protein
                </Typography>
                <Typography variant="body1">
                  {current.nutritionalInfo?.protein ? `${current.nutritionalInfo.protein}g` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Carbs
                </Typography>
                <Typography variant="body1">
                  {current.nutritionalInfo?.carbs ? `${current.nutritionalInfo.carbs}g` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Fat
                </Typography>
                <Typography variant="body1">
                  {current.nutritionalInfo?.fat ? `${current.nutritionalInfo.fat}g` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Fiber
                </Typography>
                <Typography variant="body1">
                  {current.nutritionalInfo?.fiber ? `${current.nutritionalInfo.fiber}g` : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Used in Recipes */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Used in Recipes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {current.usedInRecipes && current.usedInRecipes.length > 0 ? (
              <TableContainer>
                <Table sx={{ minWidth: 650 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Recipe Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {current.usedInRecipes.map((recipe) => (
                      <TableRow key={recipe._id}>
                        <TableCell component="th" scope="row">
                          {recipe.name}
                        </TableCell>
                        <TableCell>{recipe.category}</TableCell>
                        <TableCell>{`${recipe.quantity} ${recipe.unit}`}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            component={Link}
                            to={`/recipes/${recipe._id}`}
                          >
                            View Recipe
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" color="text.secondary">
                This ingredient is not used in any recipes yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Ingredient?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this ingredient? This action cannot be undone.
            {current.usedInRecipes && current.usedInRecipes.length > 0 && (
              <Box sx={{ mt: 2, color: 'error.main' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Warning: This ingredient is used in {current.usedInRecipes.length} recipe(s).
                </Typography>
                <Typography variant="body2">
                  Deleting it may affect those recipes.
                </Typography>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteIngredient} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default IngredientDetail; 