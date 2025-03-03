const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = null;

// Helper function to make authenticated requests
const authRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };

    let response;
    if (method === 'get') {
      response = await axios.get(`${API_URL}${endpoint}`, config);
    } else if (method === 'post') {
      response = await axios.post(`${API_URL}${endpoint}`, data, config);
    } else if (method === 'put') {
      response = await axios.put(`${API_URL}${endpoint}`, data, config);
    } else if (method === 'delete') {
      response = await axios.delete(`${API_URL}${endpoint}`, config);
    }

    return response.data;
  } catch (err) {
    console.error(`Error with ${method.toUpperCase()} ${endpoint}:`, 
      err.response ? err.response.data : err.message);
    return null;
  }
};

// Authentication Tests
const testAuth = async () => {
  console.log('\n=== AUTHENTICATION TESTS ===');
  
  // Register or login
  try {
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    console.log('Attempting to register...');
    const registerRes = await axios.post(`${API_URL}/users`, registerData);
    token = registerRes.data.token;
    console.log('Registration successful');
  } catch (err) {
    console.log('Registration failed, attempting login...');
    
    try {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const loginRes = await axios.post(`${API_URL}/auth`, loginData);
      token = loginRes.data.token;
      console.log('Login successful');
    } catch (loginErr) {
      console.error('Login failed:', loginErr.response ? loginErr.response.data : loginErr.message);
      return false;
    }
  }
  
  // Get user profile
  const user = await authRequest('get', '/auth');
  if (user) {
    console.log('User profile retrieved:', user);
    return true;
  }
  
  return false;
};

// Ingredient Tests
const testIngredients = async () => {
  console.log('\n=== INGREDIENT TESTS ===');
  
  // Create an ingredient
  const ingredientData = {
    name: 'Test Ingredient',
    category: 'Produce',
    cost: 5.99,
    unitSize: 1,
    unitType: 'kg',
    packSize: 1,
    class: 'food'
  };
  
  console.log('Creating ingredient...');
  const newIngredient = await authRequest('post', '/ingredients', ingredientData);
  
  if (!newIngredient) {
    console.log('Failed to create ingredient');
    return;
  }
  
  console.log('Ingredient created:', newIngredient);
  const ingredientId = newIngredient._id;
  
  // Get all ingredients
  console.log('Getting all ingredients...');
  const ingredients = await authRequest('get', '/ingredients');
  
  if (ingredients) {
    console.log(`Retrieved ${ingredients.length} ingredients`);
  }
  
  // Update an ingredient
  const updateData = {
    name: 'Updated Ingredient',
    cost: 6.99
  };
  
  console.log('Updating ingredient...');
  const updatedIngredient = await authRequest('put', `/ingredients/${ingredientId}`, updateData);
  
  if (updatedIngredient) {
    console.log('Ingredient updated:', updatedIngredient);
  }
  
  // Delete an ingredient
  console.log('Deleting ingredient...');
  const deleteResult = await authRequest('delete', `/ingredients/${ingredientId}`);
  
  if (deleteResult) {
    console.log('Ingredient deleted successfully');
  }
};

// Supplier Tests
const testSuppliers = async () => {
  console.log('\n=== SUPPLIER TESTS ===');
  
  // Create a supplier
  const supplierData = {
    name: 'Test Supplier',
    contact: 'John Doe',
    email: 'supplier@example.com',
    phone: '123-456-7890',
    address: '123 Supplier St'
  };
  
  console.log('Creating supplier...');
  const newSupplier = await authRequest('post', '/suppliers', supplierData);
  
  if (!newSupplier) {
    console.log('Failed to create supplier');
    return;
  }
  
  console.log('Supplier created:', newSupplier);
  const supplierId = newSupplier._id;
  
  // Get all suppliers
  console.log('Getting all suppliers...');
  const suppliers = await authRequest('get', '/suppliers');
  
  if (suppliers) {
    console.log(`Retrieved ${suppliers.length} suppliers`);
  }
  
  // Update a supplier
  const updateData = {
    name: 'Updated Supplier',
    phone: '987-654-3210'
  };
  
  console.log('Updating supplier...');
  const updatedSupplier = await authRequest('put', `/suppliers/${supplierId}`, updateData);
  
  if (updatedSupplier) {
    console.log('Supplier updated:', updatedSupplier);
  }
  
  // Delete a supplier
  console.log('Deleting supplier...');
  const deleteResult = await authRequest('delete', `/suppliers/${supplierId}`);
  
  if (deleteResult) {
    console.log('Supplier deleted successfully');
  }
};

// Recipe Tests
const testRecipes = async () => {
  console.log('\n=== RECIPE TESTS ===');
  
  // First, create an ingredient to use in the recipe
  const ingredientData = {
    name: 'Recipe Test Ingredient',
    category: 'Produce',
    cost: 4.99,
    unitSize: 1,
    unitType: 'kg',
    packSize: 1,
    class: 'food'
  };
  
  console.log('Creating ingredient for recipe...');
  const ingredient = await authRequest('post', '/ingredients', ingredientData);
  
  if (!ingredient) {
    console.log('Failed to create ingredient for recipe');
    return;
  }
  
  // Create a recipe
  console.log('Creating recipe...');
  const recipeData = {
    name: 'Test Recipe',
    recipeYield: {
      value: 4,
      unit: 'servings'
    },
    products: [
      {
        ingredient: ingredient._id,
        costPerUnit: 4.99,
        unitSize: 1,
        unitType: 'kg',
        quantity: 0.5,
        subtotal: 2.495
      }
    ],
    method: ['Step 1: Mix ingredients', 'Step 2: Cook for 20 minutes']
  };
  
  const newRecipe = await authRequest('post', '/recipes', recipeData);
  
  if (!newRecipe) {
    console.log('Failed to create recipe');
    return;
  }
  
  console.log('Recipe created:', newRecipe);
  const recipeId = newRecipe._id;
  
  // Get all recipes
  console.log('Getting all recipes...');
  const recipes = await authRequest('get', '/recipes');
  
  if (recipes) {
    console.log(`Retrieved ${recipes.length} recipes`);
  }
  
  // Update recipe
  console.log('Updating recipe...');
  const updateData = {
    name: 'Updated Recipe',
    recipeYield: {
      value: 6,
      unit: 'servings'
    }
  };
  
  const updatedRecipe = await authRequest('put', `/recipes/${recipeId}`, updateData);
  
  if (updatedRecipe) {
    console.log('Recipe updated:', updatedRecipe);
  }
  
  // Delete recipe
  console.log('Deleting recipe...');
  const deleteResult = await authRequest('delete', `/recipes/${recipeId}`);
  
  if (deleteResult) {
    console.log('Recipe deleted successfully');
  }
  
  // Clean up - delete the ingredient
  console.log('Cleaning up - deleting test ingredient...');
  await authRequest('delete', `/ingredients/${ingredient._id}`);
};

// Run all tests
const runAllTests = async () => {
  console.log('Starting API tests...');
  
  // First authenticate
  const authSuccess = await testAuth();
  
  if (!authSuccess) {
    console.error('Authentication failed. Cannot proceed with tests.');
    return;
  }
  
  // Run other tests
  await testIngredients();
  await testSuppliers();
  await testRecipes();
  
  console.log('\nAll tests completed.');
};

runAllTests(); 