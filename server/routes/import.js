const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const Ingredient = require('../models/Ingredient');
const Supplier = require('../models/Supplier');

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
  // Accept csv and excel files
  if (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.ms-excel' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV and Excel files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB max file size
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

module.exports = router; 