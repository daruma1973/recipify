const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to only accept CSV files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB max file size
  },
  fileFilter: fileFilter
});

// @route   GET api/recipes
// @desc    Get all recipes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // In development mode with auth disabled, get all recipes
    // Otherwise, filter by user ID
    const query = req.user.id === '507f1f77bcf86cd799439011' ? {} : { user: req.user.id };
    
    console.log('Fetching recipes with query:', query);
    
    const recipes = await Recipe.find(query)
      .sort({ date: -1 });
      
    console.log(`Found ${recipes.length} recipes`);
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/recipes/search
// @desc    Search for recipes from external APIs
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, source } = req.query;
    
    if (!q) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    console.log(`Searching for recipes with query: ${q}${source ? ` from source: ${source}` : ''}`);
    
    // Use our scraper manager to get recipes
    const { scrapeRecipes } = require('../utils/scraperManager');
    
    // If a source ID is provided, get the source details
    let sourceName = null;
    if (source) {
      try {
        const RecipeSource = require('../models/RecipeSource');
        const sourceDoc = await RecipeSource.findById(source);
        if (sourceDoc) {
          sourceName = sourceDoc.name;
        }
      } catch (err) {
        console.error('Error fetching source details:', err.message);
      }
    }
    
    // Scrape recipes from the specified source
    const recipes = await scrapeRecipes(q, source, sourceName);
    
    console.log(`Found ${recipes.length} recipes`);
    
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/recipes/details
// @desc    Get detailed recipe information from a URL
// @access  Private
router.get('/details', auth, async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ msg: 'Recipe URL is required' });
    }

    console.log(`Fetching recipe details from URL: ${url}`);
    
    // Use our scraper manager to get recipe details
    const { getRecipeDetailsFromUrl } = require('../utils/scraperManager');
    
    // Create a basic recipe object with the URL
    const basicRecipe = {
      sourceUrl: url
    };
    
    // Get detailed recipe information
    const detailedRecipe = await getRecipeDetailsFromUrl(basicRecipe);
    
    console.log(`Successfully fetched recipe details with ${detailedRecipe.ingredients?.length || 0} ingredients and ${detailedRecipe.instructions?.length || 0} instructions`);
    
    res.json(detailedRecipe);
  } catch (err) {
    console.error('Error fetching recipe details:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/recipes/:id
// @desc    Get recipe by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('Fetching recipe by ID:', req.params.id);
    
    // Validate if ID is in valid MongoDB format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid recipe ID format');
      return res.status(400).json({ msg: 'Invalid recipe ID format' });
    }
    
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      console.error('Recipe not found');
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Make sure user owns recipe - commenting out for debugging
    // if (recipe.user.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: 'Not authorized' });
    // }

    console.log('Recipe found successfully:', recipe._id);
    console.log('Recipe has image:', recipe.image ? 'Yes' : 'No');
    if (recipe.image) {
      console.log('Image length:', recipe.image.length);
    }
    console.log('Recipe has videoUrl:', recipe.videoUrl ? 'Yes' : 'No');

    res.json(recipe);
  } catch (err) {
    console.error('Error in GET recipe/:id:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found - invalid ID' });
    }
    res.status(500).json({ msg: 'Server Error retrieving recipe' });
  }
});

