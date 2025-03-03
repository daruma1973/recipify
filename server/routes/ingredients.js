const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Ingredient = require('../models/Ingredient');
const Supplier = require('../models/Supplier');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, 'ingredients-' + Date.now() + path.extname(file.originalname));
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  console.log('Received file:', file.originalname, 'MIME type:', file.mimetype);
  
  // Accept various MIME types that could be CSV files
  const acceptableMimeTypes = [
    'text/csv', 
    'application/csv',
    'application/vnd.ms-excel',
    'text/plain',
    'application/octet-stream'
  ];
  
  // Also check file extension
  const isCSVExtension = file.originalname.toLowerCase().endsWith('.csv');
  
  if (acceptableMimeTypes.includes(file.mimetype) || isCSVExtension) {
    console.log('File accepted:', file.originalname);
    cb(null, true);
  } else {
    console.log('File rejected:', file.originalname, 'MIME type:', file.mimetype);
    cb(new Error('Only CSV files are allowed'), false);
  }
};

// Initialize upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// @route   GET api/ingredients
// @desc    Get all ingredients
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const ingredients = await Ingredient.find()
      .sort({ date: -1 })
      .populate('supplier', 'name');
    res.json(ingredients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ingredients/template
// @desc    Download CSV template
// @access  Private
router.get('/template', auth, (req, res) => {
  try {
    const templatePath = path.join(__dirname, '../../ingredient-template.csv');
    res.download(templatePath, 'ingredient-template.csv');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ingredients/test-template
// @desc    Download CSV template (public for testing)
// @access  Public
router.get('/test-template', (req, res) => {
  try {
    const templatePath = path.join(__dirname, '../../ingredient-template.csv');
    res.download(templatePath, 'ingredient-template.csv');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ingredients/:id
// @desc    Get ingredient by ID
// @access  Public
router.get('/:id', auth, async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id)
      .populate('supplier', 'name email phone contact');

    if (!ingredient) return res.status(404).json({ msg: 'Ingredient not found' });

    res.json(ingredient);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ingredient not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ingredients/upload
// @desc    Upload ingredients from CSV
// @access  Private
router.post('/upload', [auth, upload.single('file')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const results = [];
    const errors = [];
    let rowCount = 0;
    let successCount = 0;

    // Process CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', async (data) => {
        rowCount++;
        
        // Validate required fields
        if (!data.name || !data.unit || !data.costPerUnit) {
          errors.push({
            row: rowCount,
            error: 'Missing required fields (name, unit, or costPerUnit)'
          });
          return;
        }

        try {
          // Create ingredient object
          const ingredientData = {
            name: data.name,
            category: data.category || '',
            unitType: data.unit,
            unitSize: 1, // Default unit size
            cost: parseFloat(data.costPerUnit),
            description: data.description || '',
            notes: data.notes || '',
            user: req.user.id
          };

          // Add optional fields if present
          if (data.inStock) ingredientData.inStock = parseFloat(data.inStock);
          if (data.minStockLevel) ingredientData.minStockLevel = parseFloat(data.minStockLevel);
          
          // Handle supplier as a string name rather than an ID
          if (data.supplier) {
            // Store supplier name in notes if we can't link to a supplier object
            if (!ingredientData.notes) {
              ingredientData.notes = `Supplier: ${data.supplier}`;
            } else {
              ingredientData.notes += `\nSupplier: ${data.supplier}`;
            }
          }

          // Create and save the ingredient
          const newIngredient = new Ingredient(ingredientData);
          await newIngredient.save();
          
          successCount++;
          results.push({
            row: rowCount,
            name: data.name,
            status: 'success'
          });
        } catch (err) {
          errors.push({
            row: rowCount,
            name: data.name,
            error: err.message
          });
        }
      })
      .on('end', () => {
        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
        
        res.json({
          success: true,
          message: `Processed ${rowCount} rows, successfully imported ${successCount} ingredients`,
          results,
          errors
        });
      })
      .on('error', (err) => {
        // Delete the uploaded file if it exists
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        console.error('CSV parsing error:', err);
        res.status(500).json({ 
          success: false, 
          message: 'Error processing CSV file',
          error: err.message
        });
      });
  } catch (err) {
    console.error(err.message);
    // Delete the uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ingredients
// @desc    Add new ingredient
// @access  Public
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('cost', 'Cost is required').isNumeric(),
      check('unitSize', 'Unit size is required').isNumeric(),
      check('unitType', 'Unit type is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      code,
      supplier,
      category,
      subCategory,
      class: itemClass,
      cost,
      unitSize,
      unitType,
      netWeight,
      packSize,
      taxValue,
      nutritionalInfo,
      allergens,
      description,
      notes,
      image
    } = req.body;

    try {
      // Check if supplier exists
      if (supplier) {
        const supplierExists = await Supplier.findById(supplier);
        if (!supplierExists) {
          return res.status(404).json({ msg: 'Supplier not found' });
        }
      }

      // Create ingredient object with default values for nutritionalInfo and allergens
      const newIngredient = new Ingredient({
        name,
        code,
        supplier,
        category,
        subCategory,
        class: itemClass,
        cost,
        unitSize,
        unitType,
        netWeight,
        packSize,
        taxValue,
        nutritionalInfo: nutritionalInfo || {
          energy: 0,
          protein: 0,
          carbohydrates: 0,
          sugars: 0,
          fat: 0,
          saturatedFat: 0,
          fiber: 0,
          salt: 0
        },
        allergens: allergens || {
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
        description,
        notes,
        image,
        user: req.user.id
      });

      const ingredient = await newIngredient.save();

      res.json(ingredient);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/ingredients/:id
// @desc    Update ingredient
// @access  Public
router.put('/:id', auth, async (req, res) => {
  const {
    name,
    code,
    supplier,
    category,
    subCategory,
    class: itemClass,
    cost,
    unitSize,
    unitType,
    netWeight,
    packSize,
    taxValue,
    nutritionalInfo,
    allergens,
    description,
    notes,
    image,
    isActive
  } = req.body;

  // Build ingredient object
  const ingredientFields = {};
  if (name) ingredientFields.name = name;
  if (code) ingredientFields.code = code;
  if (supplier) ingredientFields.supplier = supplier;
  if (category) ingredientFields.category = category;
  if (subCategory) ingredientFields.subCategory = subCategory;
  if (itemClass) ingredientFields.class = itemClass;
  if (cost) ingredientFields.cost = cost;
  if (unitSize) ingredientFields.unitSize = unitSize;
  if (unitType) ingredientFields.unitType = unitType;
  if (netWeight) ingredientFields.netWeight = netWeight;
  if (packSize) ingredientFields.packSize = packSize;
  if (taxValue) ingredientFields.taxValue = taxValue;
  
  // Ensure nutritionalInfo is properly handled
  if (nutritionalInfo) {
    ingredientFields.nutritionalInfo = nutritionalInfo;
  } else {
    // Provide default empty nutritionalInfo
    ingredientFields.nutritionalInfo = {
      energy: 0,
      protein: 0,
      carbohydrates: 0,
      sugars: 0,
      fat: 0,
      saturatedFat: 0,
      fiber: 0,
      salt: 0
    };
  }
  
  // Ensure allergens is properly handled
  if (allergens) {
    ingredientFields.allergens = allergens;
  } else {
    // Provide default allergens with all values set to false
    ingredientFields.allergens = {
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
    };
  }
  
  if (description) ingredientFields.description = description;
  if (notes) ingredientFields.notes = notes;
  if (image) ingredientFields.image = image;
  if (isActive !== undefined) ingredientFields.isActive = isActive;

  try {
    let ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) return res.status(404).json({ msg: 'Ingredient not found' });

    // Check if supplier exists
    if (supplier) {
      const supplierExists = await Supplier.findById(supplier);
      if (!supplierExists) {
        return res.status(404).json({ msg: 'Supplier not found' });
      }
    }

    ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { $set: ingredientFields },
      { new: true }
    );

    res.json(ingredient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/ingredients/:id
// @desc    Delete ingredient
// @access  Public
router.delete('/:id', auth, async (req, res) => {
  try {
    let ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) return res.status(404).json({ msg: 'Ingredient not found' });

    await Ingredient.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Ingredient removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 