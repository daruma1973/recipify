import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
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
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Badge
} from '@mui/material';
import Container from '../layout/Container';
import BentoCard from '../common/BentoCard';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WineBarIcon from '@mui/icons-material/WineBar';
import LiquorIcon from '@mui/icons-material/Liquor';

import AuthContext from '../../context/auth/authContext';
import RecipeContext from '../../context/recipe/recipeContext';
import AlertContext from '../../context/alert/alertContext';

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

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
}));

const FilterSelect = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: theme.shadows[2],
  }
}));

const RecipeChip = styled(Chip)(({ theme, color = 'primary' }) => ({
  borderRadius: 16,
  fontWeight: 600,
  '&.MuiChip-filled': {
    backgroundColor: theme.palette[color].light,
    color: theme.palette[color].dark,
  },
}));

const FeaturedRecipeBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 24,
  minHeight: 300,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: theme.spacing(3),
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
    zIndex: 1,
  },
}));

const FeaturedContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
  color: '#fff',
});

const RecipeAvatarWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(1),
}));

const RecipeMetric = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(2),
  '& svg': {
    fontSize: 18,
    marginRight: theme.spacing(0.5),
  },
}));

// Default image for recipes
const defaultImage = 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80';

// Random colors for recipes without images
const randomColors = [
  'linear-gradient(45deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
  'linear-gradient(45deg, #A9C9FF 0%, #FFBBEC 100%)',
  'linear-gradient(45deg, #FBDA61 0%, #FF5ACD 100%)',
  'linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
  'linear-gradient(45deg, #8BC6EC 0%, #9599E2 100%)',
];

