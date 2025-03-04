const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const Ingredient = require('../models/Ingredient');
const Supplier = require('../models/Supplier');
const Tesseract = require('tesseract.js');

// Try to load Sharp, but make it optional
let sharp;
try {
  sharp = require('sharp');
  console.log('Sharp library loaded successfully for image preprocessing');
} catch (err) {
  console.warn('Warning: Sharp library not available. OCR will work without image preprocessing:', err.message);
  sharp = null;
}

// Set up multer storage
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

// File filter
const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split('/')[0];
  // Accept csv, excel files, and images
  if (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.ms-excel' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    (fileType === 'image' && ['jpeg', 'png', 'jpg'].includes(file.mimetype.split('/')[1]))
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV, Excel files, and images (JPEG, PNG) are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB max file size
  },
  fileFilter: fileFilter
});

// @route   POST api/import/ingredients
// @desc    Import ingredients from CSV
// @access  Private
router.post('/ingredients', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file' });
    }

    const results = [];
    const errors = [];

    // Process CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        // Return the parsed data
        res.json({
          success: true,
          data: results,
          errors: errors.length > 0 ? errors : null
        });
      })
      .on('error', (err) => {
        console.error('Error parsing CSV:', err);
        res.status(500).json({ msg: 'Error parsing CSV file' });
      });
  } catch (err) {
    console.error('Import error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/import/suppliers
// @desc    Import suppliers from CSV
// @access  Private
router.post('/suppliers', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file' });
    }

    const results = [];
    const errors = [];

    // Process CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        // Return the parsed data
        res.json({
          success: true,
          data: results,
          errors: errors.length > 0 ? errors : null
        });
      })
      .on('error', (err) => {
        console.error('Error parsing CSV:', err);
        res.status(500).json({ msg: 'Error parsing CSV file' });
      });
  } catch (err) {
    console.error('Import error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/import/ocr
// @desc    Process image using OCR to extract recipe
// @access  Private
router.post('/ocr', upload.single('image'), async (req, res) => {
  console.log('OCR request received');
  
  try {
    // Check if a file was uploaded
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded',
        message: 'Please upload an image file' 
      });
    }
    
    console.log(`File uploaded: ${req.file.originalname}, size: ${req.file.size} bytes, mimetype: ${req.file.mimetype}`);
    
    // Verify file is an image
    if (!req.file.mimetype.startsWith('image/')) {
      console.log(`Invalid file type: ${req.file.mimetype}`);
      // Clean up the uploaded file
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error removing invalid file:', err);
      }
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid file type',
        message: 'Please upload an image file (JPG, PNG)'
      });
    }
    
    // Get the path to the uploaded file
    const imagePath = req.file.path;
    console.log(`Processing image at path: ${imagePath}`);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`File not found at path: ${imagePath}`);
      return res.status(500).json({ 
        success: false, 
        error: 'File upload failed',
        message: 'File upload failed - file not found' 
      });
    }
    
    // Get file stats
    const stats = fs.statSync(imagePath);
    console.log(`File size on disk: ${stats.size} bytes`);
    
    let processedImagePath = imagePath;
    
    // Try to preprocess the image with Sharp if available
    let sharpWorking = false;
    try {
      if (sharp) {
        console.log('Testing Sharp functionality...');
        // Test if sharp is actually working with a simple operation
        await sharp(Buffer.from([0, 0, 0])).resize(1).toBuffer();
        sharpWorking = true;
        console.log('Sharp is working properly');
      }
    } catch (sharpTestError) {
      console.error('Sharp library test failed:', sharpTestError);
      sharpWorking = false;
    }
    
    // Preprocess the image if Sharp is available and working
    if (sharpWorking) {
      try {
        console.log('Using Sharp to preprocess the image');
        const outputPath = path.join(path.dirname(imagePath), `processed_${path.basename(imagePath)}`);
        
        await sharp(imagePath)
          .resize({
            width: 1800,
            height: 2400,
            fit: 'inside',
            withoutEnlargement: true
          })
          .sharpen()
          .normalize()
          .toFile(outputPath);
        
        processedImagePath = outputPath;
        console.log(`Image preprocessed and saved to: ${processedImagePath}`);
        
        // Verify the processed file exists and has content
        if (fs.existsSync(processedImagePath)) {
          const processedStats = fs.statSync(processedImagePath);
          console.log(`Processed file size: ${processedStats.size} bytes`);
          if (processedStats.size === 0) {
            console.log('Warning: Processed file is empty, falling back to original image');
            processedImagePath = imagePath;
          }
        } else {
          console.log('Warning: Processed file does not exist, falling back to original image');
          processedImagePath = imagePath;
        }
      } catch (sharpError) {
        console.error('Error during image preprocessing:', sharpError);
        console.log('Falling back to original image without preprocessing');
        processedImagePath = imagePath;
      }
    } else {
      console.log('Sharp library not available/working, skipping image preprocessing');
    }
    
    console.log('Starting Tesseract OCR processing...');
    
    try {
      // Create a relative URL for the uploaded image
      const imageUrl = `/uploads/${path.basename(imagePath)}`;
      console.log(`Image will be accessible at: ${imageUrl}`);
      
      // Use Tesseract.js to extract text from the image
      const result = await Tesseract.recognize(
        processedImagePath,
        'eng', // English language
        { 
          logger: info => {
            console.log(`OCR progress: ${info.status} (${Math.floor(info.progress * 100)}%)`);
          }
        }
      );
      
      // Check if text was extracted
      const extractedText = result.data.text.trim();
      console.log(`Text extraction complete. Extracted ${extractedText.length} characters.`);
      
      if (extractedText.length === 0) {
        console.log('No text extracted from the image');
        return res.status(200).json({
          success: true,
          imageUrl: imageUrl,
          extractedText: '',
          recipe: {
            name: '',
            ingredients: [],
            instructions: []
          },
          message: 'No text could be extracted from the image. Please try a clearer image or manually enter the recipe details.'
        });
      }
      
      console.log('Sample of extracted text:', extractedText.substring(0, 100) + '...');
      
      // Parse the extracted text to identify recipe components
      const parsedRecipe = parseRecipeFromText(extractedText);
      
      // Clean up temporary files
      try {
        if (processedImagePath !== imagePath && fs.existsSync(processedImagePath)) {
          fs.unlinkSync(processedImagePath);
          console.log(`Deleted processed image: ${processedImagePath}`);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up temporary files:', cleanupError);
      }
      
      // Format recipe data for client display
      // Ensure ingredients and instructions are properly formatted as strings
      const formattedRecipe = {
        name: parsedRecipe.name || '',
        description: parsedRecipe.description || '',
        notes: parsedRecipe.notes || '',
        primaryCategory: parsedRecipe.primaryCategory || 'Other',
        servings: parsedRecipe.servings || 1,
        prepTime: parsedRecipe.prepTime || 0,
        cookTime: parsedRecipe.cookTime || 0,
        
        // Make sure these are strings, not objects
        ingredients: parsedRecipe.ingredients.map(item => {
          // If it's already a string, return it
          if (typeof item === 'string') return item;
          // If it's an object with a specific structure, format it
          if (item && typeof item === 'object') {
            if (item.name) {
              return `${item.quantity || ''} ${item.unit || ''} ${item.name}`.trim();
            }
          }
          // Fallback: convert to string
          return String(item);
        }),
        
        // Make sure these are strings, not objects
        instructions: parsedRecipe.instructions.map(item => {
          // If it's already a string, return it
          if (typeof item === 'string') return item;
          // If it's an object with step property, extract it
          if (item && typeof item === 'object' && item.step) {
            return item.step;
          }
          // Fallback: convert to string
          return String(item);
        })
      };
      
      console.log('Formatted recipe data:', JSON.stringify(formattedRecipe, null, 2));
      
      // Return the extracted recipe data
      return res.json({
        success: true,
        imageUrl: imageUrl,
        extractedText,
        recipe: formattedRecipe
      });
    } catch (tesseractError) {
      console.error('Tesseract OCR error:', tesseractError);
      return res.status(500).json({ 
        success: false, 
        error: 'OCR processing failed',
        message: 'Failed to process image text. Please try another image or manually enter recipe details.',
        details: tesseractError.message
      });
    }
  } catch (error) {
    console.error('OCR processing error:', error);
    
    // Clean up the uploaded file if it exists
    try {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log(`Cleaned up uploaded file after error: ${req.file.path}`);
      }
    } catch (cleanupError) {
      console.error('Error during file cleanup:', cleanupError);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'OCR processing failed', 
      message: 'Failed to process image. Please try again or manually enter the recipe.',
      details: error.message
    });
  }
});