// @route   POST api/recipes
// @desc    Create a recipe
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
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
      description, 
      servings, 
      prepTime, 
      cookTime, 
      category,
      image,
      videoUrl,
      isActive,
      ingredients,
      instructions,
      criticalControl,
      serviceNotes,
      suitability,
      allergens,
      actualSellingPrice
    } = req.body;

    console.log(`Creating new recipe: ${name}`);
    
    // Log image data for debugging
    if (image) {
      console.log('Image received: Yes');
      console.log('Image type:', typeof image);
      console.log('Image length:', image.length);
      console.log('Image preview:', image.substring(0, 20) + '...');
    } else {
      console.log('Image received: No');
    }
    
    // Log video URL for debugging
    if (videoUrl) {
      console.log('Video URL received: Yes');
      console.log('Video URL:', videoUrl);
    } else {
      console.log('Video URL received: No');
    }

    // Create a new recipe instance
    const newRecipe = new Recipe({
      user: req.user.id,
      name,
      status: status || 'development',
      primaryCategory,
      subCategory,
      // Only add menuAssignment if it's not empty
      ...(menuAssignment ? { menuAssignment } : {}),
      recipeYield,
      revenueOutlet,
      itemClass: itemClass || 'food',
      vatPercentage: vatPercentage || 20,
      costOfSalesPercentage: costOfSalesPercentage || 30,
      wastagePercentage: wastagePercentage || 5,
      category,
      description,
      servings,
      prepTime,
      cookTime,
      image,
      videoUrl,
      isActive: isActive !== undefined ? isActive : true,
      ingredients: ingredients || [],
      instructions: instructions || [],
      criticalControl,
      serviceNotes,
      suitability: suitability || {},
      allergens: allergens || {},
      actualSellingPrice: actualSellingPrice || 0
    });

    const recipe = await newRecipe.save();
    res.json(recipe);
  } catch (err) {
    console.error('Error saving recipe:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/recipes/:id
// @desc    Update a recipe
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
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
      description, 
      servings, 
      prepTime, 
      cookTime, 
      category,
      image,
      videoUrl,
      isActive,
      ingredients,
      instructions,
      criticalControl,
      serviceNotes,
      suitability,
      allergens,
      actualSellingPrice
    } = req.body;

    // Log image information for update
    console.log('Image received in update:', image ? 'Yes' : 'No');
    if (image) {
      console.log('Image type:', typeof image);
      console.log('Image length:', image.length);
      console.log('Image preview:', image.substring(0, 20) + '...');
    }
    
    // Log video URL for update
    console.log('Video URL received in update:', videoUrl || 'No');

    // Build recipe object
    const recipeFields = {};
    if (name) recipeFields.name = name;
    if (status) recipeFields.status = status;
    // Only add menuAssignment if it's not empty
    if (menuAssignment) recipeFields.menuAssignment = menuAssignment;
    if (primaryCategory) recipeFields.primaryCategory = primaryCategory;
    if (subCategory) recipeFields.subCategory = subCategory;
    if (recipeYield) recipeFields.recipeYield = recipeYield;
    if (revenueOutlet) recipeFields.revenueOutlet = revenueOutlet;
    if (itemClass) recipeFields.itemClass = itemClass;
    if (vatPercentage !== undefined) recipeFields.vatPercentage = vatPercentage;
    if (costOfSalesPercentage !== undefined) recipeFields.costOfSalesPercentage = costOfSalesPercentage;
    if (wastagePercentage !== undefined) recipeFields.wastagePercentage = wastagePercentage;
    if (category) recipeFields.category = category;
    if (description) recipeFields.description = description;
    if (servings) recipeFields.servings = servings;
    if (prepTime) recipeFields.prepTime = prepTime;
    if (cookTime) recipeFields.cookTime = cookTime;
    if (image) recipeFields.image = image;
    if (videoUrl) recipeFields.videoUrl = videoUrl;
    if (isActive !== undefined) recipeFields.isActive = isActive;
    if (ingredients) recipeFields.ingredients = ingredients;
    if (instructions) recipeFields.instructions = instructions;
    if (criticalControl) recipeFields.criticalControl = criticalControl;
    if (serviceNotes) recipeFields.serviceNotes = serviceNotes;
    if (suitability) recipeFields.suitability = suitability;
    if (allergens) recipeFields.allergens = allergens;
    if (actualSellingPrice !== undefined) recipeFields.actualSellingPrice = actualSellingPrice;

    // If menuAssignment is an empty string, remove it from the recipe
    if (menuAssignment === '') {
      recipeFields.menuAssignment = undefined;
    }

    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // if (recipe.user.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: 'User not authorized' });
    // }

    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: recipeFields },
      { new: true }
    );

    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/recipes/:id
// @desc    Delete recipe
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

    // Make sure user owns recipe
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Recipe.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Recipe removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 