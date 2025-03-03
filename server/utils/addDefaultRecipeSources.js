const mongoose = require('mongoose');
const config = require('config');
const RecipeSource = require('../models/RecipeSource');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Add default recipe sources
const addDefaultRecipeSources = async () => {
  try {
    await connectDB();
    
    // Check if Allrecipes source already exists
    const existingSource = await RecipeSource.findOne({ name: 'Allrecipes' });
    
    if (existingSource) {
      console.log('Allrecipes source already exists');
    } else {
      // Create Allrecipes source
      const allrecipesSource = new RecipeSource({
        user: '507f1f77bcf86cd799439011', // Default admin user ID
        name: 'Allrecipes',
        url: 'https://www.allrecipes.com',
        isActive: true,
        isDefault: true
      });
      
      await allrecipesSource.save();
      console.log('Added Allrecipes source');
    }
    
    // Add more default sources here if needed
    
    console.log('Default recipe sources added successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error adding default recipe sources:', err.message);
    process.exit(1);
  }
};

// Run the function
addDefaultRecipeSources(); 