// Function to parse recipe data from extracted text
function parseRecipeFromText(text) {
  console.log('Starting recipe text parsing...');
  
  // Split text into lines
  const lines = text.split('\n').filter(line => line.trim() !== '');
  console.log(`Found ${lines.length} non-empty lines of text`);
  
  // Basic recipe structure
  const recipe = {
    name: '',
    description: '',
    ingredients: [],
    instructions: [],
    notes: '',
    primaryCategory: 'Other', // Default category to satisfy database requirements
    servings: 1, // Default value
    prepTime: 0, // Default value
    cookTime: 0 // Default value
  };
  
  // Attempt to identify recipe components
  
  // First line is typically the recipe title, but check for common header text to skip
  let titleIndex = 0;
  const skipTitles = ['allrecipes', 'recipe', 'food.com', 'cooking', 'kitchen', 'www.', 'http', 'recipe from'];
  
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].toLowerCase().trim();
    let skipThis = false;
    
    // Check if this line should be skipped (website name, etc.)
    for (const skipTitle of skipTitles) {
      if (line.includes(skipTitle) || line.length < 3 || line.match(/^[0-9.°]+$/)) {
        skipThis = true;
        break;
      }
    }
    
    if (!skipThis) {
      titleIndex = i;
      break;
    }
  }
  
  // Set the recipe name from the identified title line
  if (lines.length > titleIndex) {
    recipe.name = lines[titleIndex].trim();
    console.log('Identified recipe name:', recipe.name);
  }
  
  // Look for sections - ingredients often contain quantities and units
  let currentSection = 'description';
  const ingredientPatterns = [
    /(\d+)\s*(cup|tbsp|tsp|oz|lb|g|kg|ml|l|pinch|dash)/i,  // Common measurement units
    /^[-•*]\s+(.+)$/,  // Bullet points
    /^(\d+)[.\)]\s+(.+)$/,  // Numbered list with period or parenthesis
    /^([\w\s]+):\s*(.+)$/   // Ingredient with colon
  ];
  
  const instructionPatterns = [
    /^(\d+)[.\)]\s+(.+)$/,  // Numbered steps
    /^step\s+(\d+)[.\s:]\s*(.+)$/i,  // Explicit step markers
    /^([\w\s]+\d+):\s*(.+)$/ // Instruction with colon
  ];
  
  const sectionHeaders = {
    ingredients: [
      'ingredients', 'what you need', 'what you\'ll need', 'shopping list', 'you\'ll need'
    ],
    instructions: [
      'instructions', 'directions', 'method', 'preparation', 'steps', 'how to', 'how to make'
    ],
    notes: [
      'notes', 'tips', 'chef\'s notes', 'cook\'s notes', 'recipe notes'
    ]
  };
  
  // Parse potential recipe metadata for timing and servings
  const timingPatterns = [
    /prep\s*time\s*:?\s*(\d+)\s*(min|hour|hr|minute|sec)/i,
    /cook\s*time\s*:?\s*(\d+)\s*(min|hour|hr|minute|sec)/i,
    /total\s*time\s*:?\s*(\d+)\s*(min|hour|hr|minute|sec)/i,
    /ready\s*in\s*:?\s*(\d+)\s*(min|hour|hr|minute|sec)/i
  ];
  
  const servingsPatterns = [
    /serv(es|ings)\s*:?\s*(\d+)/i,
    /yield\s*:?\s*(\d+)/i,
    /makes\s*:?\s*(\d+)/i
  ];
  
  // Check for timing and servings in the first 10 lines
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    
    // Check for prep time
    const prepMatch = line.match(/prep\s*time\s*:?\s*(\d+)\s*(min|hour|hr|minute|sec)/i);
    if (prepMatch) {
      recipe.prepTime = parseInt(prepMatch[1], 10);
      if (prepMatch[2].toLowerCase().includes('hour')) {
        recipe.prepTime *= 60; // Convert hours to minutes
      }
    }
    
    // Check for cook time
    const cookMatch = line.match(/cook\s*time\s*:?\s*(\d+)\s*(min|hour|hr|minute|sec)/i);
    if (cookMatch) {
      recipe.cookTime = parseInt(cookMatch[1], 10);
      if (cookMatch[2].toLowerCase().includes('hour')) {
        recipe.cookTime *= 60; // Convert hours to minutes
      }
    }
    
    // Check for servings
    for (const pattern of servingsPatterns) {
      const match = line.match(pattern);
      if (match) {
        const servings = parseInt(match[match.length - 1], 10);
        if (!isNaN(servings) && servings > 0) {
          recipe.servings = servings;
        }
      }
    }
  }
  
  // Check if a line indicates a section header
  function identifySection(line) {
    const lowerLine = line.toLowerCase().trim();
    
    // Check for section headers
    for (const [section, headers] of Object.entries(sectionHeaders)) {
      for (const header of headers) {
        if (lowerLine.includes(header) && lowerLine.length < 30) {
          console.log(`Found section header: "${line}" -> ${section}`);
          return section;
        }
      }
    }
    
    return null;
  }
  
  // Try to identify if a line looks like an ingredient
  function looksLikeIngredient(line) {
    const lowerLine = line.toLowerCase().trim();
    
    // Skip lines that are likely not ingredients
    if (lowerLine.includes('prep time') || 
        lowerLine.includes('cook time') || 
        lowerLine.includes('total time') ||
        lowerLine.includes('serving') ||
        lowerLine.includes('nutrition')) {
      return false;
    }
    
    // Check against patterns
    for (const pattern of ingredientPatterns) {
      if (pattern.test(lowerLine)) {
        return true;
      }
    }
    
    // Check for common ingredients
    const commonIngredients = [
      'salt', 'pepper', 'sugar', 'flour', 'butter', 'oil', 'water', 'egg', 
      'milk', 'cheese', 'chicken', 'beef', 'garlic', 'onion', 'tomato', 
      'potato', 'carrot', 'broccoli', 'rice', 'pasta', 'bread', 'cream'
    ];
    
    for (const ingredient of commonIngredients) {
      if (lowerLine.includes(ingredient)) {
        return true;
      }
    }
    
    return false;
  }
  
  // Try to identify if a line looks like an instruction
  function looksLikeInstruction(line) {
    const lowerLine = line.toLowerCase().trim();
    
    // Check against patterns
    for (const pattern of instructionPatterns) {
      if (pattern.test(lowerLine)) {
        return true;
      }
    }
    
    // Check for common instruction verbs
    const instructionVerbs = [
      'preheat', 'heat', 'cook', 'bake', 'stir', 'mix', 'combine', 'add', 
      'place', 'put', 'remove', 'set', 'let', 'leave', 'cut', 'chop', 'slice',
      'serve', 'garnish', 'sprinkle', 'pour', 'drain', 'season'
    ];
    
    // Check if the line starts with a common cooking verb
    for (const verb of instructionVerbs) {
      if (lowerLine.startsWith(verb) || lowerLine.includes(` ${verb} `)) {
        return true;
      }
    }
    
    return false;
  }
  
  console.log('Processing lines to identify sections and content...');
  
  // Skip the title line and start processing from the next line
  for (let i = titleIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length < 2) continue; // Skip very short lines
    
    // Check if this line is a section header
    const detectedSection = identifySection(line);
    if (detectedSection) {
      currentSection = detectedSection;
      console.log(`Switched to section: ${currentSection}`);
      continue;
    }
    
    // Process line based on current section and content
    if (currentSection === 'ingredients' || looksLikeIngredient(line)) {
      recipe.ingredients.push(line);
      if (currentSection !== 'ingredients') {
        console.log(`Auto-detected ingredient: ${line}`);
        currentSection = 'ingredients';
      }
    } 
    else if (currentSection === 'instructions' || looksLikeInstruction(line)) {
      recipe.instructions.push(line);
      if (currentSection !== 'instructions') {
        console.log(`Auto-detected instruction: ${line}`);
        currentSection = 'instructions';
      }
    } 
    else if (currentSection === 'notes') {
      recipe.notes += line + '\n';
    } 
    else if (currentSection === 'description' && line.length > 10) {
      recipe.description += line + '\n';
    }
  }
  
  // Clean up any extra whitespace
  recipe.description = recipe.description.trim();
  recipe.notes = recipe.notes.trim();
  
  // If we couldn't find specific sections, try a more aggressive approach
  if (recipe.ingredients.length === 0 && recipe.instructions.length === 0) {
    console.log('No structured content found, using fallback parsing...');
    
    // Simple fallback: first third of lines might be ingredients, rest are instructions
    const splitPoint = Math.max(1, Math.floor(lines.length / 3));
    
    // Skip the title
    for (let i = titleIndex + 1; i < splitPoint && i < lines.length; i++) {
      if (lines[i].length > 3) {
        recipe.ingredients.push(lines[i]);
      }
    }
    
    for (let i = splitPoint; i < lines.length; i++) {
      if (lines[i].length > 3) {
        recipe.instructions.push(lines[i]);
      }
    }
  }
  
  // Guess recipe category based on ingredients or title
  function guessCategory() {
    const lowerTitle = recipe.name.toLowerCase();
    const allText = [...recipe.ingredients, recipe.description, recipe.name].join(' ').toLowerCase();
    
    const categoryMatches = {
      'Breakfast': ['breakfast', 'pancake', 'waffle', 'egg', 'bacon', 'toast', 'cereal', 'oatmeal'],
      'Lunch': ['sandwich', 'wrap', 'soup', 'salad', 'lunch'],
      'Dinner': ['dinner', 'roast', 'steak', 'casserole'],
      'Appetizer': ['appetizer', 'starter', 'dip', 'snack', 'finger food'],
      'Dessert': ['dessert', 'cake', 'cookie', 'ice cream', 'sweet', 'chocolate', 'pie', 'pastry'],
      'Beverage': ['drink', 'beverage', 'cocktail', 'smoothie', 'juice', 'tea', 'coffee'],
      'Side Dish': ['side', 'vegetable', 'potato', 'rice', 'grain'],
      'Main Course': ['main', 'chicken', 'beef', 'pork', 'fish', 'pasta', 'meat']
    };
    
    for (const [category, keywords] of Object.entries(categoryMatches)) {
      for (const keyword of keywords) {
        if (lowerTitle.includes(keyword) || allText.includes(keyword)) {
          return category;
        }
      }
    }
    
    return 'Other';
  }
  
  // Set a primary category if one wasn't found
  recipe.primaryCategory = guessCategory();
  
  console.log('Recipe parsing complete');
  return recipe;
}

module.exports = router; 