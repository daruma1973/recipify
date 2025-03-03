const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'supplier'
  },
  category: {
    type: String
  },
  subCategory: {
    type: String
  },
  class: {
    type: String,
    enum: ['food', 'beverage', 'other'],
    default: 'food'
  },
  // Cost and unit information
  cost: {
    type: Number,
    required: true
  },
  unitSize: {
    type: Number,
    required: true
  },
  unitType: {
    type: String,
    required: true
  },
  netWeight: {
    type: Number
  },
  packSize: {
    type: Number,
    default: 1
  },
  taxValue: {
    type: Number,
    default: 0
  },
  // Nutritional information per 100g/100ml
  nutritionalInfo: {
    energy: { type: Number },
    protein: { type: Number },
    carbohydrates: { type: Number },
    sugars: { type: Number },
    fat: { type: Number },
    saturatedFat: { type: Number },
    fiber: { type: Number },
    salt: { type: Number }
  },
  // Allergen information
  allergens: {
    celery: { type: Boolean, default: false },
    gluten: { type: Boolean, default: false },
    crustaceans: { type: Boolean, default: false },
    eggs: { type: Boolean, default: false },
    fish: { type: Boolean, default: false },
    lupin: { type: Boolean, default: false },
    milk: { type: Boolean, default: false },
    molluscs: { type: Boolean, default: false },
    mustard: { type: Boolean, default: false },
    nuts: { type: Boolean, default: false },
    peanuts: { type: Boolean, default: false },
    sesameSeeds: { type: Boolean, default: false },
    soybeans: { type: Boolean, default: false },
    sulphurDioxide: { type: Boolean, default: false }
  },
  // Additional information
  description: {
    type: String
  },
  notes: {
    type: String
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ingredient', IngredientSchema); 