import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  CircularProgress,
  Autocomplete,
  Tabs,
  Tab,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormGroup,
  FormLabel,
  Tooltip,
  Chip
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ImageIcon from '@mui/icons-material/Image';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkIcon from '@mui/icons-material/Link';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AuthContext from '../../context/auth/authContext';
import RecipeContext from '../../context/recipe/recipeContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';

const RecipeForm = () => {
  const authContext = useContext(AuthContext);
  const recipeContext = useContext(RecipeContext);
  const ingredientContext = useContext(IngredientContext);
  const alertContext = useContext(AlertContext);

  const { loadUser } = authContext;
  const { 
    addRecipe, 
    updateRecipe, 
    current, 
    clearCurrentRecipe, 
    getRecipe,
    loading 
  } = recipeContext;
  const { ingredients, getIngredients } = ingredientContext;
  const { setAlert } = alertContext;

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== undefined;

  // Predefined categories for recipes
  const primaryCategories = [
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

  // Subcategories
  const subCategories = {
    'Appetizer': ['Hot', 'Cold', 'Finger Food', 'Dips', 'Salads'],
    'Main Course': ['Beef', 'Poultry', 'Seafood', 'Vegetarian', 'Pasta', 'Rice', 'Stew'],
    'Side Dish': ['Vegetables', 'Potatoes', 'Rice', 'Pasta', 'Bread'],
    'Dessert': ['Cake', 'Pie', 'Ice Cream', 'Cookies', 'Pudding', 'Fruit'],
    'Beverage': ['Alcoholic', 'Non-Alcoholic', 'Hot', 'Cold', 'Smoothie'],
    'Breakfast': ['Eggs', 'Pancakes', 'Waffles', 'Cereal', 'Pastry'],
    'Lunch': ['Sandwich', 'Soup', 'Salad', 'Wrap', 'Bowl'],
    'Dinner': ['Formal', 'Casual', 'Family Style', 'Buffet'],
    'Snack': ['Sweet', 'Savory', 'Healthy', 'Indulgent'],
    'Bakery': ['Bread', 'Pastry', 'Cake', 'Cookie', 'Muffin']
  };

  // Revenue outlets
  const revenueOutlets = [
    'Restaurant',
    'Bar',
    'Cafe',
    'Room Service',
    'Banquet',
    'Catering',
    'Takeaway',
    'Online Delivery'
  ];

  // Initial state for the recipe form
  const [recipe, setRecipe] = useState({
    name: '',
    status: 'development',
    menuAssignment: '',
    primaryCategory: '',
    subCategory: '',
    recipeYield: {
      value: 1,
      unit: 'serving'
    },
    revenueOutlet: '',
    itemClass: 'food',
    vatPercentage: 20,
    costOfSalesPercentage: 30,
    wastagePercentage: 5,
    
    // Legacy fields
    category: '',
    description: '',
    servings: '',
    prepTime: '',
    cookTime: '',
    
    image: '',
    videoUrl: '',
    isActive: true,
    
    ingredients: [],
    subRecipes: [],
    extraIngredients: [],
    instructions: [],
    
    criticalControl: '',
    serviceNotes: '',
    
    suitability: {
      kosher: false,
      lowCarb: false,
      vegan: false,
      vegetarian: false,
      plantBased: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false
    },
    
    allergens: {
      celery: false,
      gluten: false,
      crustaceans: false,
      eggs: false,
      fish: false,
      lupin: false,
      milk: false,
      molluscs: false,
      mustard: false,
      nuts: false,
      peanuts: false,
      sesameSeeds: false,
      soybeans: false,
      sulphurDioxide: false
    },
    
    actualSellingPrice: 0
  });

  // State for new ingredient and instruction
  const [newIngredient, setNewIngredient] = useState({
    ingredient: null,
    quantity: '',
    unit: ''
  });
  const [newInstruction, setNewInstruction] = useState('');

  // State for image upload
  const [imageTab, setImageTab] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Add state for ingredient editing
  const [editIngredientDialogOpen, setEditIngredientDialogOpen] = useState(false);
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [editingIngredient, setEditingIngredient] = useState({
    ingredient: null,
    quantity: '',
    unit: ''
  });

  // Add state for sub-recipes and extra ingredients
  const [newSubRecipe, setNewSubRecipe] = useState({
    recipe: null,
    quantity: '',
    unit: ''
  });
  
  const [newExtraIngredient, setNewExtraIngredient] = useState({
    ingredient: null,
    quantity: '',
    unit: ''
  });

  // Add state for instruction editing
  const [editingInstructionIndex, setEditingInstructionIndex] = useState(null);

  // Add state for financial calculations
  const [financialData, setFinancialData] = useState({
    costPrice: 0,
    costPriceWithWastage: 0,
    suggestedSellingPrice: 0,
    grossProfit: 0,
    grossProfitPercentage: 0,
    costOfSalesActual: 0
  });

  // Add state for tabs
  const [activeTab, setActiveTab] = useState(0);

  // Load user data, recipe data if in edit mode, and ingredients
  useEffect(() => {
    console.log('RecipeForm: Initial loading');
    
    // Remove loadUser since we've disabled authentication
    // loadUser();
    
    // Load ingredients first
    getIngredients();
    
    if (isEditMode) {
      getRecipe(id);
    } else {
      clearCurrentRecipe();
    }

    return () => {
      clearCurrentRecipe();
    };
    // eslint-disable-next-line
  }, [id]);

  // Add debug logging for ingredients
  useEffect(() => {
    console.log('Ingredients loaded:', ingredients ? ingredients.length : 0);
  }, [ingredients]);

  // Update form when current recipe changes
  useEffect(() => {
    if (current) {
      console.log('Current recipe loaded:', current);
      setRecipe(current);
    }
  }, [current]);

  const { 
    name, 
    status, 
    menuAssignment, 
    primaryCategory, 
    subCategory, 
    recipeYield,
    revenueOutlet,
    itemClass,
    vatPercentage,
    costOfSalesPercentage,
    wastagePercentage,
    category,
    description,
    servings,
    prepTime,
    cookTime,
    image,
    videoUrl,
    isActive,
    ingredients: recipeIngredients,
    instructions 
  } = recipe;

  const handleChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value
    });
  };

  const handleSwitchChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.checked
    });
  };

  const handleIngredientChange = (e) => {
    setNewIngredient({
      ...newIngredient,
      [e.target.name]: e.target.value
    });
  };

  const handleIngredientSelect = (event, value) => {
    setNewIngredient({
      ...newIngredient,
      ingredient: value
    });
  };

  const addIngredientToRecipe = () => {
    if (!newIngredient.ingredient || !newIngredient.quantity) {
      setAlert('Please select an ingredient and specify quantity', 'error');
      return;
    }

    const ingredientToAdd = {
      _id: newIngredient.ingredient._id,
      name: newIngredient.ingredient.name,
      quantity: newIngredient.quantity,
      unit: newIngredient.unit || newIngredient.ingredient.unitType
    };

    setRecipe({
      ...recipe,
      ingredients: [...recipeIngredients, ingredientToAdd]
    });

    // Reset new ingredient form
    setNewIngredient({
      ingredient: null,
      quantity: '',
      unit: ''
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...recipeIngredients];
    updatedIngredients.splice(index, 1);
    setRecipe({
      ...recipe,
      ingredients: updatedIngredients
    });
  };

  const handleAddInstruction = () => {
    // Trim whitespace and validate the instruction
    const trimmedInstruction = newInstruction.trim();
    
    if (trimmedInstruction.length < 3) {
      setAlert('Instruction step must be at least 3 characters long', 'error');
      return;
    }
    
    if (trimmedInstruction !== '') {
      if (editingInstructionIndex !== null) {
        // Update existing instruction
        const updatedInstructions = [...recipe.instructions];
        updatedInstructions[editingInstructionIndex] = trimmedInstruction;
        setRecipe({
          ...recipe,
          instructions: updatedInstructions
        });
        setEditingInstructionIndex(null);
      } else {
        // Add new instruction
        setRecipe({
          ...recipe,
          instructions: [...recipe.instructions, trimmedInstruction]
        });
      }
      setNewInstruction('');
    }
  };

  const removeInstruction = (index) => {
    const updatedInstructions = [...instructions];
    updatedInstructions.splice(index, 1);
    setRecipe({
      ...recipe,
      instructions: updatedInstructions
    });
  };

  const moveInstruction = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === instructions.length - 1)
    ) {
      return;
    }

    const updatedInstructions = [...instructions];
    const temp = updatedInstructions[index];
    
    if (direction === 'up') {
      updatedInstructions[index] = updatedInstructions[index - 1];
      updatedInstructions[index - 1] = temp;
    } else {
      updatedInstructions[index] = updatedInstructions[index + 1];
      updatedInstructions[index + 1] = temp;
    }

    setRecipe({
      ...recipe,
      instructions: updatedInstructions
    });
  };

  // Handle edit instruction click
  const handleEditInstructionClick = (index) => {
    setEditingInstructionIndex(index);
    setNewInstruction(instructions[index]);
  };

  // Handle cancel instruction edit
  const handleCancelInstructionEdit = () => {
    setEditingInstructionIndex(null);
    setNewInstruction('');
  };

  // Handle image tab change
  const handleImageTabChange = (event, newValue) => {
    setImageTab(newValue);
    // Clear image preview when switching tabs
    if (newValue === 0) {
      setImagePreview('');
      setUploadedImage(null);
    } else {
      setRecipe({
        ...recipe,
        image: ''
      });
    }
  };

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setImagePreview(imageData);
        // Store the base64 image in the recipe state
        setRecipe({
          ...recipe,
          image: imageData
        });
        console.log('Image loaded and set to recipe state, length:', imageData.length);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open ingredient edit dialog
  const handleEditIngredientClick = (index) => {
    const ingredient = recipeIngredients[index];
    setEditingIngredientIndex(index);
    
    // Find the full ingredient object from the ingredients array
    const fullIngredient = ingredients.find(ing => ing._id === ingredient._id);
    
    setEditingIngredient({
      ingredient: fullIngredient || null,
      quantity: ingredient.quantity || '',
      unit: ingredient.unit || ''
    });
    
    setEditIngredientDialogOpen(true);
  };
  
  // Close ingredient edit dialog
  const handleCloseIngredientEdit = () => {
    setEditIngredientDialogOpen(false);
    setEditingIngredientIndex(null);
  };
  
  // Handle changes to the editing ingredient
  const handleEditIngredientChange = (e) => {
    setEditingIngredient({
      ...editingIngredient,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle ingredient selection in edit dialog
  const handleEditIngredientSelect = (event, value) => {
    setEditingIngredient({
      ...editingIngredient,
      ingredient: value
    });
  };
  
  // Save edited ingredient
  const saveEditedIngredient = () => {
    if (!editingIngredient.ingredient || !editingIngredient.quantity) {
      setAlert('Please select an ingredient and specify quantity', 'error');
      return;
    }
    
    const updatedIngredients = [...recipeIngredients];
    
    updatedIngredients[editingIngredientIndex] = {
      _id: editingIngredient.ingredient._id,
      name: editingIngredient.ingredient.name,
      quantity: editingIngredient.quantity,
      unit: editingIngredient.unit || editingIngredient.ingredient.unitType
    };
    
    setRecipe({
      ...recipe,
      ingredients: updatedIngredients
    });
    
    setAlert('Ingredient updated successfully', 'success');
    handleCloseIngredientEdit();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !primaryCategory) {
      setAlert('Recipe name and primary category are required', 'error');
      return;
    }

    if (recipeIngredients.length === 0) {
      setAlert('Please add at least one ingredient', 'error');
      return;
    }

    if (instructions.length === 0) {
      setAlert('Please add at least one instruction', 'error');
      return;
    }

    // Prepare the recipe data
    const recipeData = {
      ...recipe
    };

    console.log('Submitting recipe with image:', recipeData.image ? `Length: ${recipeData.image.length}` : 'No image');
    console.log('Submitting recipe with videoUrl:', recipeData.videoUrl);

    if (isEditMode) {
      updateRecipe(recipeData);
      setAlert('Recipe updated successfully', 'success');
    } else {
      addRecipe(recipeData);
      setAlert('Recipe added successfully', 'success');
    }

    // Redirect to recipes list
    navigate('/recipes');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Recipe' : 'Add Recipe'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/recipes')}
        >
          Back to Recipes
        </Button>
      </Box>

      {/* Show error if ingredients failed to load */}
      {ingredientContext.error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error" variant="body1">
            Error loading ingredients: {ingredientContext.error}
          </Typography>
        </Box>
      )}

      {/* Show loading spinner only if loading recipes in edit mode */}
      {(loading && isEditMode) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading recipe data...
          </Typography>
        </Box>
      ) : (
        <Paper elevation={2} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Recipe Name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={status || 'development'}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="development">Development</MenuItem>
                    <MenuItem value="live">Live</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="primary-category-label">Primary Category</InputLabel>
                  <Select
                    labelId="primary-category-label"
                    id="primaryCategory"
                    name="primaryCategory"
                    value={primaryCategory}
                    onChange={handleChange}
                    label="Primary Category"
                  >
                    <MenuItem value="">
                      <em>Select a primary category</em>
                    </MenuItem>
                    {primaryCategories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="menu-assignment-label">Menu Assignment</InputLabel>
                  <Select
                    labelId="menu-assignment-label"
                    id="menuAssignment"
                    name="menuAssignment"
                    value={menuAssignment || ''}
                    onChange={handleChange}
                    label="Menu Assignment"
                  >
                    <MenuItem value="">
                      <em>Not assigned to a menu</em>
                    </MenuItem>
                    {/* This would need to be populated with available menus from context */}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="sub-category-label">Sub Category</InputLabel>
                  <Select
                    labelId="sub-category-label"
                    id="subCategory"
                    name="subCategory"
                    value={subCategory}
                    onChange={handleChange}
                    label="Sub Category"
                  >
                    <MenuItem value="">
                      <em>Select a sub category</em>
                    </MenuItem>
                    {subCategories[primaryCategory]?.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={description}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={3}
                  helperText="Brief description of the recipe"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Servings"
                  name="servings"
                  value={servings}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                  InputProps={{
                    inputProps: { min: 1 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Prep Time (minutes)"
                  name="prepTime"
                  value={prepTime}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Cook Time (minutes)"
                  name="cookTime"
                  value={cookTime}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                  Media
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Tabs
                  value={imageTab}
                  onChange={handleImageTabChange}
                  aria-label="image source tabs"
                  sx={{ mb: 2 }}
                >
                  <Tab icon={<LinkIcon />} label="Image URL" />
                  <Tab icon={<FileUploadIcon />} label="Upload Image" />
                </Tabs>

                {imageTab === 0 ? (
                  <TextField
                    fullWidth
                    label="Image URL"
                    name="image"
                    value={image}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="URL to an image of the finished recipe"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<FileUploadIcon />}
                      sx={{ mb: 2 }}
                    >
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                      />
                    </Button>
                    {imagePreview && (
                      <Card sx={{ maxWidth: 345, mt: 2, mb: 2 }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={imagePreview}
                          alt="Recipe preview"
                        />
                      </Card>
                    )}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="YouTube Video URL"
                  name="videoUrl"
                  value={videoUrl}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Link to a YouTube video for this recipe (e.g., https://www.youtube.com/watch?v=EXAMPLE)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <YouTubeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={handleSwitchChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active Recipe"
                />
              </Grid>

              {/* Ingredients Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                  Ingredients
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <Autocomplete
                        id="ingredient-select"
                        options={ingredients || []}
                        getOptionLabel={(option) => option.name}
                        value={newIngredient.ingredient}
                        onChange={handleIngredientSelect}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Ingredient"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        name="quantity"
                        value={newIngredient.quantity}
                        onChange={handleIngredientChange}
                        variant="outlined"
                        type="number"
                        InputProps={{
                          inputProps: { min: 0, step: 0.01 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        label="Unit"
                        name="unit"
                        value={newIngredient.unit}
                        onChange={handleIngredientChange}
                        variant="outlined"
                        placeholder={newIngredient.ingredient ? newIngredient.ingredient.unitType : ''}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={addIngredientToRecipe}
                        fullWidth
                      >
                        <AddIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <List>
                  {recipeIngredients.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 2 }}>
                      No ingredients added yet. Add ingredients using the form above.
                    </Typography>
                  ) : (
                    recipeIngredients.map((ing, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={ing.name}
                          secondary={`${ing.quantity} ${ing.unit}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditIngredientClick(index)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => removeIngredient(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </Grid>

              {/* Instructions Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                  Instructions
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={11}>
                      <TextField
                        fullWidth
                        label="Instruction Step"
                        value={newInstruction}
                        onChange={(e) => setNewInstruction(e.target.value)}
                        variant="outlined"
                        multiline
                        rows={2}
                        placeholder="Enter a clear, specific cooking instruction (e.g., 'Preheat oven to 350°F and line a baking sheet with parchment paper.')"
                        helperText={`${newInstruction.length} characters. Instructions should be clear and descriptive.`}
                        error={newInstruction.trim().length > 0 && newInstruction.trim().length < 3}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddInstruction}
                        fullWidth
                        disabled={newInstruction.trim().length < 3}
                      >
                        <AddIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <List>
                  {instructions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 2 }}>
                      No instructions added yet. Add steps using the form above.
                    </Typography>
                  ) : (
                    instructions.map((instruction, index) => (
                      <ListItem key={index} divider>
                        <DragIndicatorIcon sx={{ mr: 2, color: 'text.secondary' }} />
                        <ListItemText
                          primary={`Step ${index + 1}`}
                          secondary={instruction}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditInstructionClick(index)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="move up"
                            onClick={() => moveInstruction(index, 'up')}
                            disabled={index === 0}
                            sx={{ mr: 1 }}
                          >
                            <ArrowBackIcon sx={{ transform: 'rotate(90deg)' }} />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="move down"
                            onClick={() => moveInstruction(index, 'down')}
                            disabled={index === instructions.length - 1}
                            sx={{ mr: 1 }}
                          >
                            <ArrowBackIcon sx={{ transform: 'rotate(-90deg)' }} />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => removeInstruction(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </Grid>

              {/* Recipe Yield */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Recipe Yield
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Yield Value"
                      value={recipe.recipeYield?.value || '1'}
                      onChange={(e) => setRecipe({
                        ...recipe,
                        recipeYield: {
                          ...recipe.recipeYield,
                          value: e.target.value
                        }
                      })}
                      InputProps={{
                        inputProps: { min: 1 }
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Yield Unit"
                      value={recipe.recipeYield?.unit || 'serving'}
                      onChange={(e) => setRecipe({
                        ...recipe,
                        recipeYield: {
                          ...recipe.recipeYield,
                          unit: e.target.value
                        }
                      })}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Financial Information */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Financial Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="VAT/Tax Percentage"
                  name="vatPercentage"
                  value={vatPercentage || 20}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: { min: 0, max: 100 }
                  }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Cost of Sales Percentage"
                  name="costOfSalesPercentage"
                  value={costOfSalesPercentage || 30}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: { min: 0, max: 100 }
                  }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Wastage Percentage"
                  name="wastagePercentage"
                  value={wastagePercentage || 5}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: { min: 0, max: 100 }
                  }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Actual Selling Price"
                  name="actualSellingPrice"
                  value={recipe.actualSellingPrice || 0}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0 }
                  }}
                  variant="outlined"
                />
              </Grid>

              {/* Financial Calculations Summary - only show if in edit mode and there's data */}
              {isEditMode && recipe.costPrice && (
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Financial Calculations
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary">Cost Price:</Typography>
                        <Typography variant="body1">${recipe.costPrice?.toFixed(2) || '0.00'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary">With Wastage:</Typography>
                        <Typography variant="body1">${recipe.costPriceWithWastage?.toFixed(2) || '0.00'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary">Suggested Price:</Typography>
                        <Typography variant="body1">${recipe.suggestedSellingPrice?.toFixed(2) || '0.00'}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="textSecondary">Gross Profit:</Typography>
                        <Typography variant="body1">${recipe.grossProfit?.toFixed(2) || '0.00'} ({recipe.grossProfitPercentage?.toFixed(2) || '0.00'}%)</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}

              {/* Suitability & Allergens */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Suitability & Allergens
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Suitability
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.suitability?.vegetarian || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            suitability: {
                              ...recipe.suitability,
                              vegetarian: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Vegetarian"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.suitability?.vegan || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            suitability: {
                              ...recipe.suitability,
                              vegan: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Vegan"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.suitability?.glutenFree || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            suitability: {
                              ...recipe.suitability,
                              glutenFree: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Gluten Free"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.suitability?.dairyFree || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            suitability: {
                              ...recipe.suitability,
                              dairyFree: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Dairy Free"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.suitability?.nutFree || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            suitability: {
                              ...recipe.suitability,
                              nutFree: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Nut Free"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.suitability?.kosher || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            suitability: {
                              ...recipe.suitability,
                              kosher: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Kosher"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.suitability?.lowCarb || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            suitability: {
                              ...recipe.suitability,
                              lowCarb: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Low Carb"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.suitability?.plantBased || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            suitability: {
                              ...recipe.suitability,
                              plantBased: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Plant Based"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Allergens
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.allergens?.gluten || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            allergens: {
                              ...recipe.allergens,
                              gluten: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Gluten"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.allergens?.crustaceans || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            allergens: {
                              ...recipe.allergens,
                              crustaceans: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Crustaceans"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.allergens?.eggs || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            allergens: {
                              ...recipe.allergens,
                              eggs: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Eggs"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.allergens?.fish || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            allergens: {
                              ...recipe.allergens,
                              fish: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Fish"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.allergens?.peanuts || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            allergens: {
                              ...recipe.allergens,
                              peanuts: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Peanuts"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.allergens?.nuts || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            allergens: {
                              ...recipe.allergens,
                              nuts: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Tree Nuts"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.allergens?.milk || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            allergens: {
                              ...recipe.allergens,
                              milk: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Milk"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.allergens?.celery || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            allergens: {
                              ...recipe.allergens,
                              celery: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Celery"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.allergens?.mustard || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            allergens: {
                              ...recipe.allergens,
                              mustard: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Mustard"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recipe.allergens?.sesameSeeds || false}
                          onChange={(e) => setRecipe({
                            ...recipe,
                            allergens: {
                              ...recipe.allergens,
                              sesameSeeds: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Sesame Seeds"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                >
                  {isEditMode ? 'Update Recipe' : 'Add Recipe'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {/* Ingredient Edit Dialog */}
      <Dialog open={editIngredientDialogOpen} onClose={handleCloseIngredientEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Ingredient</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                id="edit-ingredient-select"
                options={ingredients || []}
                getOptionLabel={(option) => option.name}
                value={editingIngredient.ingredient}
                onChange={handleEditIngredientSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Ingredient"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                value={editingIngredient.quantity}
                onChange={handleEditIngredientChange}
                variant="outlined"
                type="number"
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Unit"
                name="unit"
                value={editingIngredient.unit}
                onChange={handleEditIngredientChange}
                variant="outlined"
                placeholder={editingIngredient.ingredient ? editingIngredient.ingredient.unitType : ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIngredientEdit} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={saveEditedIngredient} 
            color="primary" 
            variant="contained"
            disabled={!editingIngredient.ingredient || !editingIngredient.quantity}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecipeForm; 