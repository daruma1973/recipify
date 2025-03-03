import React, { useReducer } from 'react';
import axios from 'axios';
import RecipeContext from './recipeContext';
import recipeReducer from './recipeReducer';
import {
  GET_RECIPES,
  GET_RECIPE,
  ADD_RECIPE,
  DELETE_RECIPE,
  UPDATE_RECIPE,
  CLEAR_RECIPES,
  FILTER_RECIPES,
  CLEAR_FILTER,
  RECIPE_ERROR,
  SET_CURRENT_RECIPE,
  CLEAR_CURRENT_RECIPE,
  SET_LOADING
} from '../types';

const RecipeState = props => {
  const initialState = {
    recipes: [],
    current: null,
    filtered: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(recipeReducer, initialState);

  // Get Recipes
  const getRecipes = async () => {
    try {
      setLoading();
      console.log('Fetching all recipes');
      
      const res = await axios.get('/api/recipes');
      console.log('Recipes data received:', res.data.length, 'recipes');

      dispatch({
        type: GET_RECIPES,
        payload: res.data
      });
    } catch (err) {
      console.error('Error fetching recipes:', err);
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      
      dispatch({
        type: RECIPE_ERROR,
        payload: err.response?.data?.msg || 'Error loading recipes'
      });
    }
  };

  // Get Recipe
  const getRecipe = async id => {
    try {
      setLoading();
      console.log('Fetching recipe with ID:', id);
      
      const res = await axios.get(`/api/recipes/${id}`);
      console.log('Recipe data received:', res.data);

      dispatch({
        type: GET_RECIPE,
        payload: res.data
      });
    } catch (err) {
      console.error('Error fetching recipe:', err);
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      
      dispatch({
        type: RECIPE_ERROR,
        payload: err.response?.data?.msg || 'Error loading recipe'
      });
    }
  };

  // Add Recipe
  const addRecipe = async recipe => {
    try {
      setLoading();
      console.log('Adding new recipe:', recipe.name);
      
      // Check if image is a base64 string (from file upload)
      if (recipe.image && recipe.image.length > 1000) {
        console.log('Recipe contains a base64 image, length:', recipe.image.length);
      }
      
      // Check if videoUrl is present
      if (recipe.videoUrl) {
        console.log('Recipe contains a video URL:', recipe.videoUrl);
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const res = await axios.post('/api/recipes', recipe, config);
      console.log('Recipe added successfully:', res.data);
      console.log('Saved image:', res.data.image ? 'Yes' : 'No');
      console.log('Saved videoUrl:', res.data.videoUrl ? 'Yes' : 'No');

      dispatch({
        type: ADD_RECIPE,
        payload: res.data
      });
    } catch (err) {
      console.error('Error adding recipe:', err);
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      
      dispatch({
        type: RECIPE_ERROR,
        payload: err.response?.data?.msg || 'Error adding recipe'
      });
    }
  };

  // Delete Recipe
  const deleteRecipe = async id => {
    try {
      setLoading();
      console.log('Deleting recipe with ID:', id);
      
      await axios.delete(`/api/recipes/${id}`);
      console.log('Recipe deleted successfully');

      dispatch({
        type: DELETE_RECIPE,
        payload: id
      });
    } catch (err) {
      console.error('Error deleting recipe:', err);
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      
      dispatch({
        type: RECIPE_ERROR,
        payload: err.response?.data?.msg || 'Error deleting recipe'
      });
    }
  };

  // Update Recipe
  const updateRecipe = async recipe => {
    try {
      setLoading();
      console.log('Updating recipe:', recipe.name);
      
      // Check if image is a base64 string (from file upload)
      if (recipe.image && recipe.image.length > 1000) {
        console.log('Recipe contains a base64 image, length:', recipe.image.length);
      }
      
      // Check if videoUrl is present
      if (recipe.videoUrl) {
        console.log('Recipe contains a video URL:', recipe.videoUrl);
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const res = await axios.put(`/api/recipes/${recipe._id}`, recipe, config);
      console.log('Recipe updated successfully:', res.data);
      console.log('Saved image:', res.data.image ? 'Yes' : 'No');
      console.log('Saved videoUrl:', res.data.videoUrl ? 'Yes' : 'No');

      dispatch({
        type: UPDATE_RECIPE,
        payload: res.data
      });
    } catch (err) {
      console.error('Error updating recipe:', err);
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      
      dispatch({
        type: RECIPE_ERROR,
        payload: err.response?.data?.msg || 'Error updating recipe'
      });
    }
  };

  // Clear Recipes
  const clearRecipes = () => {
    dispatch({ type: CLEAR_RECIPES });
  };

  // Set Current Recipe
  const setCurrentRecipe = recipe => {
    dispatch({ type: SET_CURRENT_RECIPE, payload: recipe });
  };

  // Clear Current Recipe
  const clearCurrentRecipe = () => {
    dispatch({ type: CLEAR_CURRENT_RECIPE });
  };

  // Filter Recipes
  const filterRecipes = text => {
    dispatch({ type: FILTER_RECIPES, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <RecipeContext.Provider
      value={{
        recipes: state.recipes,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getRecipes,
        getRecipe,
        addRecipe,
        deleteRecipe,
        updateRecipe,
        clearRecipes,
        setCurrentRecipe,
        clearCurrentRecipe,
        filterRecipes,
        clearFilter
      }}
    >
      {props.children}
    </RecipeContext.Provider>
  );
};

export default RecipeState; 