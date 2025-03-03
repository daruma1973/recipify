const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const RecipeSource = require('../models/RecipeSource');

// @route   GET api/recipe-sources
// @desc    Get all recipe sources
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // In development mode with auth disabled, get all sources
    // Otherwise, filter by user ID
    const query = req.user.id === '507f1f77bcf86cd799439011' ? {} : { user: req.user.id };
    
    const sources = await RecipeSource.find(query).sort({ name: 1 });
    res.json(sources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/recipe-sources
// @desc    Add new recipe source
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('url', 'URL is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, url, apiKey, isActive, isDefault } = req.body;

    try {
      // If this is set as default, unset any existing defaults
      if (isDefault) {
        await RecipeSource.updateMany(
          { user: req.user.id, isDefault: true },
          { $set: { isDefault: false } }
        );
      }

      const newSource = new RecipeSource({
        name,
        url,
        apiKey: apiKey || '',
        isActive: isActive !== undefined ? isActive : true,
        isDefault: isDefault || false,
        user: req.user.id
      });

      const source = await newSource.save();
      res.json(source);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/recipe-sources/:id
// @desc    Update recipe source
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, url, apiKey, isActive, isDefault } = req.body;

  // Build source object
  const sourceFields = {};
  if (name) sourceFields.name = name;
  if (url) sourceFields.url = url;
  if (apiKey !== undefined) sourceFields.apiKey = apiKey;
  if (isActive !== undefined) sourceFields.isActive = isActive;
  if (isDefault !== undefined) sourceFields.isDefault = isDefault;

  try {
    let source = await RecipeSource.findById(req.params.id);

    if (!source) return res.status(404).json({ msg: 'Recipe source not found' });

    // Make sure user owns source
    if (source.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // If this is set as default, unset any existing defaults
    if (isDefault) {
      await RecipeSource.updateMany(
        { user: req.user.id, isDefault: true, _id: { $ne: req.params.id } },
        { $set: { isDefault: false } }
      );
    }

    source = await RecipeSource.findByIdAndUpdate(
      req.params.id,
      { $set: sourceFields },
      { new: true }
    );

    res.json(source);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/recipe-sources/:id
// @desc    Delete recipe source
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let source = await RecipeSource.findById(req.params.id);

    if (!source) return res.status(404).json({ msg: 'Recipe source not found' });

    // Make sure user owns source
    if (source.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await RecipeSource.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Recipe source removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 