const Recipes = () => {
  const authContext = useContext(AuthContext);
  const recipeContext = useContext(RecipeContext);
  const alertContext = useContext(AlertContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
  const [openFilters, setOpenFilters] = useState(false);

  // Predefined categories for cocktails
  const categories = [
    'Signature',
    'Classic',
    'Martini',
    'Highball',
    'Sour',
    'Tiki',
    'Spirit-Forward',
    'Low-ABV',
    'Non-Alcoholic',
    'Seasonal'
  ];

  // Load user data and recipes when component mounts
  useEffect(() => {
    console.log('Recipes component: Loading cocktails');
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

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Delete handlers
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteRecipe(confirmDelete);
      setAlert('Cocktail deleted successfully', 'success');
      setConfirmDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Toggle filter panel on mobile
  const toggleFilters = () => {
    setOpenFilters(!openFilters);
  };

  // Get the recipes that should be displayed
  const filteredRecipes = filtered || recipes || [];
  
  const paginatedRecipes = filteredRecipes
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Function to get a random gradient for recipes without images
  const getRandomGradient = (index) => {
    return randomColors[index % randomColors.length];
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <DecorativeCircle color="primary.light" size={200} opacity={0.15} top="-50px" right="-50px" />
        <DecorativeShape color="secondary.light" opacity={0.1} bottom="30px" left="-20px" shape="pill" />
        
        <Box mb={4} mt={2} sx={{ position: 'relative', zIndex: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Typography variant="h3" fontWeight={800}>
              Cocktail Collection
            </Typography>
            
            <Box display="flex" gap={2}>
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component={Link}
                to="/recipes/add"
              >
                Add Cocktail
              </ActionButton>
              
              <ActionButton
                variant="outlined"
                color="primary"
                startIcon={<ImportExportIcon />}
                component={Link}
                to="/recipes/import"
              >
                Import
              </ActionButton>
            </Box>
          </Box>
          
          <Typography variant="subtitle1" color="text.secondary" mt={1}>
            Browse, search and manage your signature cocktails and drinks
          </Typography>
        </Box>
        
        {/* Search & Filter Bar */}
        <Box 
          sx={{ 
            mb: 4,
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
            position: 'relative',
            zIndex: 2
          }}
        >
          <SearchField
            placeholder="Search cocktails..."
            variant="outlined"
            fullWidth
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
            size="medium"
          />
          
          {isMobile ? (
            <>
              <ActionButton
                variant="outlined"
                color="primary"
                startIcon={<FilterListIcon />}
                onClick={toggleFilters}
                fullWidth
              >
                Filters
              </ActionButton>
              
              {openFilters && (
                <FilterSelect variant="outlined" fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    value={category}
                    onChange={handleCategoryChange}
                    label="Category"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FilterSelect>
              )}
            </>
          ) : (
            <FilterSelect variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FilterSelect>
          )}
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : filteredRecipes.length === 0 ? (
          <BentoCard
            title="No cocktails found"
            subtitle={search || category ? 'Try adjusting your search or filters' : 'Start by adding your first cocktail recipe'}
            colorVariant="blue"
            avatar={<LocalBarIcon />}
            avatarBg="primary.main"
            sx={{ 
              p: 4, 
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <DecorativeCircle color="info.light" size={150} opacity={0.2} top="-40px" right="-40px" />
            
            <Box sx={{ position: 'relative', zIndex: 1, mt: 2 }}>
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component={Link}
                to="/recipes/add"
                size="large"
                sx={{ mt: 2, mr: 2 }}
              >
                Add Cocktail
              </ActionButton>
              <ActionButton
                variant="outlined"
                color="primary"
                startIcon={<ImportExportIcon />}
                component={Link}
                to="/recipes/import"
                size="large"
                sx={{ mt: 2 }}
              >
                Import Cocktail
              </ActionButton>
            </Box>
          </BentoCard>
        ) : (
          <>
            {/* Featured Cocktail - Display the first recipe in a special banner */}
            {paginatedRecipes?.length > 0 && (
              <FeaturedRecipeBanner
                sx={{
                  backgroundImage: `url(${paginatedRecipes[0].image || defaultImage})`,
                  mb: 4
                }}
              >
                <FeaturedContent>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <RecipeChip 
                      label="Featured" 
                      color="warning" 
                      icon={<StarIcon />} 
                    />
                    {paginatedRecipes[0].primaryCategory && (
                      <RecipeChip 
                        label={paginatedRecipes[0].primaryCategory} 
                        color="primary" 
                      />
                    )}
                  </Box>
                  
                  <Typography variant="h3" fontWeight={800} gutterBottom>
                    {paginatedRecipes[0].name}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 3, maxWidth: '70%' }}>
                    {paginatedRecipes[0].description ? 
                      (paginatedRecipes[0].description.length > 150 ? 
                        `${paginatedRecipes[0].description.substring(0, 150)}...` : 
                        paginatedRecipes[0].description) : 
                      'No description available.'}
                  </Typography>
                  
                  <Box display="flex" gap={2}>
                    <ActionButton
                      variant="contained"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      component={Link}
                      to={`/recipes/${paginatedRecipes[0]._id}`}
                      sx={{ backdropFilter: 'blur(10px)', bgcolor: 'rgba(255,255,255,0.2)' }}
                    >
                      View Cocktail
                    </ActionButton>
                    
                    <IconButton
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                      }}
                      component={Link}
                      to={`/recipes/edit/${paginatedRecipes[0]._id}`}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </FeaturedContent>
              </FeaturedRecipeBanner>
            )}
            
            {/* Cocktail Grid */}
            <Grid container spacing={3}>
              {paginatedRecipes.slice(1).map((recipe, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={recipe._id}>
                  <BentoCard
                    colorVariant={['purple', 'blue', 'orange', 'green', 'yellow'][index % 5]}
                    clickable
                    sx={{ height: '100%' }}
                  >
                    <RecipeAvatarWrapper>
                      <Avatar 
                        src={recipe.image}
                        alt={recipe.name}
                        variant="rounded"
                        sx={{ 
                          width: '100%', 
                          height: 160, 
                          mb: 2,
                          bgcolor: recipe.image ? 'transparent' : getRandomGradient(index),
                          backgroundSize: 'cover',
                          borderRadius: 3,
                        }}
                      >
                        {!recipe.image && <LocalBarIcon sx={{ fontSize: 40 }} />}
                      </Avatar>
                      
                      {recipe.isFeatured && (
                        <Avatar
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 32,
                            height: 32,
                            bgcolor: 'warning.main',
                          }}
                        >
                          <StarIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                      )}
                    </RecipeAvatarWrapper>
                    
                    <Box mb={2}>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        {recipe.name}
                      </Typography>
                      
                      {recipe.primaryCategory && (
                        <RecipeChip
                          label={recipe.primaryCategory}
                          size="small"
                          color="primary"
                        />
                      )}
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        height: 40,
                      }}
                    >
                      {recipe.description || 'No description available.'}
                    </Typography>
                    
                    <Box display="flex" mt={1} mb={2}>
                      <RecipeMetric>
                        <AccessTimeIcon />
                        <Typography variant="body2">
                          {recipe.prepTime || '--'} min
                        </Typography>
                      </RecipeMetric>
                      
                      <RecipeMetric>
                        <PeopleIcon />
                        <Typography variant="body2">
                          {recipe.servings || '--'}
                        </Typography>
                      </RecipeMetric>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <ActionButton
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/recipes/${recipe._id}`}
                        size="small"
                        sx={{ px: 2 }}
                      >
                        View
                      </ActionButton>
                      
                      <Box>
                        <IconButton
                          color="primary"
                          component={Link}
                          to={`/recipes/edit/${recipe._id}`}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(recipe._id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </BentoCard>
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mt: 4,
                mb: 2
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  p: 1,
                  borderRadius: 20,
                  bgcolor: 'rgba(0,0,0,0.03)',
                }}
              >
                {Array.from(Array(Math.ceil(filteredRecipes.length / rowsPerPage)).keys()).map(
                  (number) => (
                    <Button
                      key={number}
                      variant={page === number ? "contained" : "text"}
                      color="primary"
                      onClick={(e) => handleChangePage(e, number)}
                      sx={{ 
                        minWidth: 40,
                        height: 40,
                        borderRadius: '50%',
                        fontWeight: page === number ? 700 : 400
                      }}
                    >
                      {number + 1}
                    </Button>
                  )
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete !== null}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this cocktail? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCancelDelete} 
            color="primary"
            variant="outlined"
            sx={{ borderRadius: 20 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{ borderRadius: 20 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Recipes; 