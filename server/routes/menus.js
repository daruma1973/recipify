const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Menu = require('../models/Menu');
const Recipe = require('../models/Recipe');

// @route   GET api/menus
// @desc    Get all menus
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching menus with query:', req.query);
    
    // In development mode, fetch all menus regardless of user
    let query = {};
    
    // In production, only fetch user's menus
    if (process.env.NODE_ENV !== 'development') {
      query.user = req.user.id;
    }
    
    const menus = await Menu.find(query).sort({ date: -1 });
    
    console.log(`Found ${menus.length} menus`);
    
    res.json(menus);
  } catch (err) {
    console.error('Error fetching menus:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/menus/:id
// @desc    Get menu by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate({
        path: 'sections.recipes.recipe',
        select: 'name description image costPrice'
      });

    if (!menu) return res.status(404).json({ msg: 'Menu not found' });

    // Make sure user owns menu
    if (menu.user.toString() !== req.user.id && process.env.NODE_ENV !== 'development') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(menu);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Menu not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/menus
// @desc    Create a menu
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('Creating new menu:', req.body.name);
      
      const {
        name,
        description,
        status,
        revenueOutlet,
        sections,
        startDate,
        endDate,
        isActive
      } = req.body;

      const newMenu = new Menu({
        user: req.user.id,
        name,
        description,
        status: status || 'active',
        revenueOutlet,
        sections: sections || [],
        startDate,
        endDate,
        isActive: isActive !== undefined ? isActive : true
      });

      const menu = await newMenu.save();
      console.log('Menu saved successfully:', menu._id);
      res.json(menu);
    } catch (err) {
      console.error('Error saving menu:', err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/menus/:id
// @desc    Update menu
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let menu = await Menu.findById(req.params.id);

    if (!menu) return res.status(404).json({ msg: 'Menu not found' });

    // Make sure user owns menu
    if (menu.user.toString() !== req.user.id && process.env.NODE_ENV !== 'development') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const {
      name,
      description,
      status,
      revenueOutlet,
      sections,
      startDate,
      endDate,
      isActive
    } = req.body;

    // Build menu object
    const menuFields = {};
    if (name) menuFields.name = name;
    if (description !== undefined) menuFields.description = description;
    if (status) menuFields.status = status;
    if (revenueOutlet !== undefined) menuFields.revenueOutlet = revenueOutlet;
    if (sections) menuFields.sections = sections;
    if (startDate) menuFields.startDate = startDate;
    if (endDate) menuFields.endDate = endDate;
    if (isActive !== undefined) menuFields.isActive = isActive;

    // Update
    menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { $set: menuFields },
      { new: true }
    );

    res.json(menu);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/menus/:id
// @desc    Delete menu
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) return res.status(404).json({ msg: 'Menu not found' });

    // Make sure user owns menu
    if (menu.user.toString() !== req.user.id && process.env.NODE_ENV !== 'development') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update any recipes that reference this menu
    await Recipe.updateMany(
      { menuAssignment: req.params.id },
      { $unset: { menuAssignment: "" } }
    );

    await menu.remove();

    res.json({ msg: 'Menu removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/menus/:id/sections
// @desc    Add a section to a menu
// @access  Private
router.post(
  '/:id/sections',
  [
    auth,
    [
      check('name', 'Section name is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const menu = await Menu.findById(req.params.id);

      if (!menu) return res.status(404).json({ msg: 'Menu not found' });

      // Make sure user owns menu
      if (menu.user.toString() !== req.user.id && process.env.NODE_ENV !== 'development') {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const { name, description } = req.body;
      
      const newSection = {
        name,
        description,
        recipes: []
      };

      menu.sections.push(newSection);
      await menu.save();

      res.json(menu);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/menus/:id/sections/:sectionIndex/recipes
// @desc    Add a recipe to a menu section
// @access  Private
router.post(
  '/:id/sections/:sectionIndex/recipes',
  [
    auth,
    [
      check('recipe', 'Recipe ID is required').not().isEmpty(),
      check('sellingPrice', 'Selling price is required').isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const menu = await Menu.findById(req.params.id);

      if (!menu) return res.status(404).json({ msg: 'Menu not found' });

      // Make sure user owns menu
      if (menu.user.toString() !== req.user.id && process.env.NODE_ENV !== 'development') {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const sectionIndex = req.params.sectionIndex;
      
      if (sectionIndex >= menu.sections.length) {
        return res.status(404).json({ msg: 'Section not found' });
      }
      
      const { recipe, sellingPrice, displayOrder } = req.body;
      
      // Verify recipe exists
      const recipeDoc = await Recipe.findById(recipe);
      if (!recipeDoc) {
        return res.status(404).json({ msg: 'Recipe not found' });
      }
      
      const newMenuItem = {
        recipe,
        sellingPrice,
        displayOrder: displayOrder || menu.sections[sectionIndex].recipes.length + 1
      };

      menu.sections[sectionIndex].recipes.push(newMenuItem);
      
      // Update the recipe with menu assignment
      await Recipe.findByIdAndUpdate(
        recipe,
        { menuAssignment: menu._id }
      );
      
      await menu.save();

      res.json(menu);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router; 