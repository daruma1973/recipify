import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Pagination,
  TablePagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AuthContext from '../../context/auth/authContext';
import RecipeContext from '../../context/recipe/recipeContext';
import AlertContext from '../../context/alert/alertContext';

const Recipes = () => {
  const authContext = useContext(AuthContext);
  const recipeContext = useContext(RecipeContext);
  const alertContext = useContext(AlertContext);
  const navigate = useNavigate();

  const { loadUser } = authContext;
  const { 
    recipes, 
    filtered, 
    getRecipes, 
    filterRecipes, 
    clearFilter,
    loading,
    deleteRecipe
  } = recipeContext;
  const { setAlert } = alertContext;

  // Local state for filtering and pagination
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Predefined categories for recipes
  const categories = [
    'Appetizer',
    'Main Course',
    'Side Dish',
    'Dessert',
    'Beverage',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Bakery'
  ];

  // Load user data and recipes when component mounts
  useEffect(() => {
    // Remove loadUser since we've disabled authentication
    // loadUser();
    console.log('Recipes component: Loading recipes');
    getRecipes();
    // eslint-disable-next-line
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value !== '') {
      filterRecipes(e.target.value);
    } else if (category === '') {
      clearFilter();
    }
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    if (e.target.value !== '') {
      filterRecipes(e.target.value);
    } else if (search === '') {
      clearFilter();
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteRecipe(confirmDelete);
      setAlert('Recipe deleted successfully', 'success');
      setConfirmDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Get filtered recipes
  const filteredRecipes = filtered || recipes || [];

  // Calculate pagination
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Default recipe image
  const defaultImage = 'https://via.placeholder.com/300x200?text=No+Image';

  // Log recipes for debugging
  useEffect(() => {
    if (recipes && recipes.length > 0) {
      console.log('Recipes loaded:', recipes.length);
      recipes.forEach(recipe => {
        console.log(`Recipe ${recipe.name} has image:`, recipe.image ? 'Yes' : 'No');
      });
    }
  }, [recipes]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Recipe Collection
        </Typography>
        <Paper 
          elevation={2} 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 2,
            alignItems: 'center',
            borderRadius: 2
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/recipes/add"
          >
            Add Recipe
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ImportExportIcon />}
            component={Link}
            to="/recipes/import"
            sx={{ mt: 2, ml: 2 }}
          >
            Import Recipe
          </Button>
        </Paper>
      </Box>

      {/* Search & Filter Bar */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2,
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <TextField
          placeholder="Search recipes..."
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
          size="small"
        />

        <FormControl variant="outlined" sx={{ minWidth: 200 }} size="small">
          <InputLabel id="category-label">Filter by Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={handleCategoryChange}
            label="Filter by Category"
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredRecipes.length === 0 ? (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No recipes found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {search || category ? 
              'Try adjusting your search or filters' : 
              'Start by adding your first recipe'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/recipes/add"
            sx={{ mt: 2 }}
          >
            Add Recipe
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ImportExportIcon />}
            component={Link}
            to="/recipes/import"
            sx={{ mt: 2, ml: 2 }}
          >
            Import Recipe
          </Button>
        </Paper>
      ) : (
        <>
          {/* Bento-style Recipe Grid */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(4, 1fr)'
              },
              gap: 3,
              alignItems: 'stretch'
            }}
          >
            {/* Featured Recipe */}
            {paginatedRecipes?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Card sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3
                }}>
                  <CardMedia
                    component="img"
                    sx={{ 
                      height: { xs: 200, md: '100%' },
                      width: { xs: '100%', md: 300 },
                      objectFit: 'cover'
                    }}
                    image={paginatedRecipes[0].image || defaultImage}
                    alt={paginatedRecipes[0].name}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography component="h3" variant="h5" fontWeight="bold">
                          {paginatedRecipes[0].name}
                        </Typography>
                        {!paginatedRecipes[0].isActive && (
                          <Chip label="Inactive" size="small" sx={{ ml: 1 }} />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {paginatedRecipes[0].description ? 
                          (paginatedRecipes[0].description.length > 200 ? 
                            `${paginatedRecipes[0].description.substring(0, 200)}...` : 
                            paginatedRecipes[0].description) : 
                          'No description available.'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {paginatedRecipes[0].primaryCategory && (
                          <Chip size="small" label={paginatedRecipes[0].primaryCategory} color="primary" />
                        )}
                        {paginatedRecipes[0].subCategory && (
                          <Chip size="small" label={paginatedRecipes[0].subCategory} />
                        )}
                      </Box>
                      
                      <Box>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => {
                            console.log('View Recipe clicked for:', paginatedRecipes[0]._id);
                            navigate(`/recipes/${paginatedRecipes[0]._id}`);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => {
                            console.log('Edit Recipe clicked for:', paginatedRecipes[0]._id);
                            navigate(`/recipes/edit/${paginatedRecipes[0]._id}`);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(paginatedRecipes[0]._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Box>
            )}

            {/* Remaining Recipes */}
            {paginatedRecipes.slice(1).map((recipe) => (
              <Card 
                key={recipe._id}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  console.log('Recipe card clicked:', recipe._id);
                  navigate(`/recipes/${recipe._id}`);
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={recipe.image || defaultImage}
                  alt={recipe.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1
                  }}>
                    <Typography gutterBottom variant="h6" component="div" noWrap fontWeight="medium">
                      {recipe.name}
                    </Typography>
                    
                    {recipe.status && (
                      <Chip 
                        label={recipe.status.charAt(0).toUpperCase() + recipe.status.slice(1)} 
                        color={recipe.status === 'live' ? 'success' : 
                               recipe.status === 'development' ? 'info' : 'default'} 
                        size="small"
                        sx={{ ml: 1, flexShrink: 0 }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    {recipe.primaryCategory && (
                      <Chip 
                        label={recipe.primaryCategory} 
                        size="small" 
                        color="primary" 
                      />
                    )}
                    {recipe.category && !recipe.primaryCategory && (
                      <Chip 
                        label={recipe.category} 
                        size="small" 
                        color="primary" 
                      />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 1,
                    minHeight: '2.5em'
                  }}>
                    {recipe.description || 'No description available'}
                  </Typography>
                </CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  px: 2,
                  pb: 1,
                  mt: 'auto'
                }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {(recipe.recipeYield?.value || recipe.servings) && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RestaurantIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {recipe.recipeYield?.value ? 
                            `${recipe.recipeYield.value} ${recipe.recipeYield.unit}` : 
                            `${recipe.servings} servings`}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the card click handler from firing
                        console.log('View Recipe clicked for:', recipe._id);
                        navigate(`/recipes/${recipe._id}`);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the card click handler from firing
                        console.log('Edit Recipe clicked for:', recipe._id);
                        navigate(`/recipes/edit/${recipe._id}`);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the card click handler from firing
                        handleDeleteClick(recipe._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Pagination Controls */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Pagination 
              count={Math.ceil(filteredRecipes.length / rowsPerPage)} 
              page={page + 1}
              onChange={(event, newPage) => handleChangePage(event, newPage - 1)} 
              color="primary" 
              showFirstButton 
              showLastButton
              size="large"
              sx={{ mb: 2 }}
            />
            <TablePagination
              component="div"
              count={filteredRecipes.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[4, 8, 12, 16, 24]}
              labelRowsPerPage="Recipes per page:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
              sx={{ border: 'none', '& .MuiTablePagination-toolbar': { paddingLeft: 0 } }}
            />
          </Box>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete !== null}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Recipe?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this recipe? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Recipes; 