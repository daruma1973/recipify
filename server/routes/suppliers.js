const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Supplier = require('../models/Supplier');

// @route   GET api/suppliers
// @desc    Get all suppliers
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const suppliers = await Supplier.find({ user: req.user.id }).sort({ name: 1 });
    res.json(suppliers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/suppliers/:id
// @desc    Get supplier by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    console.log(`Fetching supplier with ID: ${req.params.id}`);
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      console.log(`Supplier not found with ID: ${req.params.id}`);
      return res.status(404).json({ msg: 'Supplier not found' });
    }

    // Make sure user owns supplier
    if (supplier.user.toString() !== req.user.id) {
      console.log(`User ${req.user.id} not authorized to access supplier ${req.params.id}`);
      return res.status(401).json({ msg: 'Not authorized' });
    }

    console.log(`Successfully retrieved supplier: ${supplier.name}`);
    res.json(supplier);
  } catch (err) {
    console.error(`Error fetching supplier: ${err.message}`);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/suppliers
// @desc    Add new supplier
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

    const {
      name,
      code,
      contactPerson,
      email,
      phone,
      address,
      website,
      notes
    } = req.body;

    try {
      const newSupplier = new Supplier({
        name,
        code,
        contactPerson,
        email,
        phone,
        address,
        website,
        notes,
        user: req.user.id
      });

      const supplier = await newSupplier.save();

      res.json(supplier);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/suppliers/:id
// @desc    Update supplier
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    name,
    code,
    contactPerson,
    email,
    phone,
    address,
    website,
    notes,
    isActive
  } = req.body;

  // Build supplier object
  const supplierFields = {};
  if (name) supplierFields.name = name;
  if (code) supplierFields.code = code;
  if (contactPerson) supplierFields.contactPerson = contactPerson;
  if (email) supplierFields.email = email;
  if (phone) supplierFields.phone = phone;
  if (address) supplierFields.address = address;
  if (website) supplierFields.website = website;
  if (notes) supplierFields.notes = notes;
  if (isActive !== undefined) supplierFields.isActive = isActive;

  try {
    let supplier = await Supplier.findById(req.params.id);

    if (!supplier) return res.status(404).json({ msg: 'Supplier not found' });

    // Make sure user owns supplier
    if (supplier.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { $set: supplierFields },
      { new: true }
    );

    res.json(supplier);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/suppliers/:id
// @desc    Delete supplier
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let supplier = await Supplier.findById(req.params.id);

    if (!supplier) return res.status(404).json({ msg: 'Supplier not found' });

    // Make sure user owns supplier
    if (supplier.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Supplier.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Supplier removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 