import React, { useReducer } from 'react';
import axios from 'axios';
import IngredientContext from './ingredientContext';
import ingredientReducer from './ingredientReducer';
import {
  GET_INGREDIENTS,
  GET_INGREDIENT,
  ADD_INGREDIENT,
  DELETE_INGREDIENT,
  DELETE_ALL_INGREDIENTS,
  UPDATE_INGREDIENT,
  CLEAR_INGREDIENTS,
  FILTER_INGREDIENTS,
  CLEAR_FILTER,
  INGREDIENT_ERROR,
  CLEAR_CURRENT,
  SET_CURRENT,
  SET_LOADING
} from '../types';

const IngredientState = props => {
  const initialState = {
    ingredients: [],
    current: null,
    filtered: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(ingredientReducer, initialState);

  // Get Ingredients
  const getIngredients = async () => {
    try {
      dispatch({ type: SET_LOADING });
      
      const res = await axios.get('/api/inventory');
      
      dispatch({
        type: GET_INGREDIENTS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: INGREDIENT_ERROR,
        payload: err.response?.data?.msg || 'Error fetching ingredients'
      });
    }
  };

  // Get Ingredient
  const getIngredient = async id => {
    try {
      dispatch({ type: SET_LOADING });
      
      const res = await axios.get(`/api/inventory/${id}`);
      
      dispatch({
        type: GET_INGREDIENT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: INGREDIENT_ERROR,
        payload: err.response?.data?.msg || 'Error fetching ingredient'
      });
    }
  };

  // Add Ingredient
  const addIngredient = async ingredient => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({ type: SET_LOADING });
      
      const res = await axios.post('/api/inventory', ingredient, config);
      
      dispatch({
        type: ADD_INGREDIENT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: INGREDIENT_ERROR,
        payload: err.response?.data?.msg || 'Error adding ingredient'
      });
    }
  };

  // Delete Ingredient
  const deleteIngredient = async id => {
    try {
      dispatch({ type: SET_LOADING });
      
      await axios.delete(`/api/inventory/${id}`);
      
      dispatch({
        type: DELETE_INGREDIENT,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: INGREDIENT_ERROR,
        payload: err.response?.data?.msg || 'Error deleting ingredient'
      });
    }
  };

  // Update Ingredient
  const updateIngredient = async ingredient => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({ type: SET_LOADING });
      
      const res = await axios.put(
        `/api/inventory/${ingredient._id}`,
        ingredient,
        config
      );
      
      dispatch({
        type: UPDATE_INGREDIENT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: INGREDIENT_ERROR,
        payload: err.response?.data?.msg || 'Error updating ingredient'
      });
    }
  };

  // Clear Ingredients
  const clearIngredients = () => {
    dispatch({ type: CLEAR_INGREDIENTS });
  };

  // Set Current Ingredient
  const setCurrent = ingredient => {
    dispatch({ type: SET_CURRENT, payload: ingredient });
  };

  // Clear Current Ingredient
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Filter Ingredients
  const filterIngredients = text => {
    dispatch({ type: FILTER_INGREDIENTS, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  // Delete All Ingredients
  const deleteAllIngredients = async () => {
    try {
      dispatch({ type: SET_LOADING });
      
      await axios.delete('/api/inventory/all');
      
      dispatch({
        type: DELETE_ALL_INGREDIENTS
      });
    } catch (err) {
      dispatch({
        type: INGREDIENT_ERROR,
        payload: err.response?.data?.msg || 'Error deleting all ingredients'
      });
    }
  };

  return (
    <IngredientContext.Provider
      value={{
        ingredients: state.ingredients,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getIngredients,
        getIngredient,
        addIngredient,
        deleteIngredient,
        deleteAllIngredients,
        updateIngredient,
        clearIngredients,
        setCurrent,
        clearCurrent,
        filterIngredients,
        clearFilter
      }}
    >
      {props.children}
    </IngredientContext.Provider>
  );
};

export default IngredientState; 