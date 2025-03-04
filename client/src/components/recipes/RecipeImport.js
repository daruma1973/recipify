import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Stepper,
  Stack,
  LinearProgress,
  InputAdornment
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
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useDropzone } from 'react-dropzone';
import AuthContext from '../../context/auth/authContext';
import RecipeContext from '../../context/recipe/recipeContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';
import RecipeSourceContext from '../../context/recipeSource/recipeSourceContext';
import RecipeSourceList from './RecipeSourceList';
import axios from 'axios';
import { downloadCsvTemplate, uploadBatchRecipes, processRecipeImage } from '../../api/recipeApi';
import { PhotoCamera, Save } from '@mui/icons-material';
import { Add } from '@mui/icons-material';
import { DeleteOutline } from '@mui/icons-material';
import { ArrowBack } from '@mui/icons-material';
import { CloudUpload } from '@mui/icons-material';

const RecipeImport = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Add new state variables for OCR functionality
  const [ocrImageFile, setOcrImageFile] = useState(null);
  const [ocrImagePreview, setOcrImagePreview] = useState(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrProgress, setOcrProgress] = useState({ step: 'complete', percent: 100 });
  const [ocrExtractedText, setOcrExtractedText] = useState('');
  const [ocrRecipeData, setOcrRecipeData] = useState(null);
  const [importMethod, setImportMethod] = useState('csv'); // 'csv', 'ocr', or 'search'
  const [statusAlert, setStatusAlert] = useState(null);
  const [isSavingRecipe, setIsSavingRecipe] = useState(false);

  // Parse query parameters from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    
    // Set the initial import method based on URL query parameter
    if (tabParam === 'ocr') {
      setImportMethod('ocr');
    } else if (tabParam === 'search') {
      setImportMethod('search');
    } else if (tabParam === 'csv') {
      setImportMethod('csv');
    }
  }, [location.search]);

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

  // Handle file change for CSV uploads
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

  // Handle CSV file upload
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
        setUploadedRecipes(response.recipes || []);
        setCurrentStep(2);
        setAlert(`Successfully imported ${response.recipes?.length || 0} recipes`, 'success');
      } else {
        // Special handling for server connection issues
        if (response.serverDown) {
          setUploadError('Server connection error: Please make sure the backend server is running.');
          setAlert('Server connection error: Please make sure the backend server is running.', 'error');
        } else {
          setUploadError(response.message || 'Error uploading recipes');
          setAlert('Error uploading recipes. Please check your CSV file format.', 'error');
        }
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      setUploadError(error.response?.data?.message || 'Server error during upload');
      setAlert('Error uploading recipes. Please check your CSV file format.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Dropzone for image uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setOcrImageFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setOcrImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        // Reset OCR states
        setOcrExtractedText('');
        setOcrRecipeData(null);
        setCurrentStep(1);
      }
    }
  });

  // Handle OCR image change
  const handleOcrImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('OCR image selected:', file.name);
      setOcrImageFile(file);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setOcrImagePreview(previewUrl);
      
      // Reset OCR results
      setOcrExtractedText('');
      if (ocrRecipeData) {
        setOcrRecipeData({
          name: '',
          description: '',
          notes: '',
          ingredients: [],
          instructions: []
        });
      }
      
      // Reset current step
      setCurrentStep(0);
    }
  };

  // Function to handle OCR image upload and processing
  const handleOcrProcess = async () => {
    if (!ocrImageFile) {
      setStatusAlert({
        type: 'error',
        message: 'Please select an image to process',
      });
      return;
    }

    setStatusAlert(null);
    setIsProcessingOcr(true);
    setOcrProgress({
      step: 'uploading',
      percent: 0,
    });

    try {
      console.log('Starting OCR processing of image:', ocrImageFile.name);
      
      // Show initial upload message
      setStatusAlert({
        type: 'info',
        message: 'Uploading and processing image. This may take up to 2 minutes for complex images...',
      });
      
      // Update progress to uploading
      setOcrProgress({
        step: 'uploading',
        percent: 25,
      });
      
      const response = await processRecipeImage(ocrImageFile, (event) => {
        // Handle upload progress
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setOcrProgress({
            step: 'uploading',
            percent: Math.min(percent, 90), // Cap at 90% until processing is complete
          });
        }
      });

      console.log('OCR response received:', response);

      // Update progress to processing complete
      setOcrProgress({
        step: 'processing',
        percent: 100,
      });

      if (response) {
        if (response.success) {
          // Set the extracted text and recipe data
          setOcrExtractedText(response.extractedText || '');
          
          // Set image URL
          if (response.imageUrl) {
            console.log('Setting uploaded image URL:', response.imageUrl);
            setOcrImagePreview(`${window.location.origin}${response.imageUrl}`);
          }
          
          // Set recipe data and move to next step
          if (response.recipe) {
            console.log('Setting OCR recipe data:', response.recipe);
            setOcrRecipeData({
              name: response.recipe.name || '',
              description: response.recipe.description || '',
              notes: response.recipe.notes || '',
              ingredients: response.recipe.ingredients || [],
              instructions: response.recipe.instructions || [],
            });
            
            // Move to review step
            setCurrentStep(1);
            
            // Set appropriate alert based on if text was extracted
            if (response.extractedText && response.extractedText.length > 0) {
              setStatusAlert({
                type: 'success',
                message: 'Image processed successfully. Please review the extracted recipe.'
              });
            } else {
              setStatusAlert({
                type: 'warning',
                message: 'Image processed, but no text was extracted. Please try a clearer image or enter details manually.'
              });
            }
          } else {
            console.log('No recipe data in response');
            setOcrRecipeData({
              name: '',
              description: '',
              notes: '',
              ingredients: [],
              instructions: [],
            });
            
            setStatusAlert({
              type: 'warning',
              message: 'Image was processed but no recipe structure could be identified. Please enter recipe details manually.'
            });
          }
        } else {
          // Handle error response
          console.error('Server returned error:', response.error);
          setStatusAlert({
            type: 'error',
            message: response.message || 'Failed to process image. Please try again.'
          });
        }
      } else {
        console.error('Empty response from server');
        setStatusAlert({
          type: 'error',
          message: 'No response received from server. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error during OCR processing:', error);
      setStatusAlert({
        type: 'error',
        message: error.message || 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsProcessingOcr(false);
      setOcrProgress({
        step: 'complete',
        percent: 100,
      });
    }
  };

  // Function to handle saving an OCR recipe
  const handleSaveOcrRecipe = async () => {
    if (!ocrRecipeData || !ocrRecipeData.name) {
      setStatusAlert({
        type: 'error',
        message: 'Please provide a recipe name before saving',
      });
      return;
    }
    
    setIsSavingRecipe(true);
    setStatusAlert({
      type: 'info',
      message: 'Saving recipe...',
    });
    
    try {
      // Format recipe data for API
      const recipeData = {
        name: ocrRecipeData.name,
        description: ocrRecipeData.description || '',
        notes: ocrRecipeData.notes || '',
        primaryCategory: ocrRecipeData.primaryCategory || 'Other', // Add primary category
        servings: ocrRecipeData.servings || 1,
        prepTime: ocrRecipeData.prepTime || 0,
        cookTime: ocrRecipeData.cookTime || 0,
        ingredients: ocrRecipeData.ingredients.map(ingredient => {
          // Check if ingredient is already an object
          if (typeof ingredient === 'object' && ingredient !== null) {
            return {
              name: ingredient.name || '',
              quantity: ingredient.quantity || '',
              unit: ingredient.unit || '',
            };
          }
          
          // Otherwise, it's a string, so parse it
          return {
            name: ingredient,
            quantity: '', // Default empty as we don't parse quantities separately
            unit: '',     // Default empty as we don't parse units separately
          };
        }),
        instructions: ocrRecipeData.instructions.map(instruction => {
          // Check if instruction is already an object
          if (typeof instruction === 'object' && instruction !== null && instruction.step) {
            return instruction.step;
          }
          
          // Otherwise return the string
          return instruction;
        }),
      };
      
      console.log('Saving OCR recipe:', recipeData);
      
      // Send POST request to create recipe
      const response = await axios.post('/api/recipes', recipeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Recipe saved successfully:', response.data);
      
      // Show success message and set step to 2
      setStatusAlert({
        type: 'success',
        message: 'Recipe saved successfully!',
      });
      
      // Set current step to 2 (Success)
      setCurrentStep(2);
      
      // Navigate to recipe detail page after a delay
      setTimeout(() => {
        window.location.href = `/recipes/${response.data._id}`;
      }, 2000);
      
    } catch (error) {
      console.error('Error saving recipe:', error);
      
      setStatusAlert({
        type: 'error',
        message: error.response?.data?.msg || 'Error saving recipe. Please try again.',
      });
    } finally {
      setIsSavingRecipe(false);
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

  // Handle import method change
  const handleImportMethodChange = (event, newValue) => {
    setImportMethod(newValue);
    // Reset states
    setCsvFile(null);
    setOcrImageFile(null);
    setOcrImagePreview(null);
    setSearchQuery('');
    setCurrentStep(0);
    setUploadedRecipes([]);
    setSearchResults([]);
    setOcrExtractedText('');
    setOcrRecipeData(null);
    
    // Update URL without reloading the page
    const url = new URL(window.location);
    url.searchParams.set('tab', newValue);
    window.history.pushState({}, '', url);
  };

  const renderOcrStep = () => {
    return (
      <Box p={2}>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Extract Recipe from Image
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Upload a clear, well-lit photo of a printed recipe. For best results, ensure the image has good 
            contrast and minimal background noise. The system will attempt to identify the recipe name, 
            ingredients, and instructions.
          </Typography>
        </Box>
        
        {/* Image Upload Section */}
        <Box 
          border={1} 
          borderRadius={1} 
          borderColor="grey.300" 
          p={3} 
          mb={3}
          display="flex" 
          flexDirection="column" 
          alignItems="center"
        >
          <input
            type="file"
            accept="image/*"
            id="ocr-image-upload"
            onChange={handleOcrImageChange}
            style={{ display: 'none' }}
          />
          
          {ocrImagePreview ? (
            <Box width="100%" mb={2} textAlign="center">
              <img 
                src={ocrImagePreview} 
                alt="Recipe to process" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  objectFit: 'contain',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f8f8f8'
                }} 
              />
              <Box mt={1}>
                <Typography variant="caption" color="textSecondary">
                  {ocrImageFile?.name || 'Uploaded image'}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box 
              display="flex" 
              flexDirection="column"
              alignItems="center" 
              justifyContent="center"
              bgcolor="#f8f8f8"
              height="200px"
              width="100%"
              border={1}
              borderStyle="dashed"
              borderColor="grey.400"
              borderRadius={1}
              mb={2}
            >
              <PhotoCamera fontSize="large" color="action" />
              <Typography variant="body2" color="textSecondary" align="center" mt={1}>
                Click to select or drag an image here
              </Typography>
            </Box>
          )}
          
          <Box display="flex" justifyContent="center" width="100%">
            <label htmlFor="ocr-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                disabled={isProcessingOcr}
                sx={{ mr: 1 }}
              >
                {ocrImageFile ? 'Change Image' : 'Select Image'}
              </Button>
            </label>
            
            {ocrImageFile && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOcrProcess}
                disabled={isProcessingOcr}
                startIcon={<CloudUpload />}
              >
                Process Image
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Processing Status */}
        {isProcessingOcr && (
          <Box 
            border={1} 
            borderRadius={1} 
            borderColor="primary.light" 
            bgcolor="primary.50" 
            p={2} 
            mb={3}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" fontWeight="medium">
                {ocrProgress.step === 'uploading' 
                  ? 'Uploading image...' 
                  : 'Processing image with OCR...'}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={ocrProgress.percent} 
              sx={{ mb: 1, height: 8, borderRadius: 2 }} 
            />
            <Typography variant="caption" color="textSecondary">
              {ocrProgress.step === 'uploading' 
                ? 'Uploading your image to the server...' 
                : 'Reading text from your image using OCR technology...'}
            </Typography>
          </Box>
        )}
        
        {statusAlert && (
          <Alert 
            severity={statusAlert.type} 
            sx={{ mb: 3 }}
          >
            {statusAlert.message}
          </Alert>
        )}
      </Box>
    );
  };

  const renderReviewStep = () => {
    return (
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Review Recipe
        </Typography>
        
        {ocrImagePreview && (
          <Box mb={3} display="flex" justifyContent="center">
            <img 
              src={ocrImagePreview} 
              alt="Uploaded recipe" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '250px', 
                objectFit: 'contain',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }} 
            />
          </Box>
        )}
        
        <Box mb={4}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Extracted Raw Text
          </Typography>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              maxHeight: '200px', 
              overflow: 'auto',
              backgroundColor: '#f9f9f9',
              fontFamily: 'monospace',
              fontSize: '0.85rem'
            }}
          >
            {ocrExtractedText ? (
              ocrExtractedText
            ) : (
              <Typography color="text.secondary" fontStyle="italic">
                No text extracted
              </Typography>
            )}
          </Paper>
        </Box>
        
        {/* Recipe Data Form */}
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom color="primary" fontWeight="medium">
            Recipe Details
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Review and edit the extracted recipe details below:
          </Typography>
          
          <TextField
            label="Recipe Name"
            value={ocrRecipeData.name}
            onChange={(e) => setOcrRecipeData({ ...ocrRecipeData, name: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            label="Description"
            value={ocrRecipeData.description}
            onChange={(e) => setOcrRecipeData({ ...ocrRecipeData, description: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
          />
          
          <Typography variant="subtitle2" gutterBottom mt={2}>
            Ingredients
          </Typography>
          
          {ocrRecipeData.ingredients.length > 0 ? (
            ocrRecipeData.ingredients.map((ingredient, index) => (
              <TextField
                key={index}
                label={`Ingredient ${index + 1}`}
                value={ingredient}
                onChange={(e) => {
                  const updatedIngredients = [...ocrRecipeData.ingredients];
                  updatedIngredients[index] = e.target.value;
                  setOcrRecipeData({ ...ocrRecipeData, ingredients: updatedIngredients });
                }}
                fullWidth
                margin="dense"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          const updatedIngredients = [...ocrRecipeData.ingredients];
                          updatedIngredients.splice(index, 1);
                          setOcrRecipeData({ ...ocrRecipeData, ingredients: updatedIngredients });
                        }}
                        edge="end"
                      >
                        <DeleteOutline />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ))
          ) : (
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1, mb: 2 }}>
              No ingredients detected
            </Typography>
          )}
          
          <Button
            startIcon={<Add />}
            onClick={() => {
              setOcrRecipeData({
                ...ocrRecipeData,
                ingredients: [...ocrRecipeData.ingredients, ''],
              });
            }}
            size="small"
            sx={{ mt: 1 }}
          >
            Add Ingredient
          </Button>
          
          <Typography variant="subtitle2" gutterBottom mt={3}>
            Instructions
          </Typography>
          
          {ocrRecipeData.instructions.length > 0 ? (
            ocrRecipeData.instructions.map((instruction, index) => (
              <TextField
                key={index}
                label={`Step ${index + 1}`}
                value={instruction}
                onChange={(e) => {
                  const updatedInstructions = [...ocrRecipeData.instructions];
                  updatedInstructions[index] = e.target.value;
                  setOcrRecipeData({ ...ocrRecipeData, instructions: updatedInstructions });
                }}
                fullWidth
                margin="dense"
                variant="outlined"
                multiline
                rows={2}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          const updatedInstructions = [...ocrRecipeData.instructions];
                          updatedInstructions.splice(index, 1);
                          setOcrRecipeData({ ...ocrRecipeData, instructions: updatedInstructions });
                        }}
                        edge="end"
                      >
                        <DeleteOutline />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ))
          ) : (
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1, mb: 2 }}>
              No instructions detected
            </Typography>
          )}
          
          <Button
            startIcon={<Add />}
            onClick={() => {
              setOcrRecipeData({
                ...ocrRecipeData,
                instructions: [...ocrRecipeData.instructions, ''],
              });
            }}
            size="small"
            sx={{ mt: 1 }}
          >
            Add Instruction
          </Button>
          
          <TextField
            label="Notes"
            value={ocrRecipeData.notes}
            onChange={(e) => setOcrRecipeData({ ...ocrRecipeData, notes: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
            sx={{ mt: 3 }}
          />
        </Box>
        
        {/* Navigation Buttons */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            onClick={() => setCurrentStep(0)}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveOcrRecipe}
            disabled={!ocrRecipeData.name || isSavingRecipe}
            endIcon={isSavingRecipe ? <CircularProgress size={20} /> : <Save />}
          >
            Save Recipe
          </Button>
        </Box>
      </Box>
    );
  };

  // Render a success message for the final step
  const renderSuccessStep = () => {
    return (
      <Box p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" gutterBottom align="center">
          Recipe Saved Successfully!
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Your recipe has been added to your collection. Redirecting to view it...
        </Typography>
        <CircularProgress size={24} sx={{ mt: 1 }} />
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/recipes')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Import Recipes
          </Typography>
        </Box>

        <Tabs 
          value={importMethod} 
          onChange={handleImportMethodChange} 
          sx={{ mb: 3 }}
          variant="fullWidth"
        >
          <Tab value="csv" label="CSV Import" icon={<UploadFileIcon />} />
          <Tab value="ocr" label="Image OCR" icon={<PhotoCameraIcon />} />
          <Tab value="search" label="Search Online" icon={<SearchIcon />} />
        </Tabs>

        {importMethod === 'csv' && (
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
        )}

        {importMethod === 'ocr' && (
          <>
            <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Upload Image</StepLabel>
              </Step>
              <Step>
                <StepLabel>Review Recipe</StepLabel>
              </Step>
              <Step>
                <StepLabel>Complete</StepLabel>
              </Step>
            </Stepper>
            
            {currentStep === 0 && renderOcrStep()}
            {currentStep === 1 && ocrRecipeData && renderReviewStep()}
            {currentStep === 2 && renderSuccessStep()}
          </>
        )}

        {importMethod === 'search' && (
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
        )}
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