import React, { useReducer } from 'react';
import axios from 'axios';
import RecipeSourceContext from './recipeSourceContext';
import recipeSourceReducer from './recipeSourceReducer';
import {
  GET_RECIPE_SOURCES,
  ADD_RECIPE_SOURCE,
  DELETE_RECIPE_SOURCE,
  SET_CURRENT_RECIPE_SOURCE,
  CLEAR_CURRENT_RECIPE_SOURCE,
  UPDATE_RECIPE_SOURCE,
  FILTER_RECIPE_SOURCES,
  CLEAR_RECIPE_SOURCE_FILTER,
  RECIPE_SOURCE_ERROR,
  CLEAR_RECIPE_SOURCES,
  SET_LOADING
} from '../types';

const RecipeSourceState = props => {
  const initialState = {
    recipeSources: [],
    current: null,
    filtered: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(recipeSourceReducer, initialState);

  // Get Recipe Sources
  const getRecipeSources = async () => {
    try {
      dispatch({ type: SET_LOADING });
      const res = await axios.get('/api/recipe-sources');
      dispatch({ type: GET_RECIPE_SOURCES, payload: res.data });
    } catch (err) {
      dispatch({
        type: RECIPE_SOURCE_ERROR,
        payload: err.response?.data?.msg || 'Error fetching recipe sources'
      });
    }
  };

  // Add Recipe Source
  const addRecipeSource = async recipeSource => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({ type: SET_LOADING });
      const res = await axios.post('/api/recipe-sources', recipeSource, config);
      dispatch({ type: ADD_RECIPE_SOURCE, payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: RECIPE_SOURCE_ERROR,
        payload: err.response?.data?.msg || 'Error adding recipe source'
      });
      throw err;
    }
  };

  // Delete Recipe Source
  const deleteRecipeSource = async id => {
    try {
      dispatch({ type: SET_LOADING });
      await axios.delete(`/api/recipe-sources/${id}`);
      dispatch({ type: DELETE_RECIPE_SOURCE, payload: id });
    } catch (err) {
      dispatch({
        type: RECIPE_SOURCE_ERROR,
        payload: err.response?.data?.msg || 'Error deleting recipe source'
      });
    }
  };

  // Update Recipe Source
  const updateRecipeSource = async recipeSource => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({ type: SET_LOADING });
      const res = await axios.put(
        `/api/recipe-sources/${recipeSource._id}`,
        recipeSource,
        config
      );
      dispatch({ type: UPDATE_RECIPE_SOURCE, payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: RECIPE_SOURCE_ERROR,
        payload: err.response?.data?.msg || 'Error updating recipe source'
      });
      throw err;
    }
  };

  // Set Current Recipe Source
  const setCurrentRecipeSource = recipeSource => {
    dispatch({ type: SET_CURRENT_RECIPE_SOURCE, payload: recipeSource });
  };

  // Clear Current Recipe Source
  const clearCurrentRecipeSource = () => {
    dispatch({ type: CLEAR_CURRENT_RECIPE_SOURCE });
  };

  // Filter Recipe Sources
  const filterRecipeSources = text => {
    dispatch({ type: FILTER_RECIPE_SOURCES, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_RECIPE_SOURCE_FILTER });
  };

  // Clear Recipe Sources
  const clearRecipeSources = () => {
    dispatch({ type: CLEAR_RECIPE_SOURCES });
  };

  return (
    <RecipeSourceContext.Provider
      value={{
        recipeSources: state.recipeSources,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getRecipeSources,
        addRecipeSource,
        deleteRecipeSource,
        setCurrentRecipeSource,
        clearCurrentRecipeSource,
        updateRecipeSource,
        filterRecipeSources,
        clearFilter,
        clearRecipeSources
      }}
    >
      {props.children}
    </RecipeSourceContext.Provider>
  );
};

export default RecipeSourceState; 