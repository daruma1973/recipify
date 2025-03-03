import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Alert,
  Tab,
  Tabs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Step,
  StepLabel,
  Stepper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SettingsIcon from '@mui/icons-material/Settings';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AuthContext from '../../context/auth/authContext';
import RecipeContext from '../../context/recipe/recipeContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';
import RecipeSourceContext from '../../context/recipeSource/recipeSourceContext';
import RecipeSourceList from './RecipeSourceList';
import axios from 'axios';
import { downloadCsvTemplate, uploadBatchRecipes } from '../../api/recipeApi';

const RecipeImport = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const recipeContext = useContext(RecipeContext);
  const ingredientContext = useContext(IngredientContext);
  const alertContext = useContext(AlertContext);
  const recipeSourceContext = useContext(RecipeSourceContext);

  const { loadUser } = authContext;
  const { addRecipe } = recipeContext;
  const { ingredients, getIngredients } = ingredientContext;
  const { setAlert } = alertContext;
  const { recipeSources, getRecipeSources } = recipeSourceContext;

  // State for tabs
  const [activeTab, setActiveTab] = useState(0);

  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // State for batch import
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // State for import
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [ingredientMatches, setIngredientMatches] = useState({});
  const [isImporting, setIsImporting] = useState(false);
  const [importStep, setImportStep] = useState(1); // 1: Preview, 2: Match ingredients

  useEffect(() => {
    loadUser();
    getIngredients();
    getRecipeSources();
    // eslint-disable-next-line
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setAlert('Please enter a search term', 'error');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      // We'll use a proxy route on our server to search for recipes
      const res = await axios.get(`/api/recipes/search?q=${encodeURIComponent(searchQuery)}${selectedSource ? `&source=${encodeURIComponent(selectedSource)}` : ''}`);
      
      if (res.data && res.data.length > 0) {
        setSearchResults(res.data);
      } else {
        setSearchError('No recipes found. Try a different search term.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Error searching for recipes. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is CSV
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setAlert('Please upload a CSV file', 'error');
        setCsvFile(null);
        event.target.value = null;
        return;
      }
      
      setCsvFile(file);
      setCurrentStep(1);
      setUploadedRecipes([]);
      setUploadError(null);
    }
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      setAlert('Please select a CSV file to upload', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Use the uploadBatchRecipes function from our API helper
      const response = await uploadBatchRecipes(csvFile, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success) {
        setUploadedRecipes(response.recipes);
        setCurrentStep(2);
        setAlert(`Successfully imported ${response.recipes.length} recipes`, 'success');
      } else {
        setUploadError(response.message || 'Error uploading recipes');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      setUploadError(error.response?.data?.message || 'Server error during upload');
      setAlert('Error uploading recipes. Please check your CSV file format.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecipeSelect = async (recipe) => {
    setSelectedRecipe(recipe);
    setIsImporting(true);
    
    try {
      // Fetch detailed recipe information
      console.log('Fetching detailed recipe information for:', recipe.title);
      const res = await axios.get(`/api/recipes/details?url=${encodeURIComponent(recipe.sourceUrl)}`);
      
      if (res.data) {
        // Update the selected recipe with detailed information
        const detailedRecipe = { ...recipe, ...res.data };
        setSelectedRecipe(detailedRecipe);
        
        // Initialize ingredient matches
        const matches = {};
        detailedRecipe.ingredients.forEach(ingredient => {
          // Find potential matches in our database
          const potentialMatches = findPotentialMatches(ingredient.name);
          matches[ingredient.name] = {
            original: ingredient,
            potentialMatches,
            selected: potentialMatches.length > 0 ? potentialMatches[0]._id : 'new'
          };
        });
        
        setIngredientMatches(matches);
      }
    } catch (err) {
      console.error('Error fetching recipe details:', err);
      setAlert('Error fetching recipe details. Using basic information.', 'error');
      
      // Initialize ingredient matches with basic information
      const matches = {};
      recipe.ingredients.forEach(ingredient => {
        matches[ingredient.name] = {
          original: ingredient,
          potentialMatches: [],
          selected: 'new'
        };
      });
      
      setIngredientMatches(matches);
    } finally {
      setIsImporting(false);
      setImportDialogOpen(true);
      setImportStep(1);
    }
  };

  const findPotentialMatches = (ingredientName) => {
    if (!ingredients || ingredients.length === 0) return [];
    
    // Simple matching algorithm - can be improved
    const normalizedName = ingredientName.toLowerCase();
    return ingredients
      .filter(ing => {
        const ingName = ing.name.toLowerCase();
        return ingName.includes(normalizedName) || 
               normalizedName.includes(ingName);
      })
      .slice(0, 5); // Limit to top 5 matches
  };

  const handleIngredientMatch = (originalName, ingredientId) => {
    setIngredientMatches(prev => ({
      ...prev,
      [originalName]: {
        ...prev[originalName],
        selected: ingredientId
      }
    }));
  };

  const handleImportRecipe = async () => {
    setIsImporting(true);
    
    try {
      // First, create any new ingredients that were selected
      const newIngredients = {};
      
      for (const [originalName, match] of Object.entries(ingredientMatches)) {
        if (match.selected === 'new') {
          console.log(`Creating new ingredient for: ${originalName}`);
          
          // Create a new ingredient
          const newIngredient = {
            name: originalName,
            description: `Imported from recipe: ${selectedRecipe.title}`,
            unitType: match.original.unit || 'each',
            unitCost: 0, // Default cost
            stockQuantity: 0, // Default stock
            isActive: true
          };
          
          try {
            // Add the ingredient to the database
            const res = await axios.post('/api/inventory', newIngredient);
            
            // Store the new ingredient ID for use in the recipe
            newIngredients[originalName] = res.data._id;
            console.log(`Created new ingredient: ${originalName} with ID: ${res.data._id}`);
          } catch (err) {
            console.error(`Error creating ingredient ${originalName}:`, err);
            setAlert(`Error creating ingredient: ${originalName}`, 'error');
            // Continue with import even if ingredient creation fails
          }
        }
      }
      
      // Transform the recipe for our database format
      const recipeToImport = {
        name: selectedRecipe.title,
        description: selectedRecipe.description || '',
        prepTime: selectedRecipe.prepTime || 0,
        cookTime: selectedRecipe.cookTime || 0,
        servings: selectedRecipe.servings || 1,
        image: selectedRecipe.image || '',
        videoUrl: selectedRecipe.videoUrl || '',
        instructions: selectedRecipe.instructions || '',
        category: 'Imported', // Default category for imported recipes
        ingredients: Object.values(ingredientMatches).map(match => {
          const originalIngredient = match.original;
          // Use the newly created ingredient ID if this was marked as "new"
          const ingredientId = match.selected === 'new' 
            ? newIngredients[originalIngredient.name] 
            : match.selected;
          
          return {
            ingredient: ingredientId, // ID of matched or newly created ingredient
            quantity: originalIngredient.quantity || 0,
            unit: originalIngredient.unit || '',
            note: originalIngredient.note || ''
          };
        }).filter(ing => ing.ingredient), // Filter out any ingredients that failed to create
        isPublic: true,
        source: selectedRecipe.source || 'Web Import',
        sourceUrl: selectedRecipe.url || ''
      };
      
      console.log('Importing recipe:', recipeToImport);
      await addRecipe(recipeToImport);
      
      setAlert('Recipe imported successfully!', 'success');
      setImportDialogOpen(false);
      setSelectedRecipe(null);
      
      // Navigate to recipes page
      navigate('/recipes');
    } catch (err) {
      console.error('Import error:', err);
      setAlert('Error importing recipe. Please try again.', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleNextStep = () => {
    setImportStep(2);
  };

  const handlePrevStep = () => {
    setImportStep(1);
  };

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Import Recipe
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Search for recipes online or batch import using CSV files.
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Search Recipes" />
          <Tab label="Batch Upload" />
          <Tab label="Manage Sources" />
        </Tabs>

        <Box p={3}>
          {activeTab === 0 ? (
            <Box>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="recipe-source-label">Recipe Source</InputLabel>
                    <Select
                      labelId="recipe-source-label"
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                      label="Recipe Source"
                    >
                      <MenuItem value="">
                        <em>All Sources</em>
                      </MenuItem>
                      {recipeSources
                        .filter(source => source.isActive)
                        .map(source => (
                          <MenuItem key={source._id} value={source._id}>
                            {source.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    label="Search for recipes"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="e.g., chocolate cake, chicken pasta"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </Grid>
              </Grid>

              {isSearching && (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              )}

              {searchError && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {searchError}
                </Alert>
              )}

              {!isSearching && searchResults.length > 0 && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Search Results
                  </Typography>
                  <Grid container spacing={3}>
                    {searchResults.map((recipe) => (
                      <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                        <Card>
                          {recipe.image && (
                            <CardMedia
                              component="img"
                              height="140"
                              image={recipe.image}
                              alt={recipe.title}
                            />
                          )}
                          <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                              {recipe.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {recipe.description
                                ? recipe.description.length > 100
                                  ? `${recipe.description.substring(0, 100)}...`
                                  : recipe.description
                                : 'No description available'}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              color="primary"
                              startIcon={<ImportExportIcon />}
                              onClick={() => handleRecipeSelect(recipe)}
                            >
                              Import
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          ) : activeTab === 1 ? (
            <Box>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  border: '1px dashed rgba(0, 0, 0, 0.12)',
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>
                      Batch Import Recipes from CSV
                    </Typography>
                    <Typography variant="body2" paragraph color="textSecondary">
                      Upload a CSV file with multiple recipes to import them all at once. 
                      Download our template to see the required format.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FileDownloadIcon />}
                        onClick={downloadCsvTemplate}
                        sx={{ mr: 2 }}
                      >
                        Download Template
                      </Button>
                      <Link 
                        href="#" 
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        onClick={(e) => {
                          e.preventDefault();
                          // Show CSV format help dialog here
                          setAlert('CSV format guidance: Each row represents one recipe. The first row should contain headers.', 'info');
                        }}
                      >
                        <HelpOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">CSV Format Help</Typography>
                      </Link>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Box 
                      sx={{ 
                        border: '1px dashed rgba(0, 0, 0, 0.23)', 
                        borderRadius: 1, 
                        p: 3, 
                        textAlign: 'center' 
                      }}
                    >
                      <input
                        accept=".csv"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="raised-button-file">
                        <Button
                          component="span"
                          variant="contained"
                          color="primary"
                          startIcon={<UploadFileIcon />}
                          fullWidth
                        >
                          Select CSV File
                        </Button>
                      </label>
                      {csvFile && (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Selected file: {csvFile.name}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Box sx={{ width: '100%', mb: 4 }}>
                <Stepper activeStep={currentStep} alternativeLabel>
                  <Step>
                    <StepLabel>Select CSV File</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Validate & Review</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Import Complete</StepLabel>
                  </Step>
                </Stepper>
              </Box>

              {csvFile && currentStep === 1 && (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Review your CSV file before importing. Make sure all required fields are properly formatted.
                  </Alert>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleFileUpload}
                      disabled={isUploading}
                      startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    >
                      {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload and Import Recipes'}
                    </Button>
                  </Box>
                </Box>
              )}

              {uploadError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {uploadError}
                </Alert>
              )}

              {currentStep === 2 && uploadedRecipes.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Successfully imported {uploadedRecipes.length} recipes.
                  </Alert>
                  
                  <Typography variant="h6" gutterBottom>
                    Imported Recipes
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Recipe Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Servings</TableCell>
                          <TableCell>Prep Time</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadedRecipes.map((recipe, index) => (
                          <TableRow key={index}>
                            <TableCell>{recipe.name}</TableCell>
                            <TableCell>{recipe.primaryCategory || recipe.category || 'N/A'}</TableCell>
                            <TableCell>{recipe.servings || 'N/A'}</TableCell>
                            <TableCell>{recipe.prepTime ? `${recipe.prepTime} min` : 'N/A'}</TableCell>
                            <TableCell>
                              <Chip 
                                label="Imported" 
                                color="success" 
                                size="small" 
                                icon={<CheckCircleIcon />} 
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/recipes')}
                    >
                      Go to Recipes
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <RecipeSourceList />
          )}
        </Box>
      </Paper>

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => !isImporting && setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {importStep === 1 ? 'Recipe Preview' : 'Match Ingredients'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRecipe && (
            <>
              {importStep === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {selectedRecipe.title}
                  </Typography>
                  
                  {selectedRecipe.image && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img
                        src={selectedRecipe.image}
                        alt={selectedRecipe.title}
                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                      />
                    </Box>
                  )}
                  
                  {selectedRecipe.description && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Description:</Typography>
                      <Typography variant="body1">{selectedRecipe.description}</Typography>
                    </Box>
                  )}
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {selectedRecipe.prepTime && (
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Prep Time:</Typography>
                        <Typography variant="body2">{selectedRecipe.prepTime} mins</Typography>
                      </Grid>
                    )}
                    {selectedRecipe.cookTime && (
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Cook Time:</Typography>
                        <Typography variant="body2">{selectedRecipe.cookTime} mins</Typography>
                      </Grid>
                    )}
                    {selectedRecipe.servings && (
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Servings:</Typography>
                        <Typography variant="body2">{selectedRecipe.servings}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Ingredients:</Typography>
                    <List dense>
                      {selectedRecipe.ingredients.map((ing, idx) => (
                        <ListItem key={idx}>
                          <ListItemText 
                            primary={`${ing.quantity || ''} ${ing.unit || ''} ${ing.name}`}
                            secondary={ing.note}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Instructions:</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {selectedRecipe.instructions}
                    </Typography>
                  </Box>
                  
                  {selectedRecipe.source && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Source:</Typography>
                      <Typography variant="body2">{selectedRecipe.source}</Typography>
                    </Box>
                  )}
                </Box>
              )}
              
              {importStep === 2 && (
                <Box>
                  <Typography variant="body1" paragraph>
                    Match the imported ingredients with ingredients in your database.
                    For each ingredient, select the best match or create a new ingredient.
                  </Typography>
                  
                  {Object.entries(ingredientMatches).map(([originalName, match]) => (
                    <Paper key={originalName} sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {match.original.quantity} {match.original.unit} {originalName}
                        </Typography>
                        {match.selected && (
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Matched" 
                            color="success" 
                            size="small" 
                          />
                        )}
                      </Box>
                      
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <InputLabel>Select Matching Ingredient</InputLabel>
                        <Select
                          value={match.selected || ''}
                          onChange={(e) => handleIngredientMatch(originalName, e.target.value)}
                          label="Select Matching Ingredient"
                        >
                          {match.potentialMatches.length > 0 ? (
                            match.potentialMatches.map((ing) => (
                              <MenuItem key={ing._id} value={ing._id}>
                                {ing.name} ({ing.unitType})
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled value="">
                              No matches found
                            </MenuItem>
                          )}
                          <MenuItem value="new">
                            <em>+ Create New Ingredient</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                      
                      {match.selected === 'new' && (
                        <Alert severity="info" sx={{ mt: 1 }}>
                          A new ingredient will be created during import.
                        </Alert>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {importStep === 1 ? (
            <>
              <Button onClick={() => setImportDialogOpen(false)} disabled={isImporting}>
                Cancel
              </Button>
              <Button onClick={handleNextStep} variant="contained" disabled={isImporting}>
                Next: Match Ingredients
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handlePrevStep} disabled={isImporting}>
                Back
              </Button>
              <Button
                onClick={handleImportRecipe}
                variant="contained"
                color="primary"
                disabled={isImporting}
                startIcon={isImporting ? <CircularProgress size={20} /> : <ImportExportIcon />}
              >
                {isImporting ? 'Importing...' : 'Import Recipe'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecipeImport; 