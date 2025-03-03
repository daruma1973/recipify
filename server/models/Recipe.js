const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  // Basic recipe details
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['development', 'live', 'archived'],
    default: 'development'
  },
  menuAssignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menu'
  },
  primaryCategory: {
    type: String,
    required: true
  },
  subCategory: {
    type: String
  },
  recipeYield: {
    value: { 
      type: Number,
      default: 1
    },
    unit: { 
      type: String,
      default: 'serving'
    }
  },
  revenueOutlet: {
    type: String
  },
  itemClass: {
    type: String,
    enum: ['food', 'beverage', 'other'],
    default: 'food'
  },
  vatPercentage: {
    type: Number,
    default: 0
  },
  costOfSalesPercentage: {
    type: Number,
    default: 0
  },
  wastagePercentage: {
    type: Number,
    default: 0
  },
  
  // Legacy fields for compatibility
  category: {
    type: String
  },
  description: {
    type: String
  },
  servings: {
    type: String
  },
  prepTime: {
    type: String
  },
  cookTime: {
    type: String
  },
  
  // Media
  image: {
    type: String,
    maxlength: 10485760 // 10MB max size for base64 images
  },
  videoUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Ingredients for the simplified client model
  ingredients: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ingredient'
      },
      name: {
        type: String
      },
      quantity: {
        type: Number
      },
      unit: {
        type: String
      },
      cost: {
        type: Number,
        default: 0
      }
    }
  ],
  
  // Sub-recipes
  subRecipes: [
    {
      recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipe'
      },
      name: {
        type: String
      },
      quantity: {
        type: Number
      },
      unit: {
        type: String
      },
      cost: {
        type: Number,
        default: 0
      }
    }
  ],
  
  // Extra ingredients
  extraIngredients: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ingredient'
      },
      name: {
        type: String
      },
      quantity: {
        type: Number
      },
      unit: {
        type: String
      },
      cost: {
        type: Number,
        default: 0
      }
    }
  ],
  
  // Instructions/Procedure
  instructions: {
    type: [String]
  },
  
  // Critical control points
  criticalControl: {
    type: String
  },
  
  // Service notes
  serviceNotes: {
    type: String
  },
  
  // Suitability flags
  suitability: {
    kosher: { type: Boolean, default: false },
    lowCarb: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    vegetarian: { type: Boolean, default: false },
    plantBased: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    dairyFree: { type: Boolean, default: false },
    nutFree: { type: Boolean, default: false }
  },
  
  // Allergens
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
  
  // Financial calculations
  costPrice: {
    type: Number,
    default: 0
  },
  costPriceWithWastage: {
    type: Number,
    default: 0
  },
  suggestedSellingPrice: {
    type: Number,
    default: 0
  },
  actualSellingPrice: {
    type: Number,
    default: 0
  },
  grossProfit: {
    type: Number,
    default: 0
  },
  grossProfitPercentage: {
    type: Number,
    default: 0
  },
  costOfSalesActual: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  date: {
    type: Date,
    default: Date.now
  }
});

// Calculate financial metrics before saving
RecipeSchema.pre('save', function(next) {
  // Calculate total cost from ingredients, sub-recipes, and extras
  let totalCost = 0;
  
  // Add up ingredient costs
  if (this.ingredients && this.ingredients.length > 0) {
    totalCost += this.ingredients.reduce((sum, item) => sum + (item.cost || 0), 0);
  }
  
  // Add up sub-recipe costs
  if (this.subRecipes && this.subRecipes.length > 0) {
    totalCost += this.subRecipes.reduce((sum, item) => sum + (item.cost || 0), 0);
  }
  
  // Add up extra ingredient costs
  if (this.extraIngredients && this.extraIngredients.length > 0) {
    totalCost += this.extraIngredients.reduce((sum, item) => sum + (item.cost || 0), 0);
  }
  
  // Set cost price
  this.costPrice = totalCost;
  
  // Calculate cost with wastage
  this.costPriceWithWastage = totalCost * (1 + (this.wastagePercentage || 0) / 100);
  
  // Calculate suggested selling price based on cost of sales percentage
  if (this.costOfSalesPercentage && this.costOfSalesPercentage > 0) {
    this.suggestedSellingPrice = this.costPriceWithWastage / (this.costOfSalesPercentage / 100);
  } else {
    // Default markup of 70% if no cost of sales percentage
    this.suggestedSellingPrice = this.costPriceWithWastage / 0.3;
  }
  
  // Calculate gross profit if actual selling price is set
  if (this.actualSellingPrice && this.actualSellingPrice > 0) {
    this.grossProfit = this.actualSellingPrice - this.costPriceWithWastage;
    this.grossProfitPercentage = (this.grossProfit / this.actualSellingPrice) * 100;
    this.costOfSalesActual = (this.costPriceWithWastage / this.actualSellingPrice) * 100;
  } else {
    this.grossProfit = this.suggestedSellingPrice - this.costPriceWithWastage;
    this.grossProfitPercentage = (this.grossProfit / this.suggestedSellingPrice) * 100;
    this.costOfSalesActual = (this.costPriceWithWastage / this.suggestedSellingPrice) * 100;
  }
  
  next();
});

module.exports = mongoose.model('recipe', RecipeSchema); 