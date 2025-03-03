import React, { useReducer } from 'react';
import axios from 'axios';
import CostingContext from './costingContext';
import costingReducer from './costingReducer';
import {
  CALCULATE_RECIPE_COST,
  GET_COST_REPORTS,
  SAVE_COST_CALCULATION,
  DELETE_COST_CALCULATION,
  SET_CURRENT_CALCULATION,
  CLEAR_CURRENT_CALCULATION,
  COSTING_ERROR,
  SET_COSTING_LOADING
} from '../types';

const CostingState = props => {
  const initialState = {
    costReports: [],
    currentCalculation: null,
    error: null,
    loading: false
  };

  const [state, dispatch] = useReducer(costingReducer, initialState);

  // Calculate Recipe Cost
  const calculateRecipeCost = async (recipeId, options = {}) => {
    try {
      setLoading();
      
      // In a real application, this would be an API call
      // For now, we'll simulate the calculation
      
      // Get the recipe details
      const recipeRes = await axios.get(`/api/recipes/${recipeId}`);
      const recipe = recipeRes.data;
      
      // Calculate the cost based on ingredients
      let totalCost = 0;
      let ingredientCosts = [];
      
      for (const ingredient of recipe.ingredients) {
        // In a real app, we would get the actual cost from the ingredient data
        // For now, we'll use a random cost between $0.10 and $5.00 per unit
        const unitCost = Math.random() * 4.9 + 0.1;
        const cost = unitCost * ingredient.quantity;
        totalCost += cost;
        
        ingredientCosts.push({
          ingredientId: ingredient._id,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          unitCost: unitCost.toFixed(2),
          totalCost: cost.toFixed(2)
        });
      }
      
      // Calculate additional costs
      const laborCost = options.laborCost || 0;
      const overheadCost = options.overheadCost || 0;
      const packagingCost = options.packagingCost || 0;
      
      // Calculate total and per serving costs
      const additionalCosts = laborCost + overheadCost + packagingCost;
      const grandTotal = totalCost + additionalCosts;
      const costPerServing = recipe.servings ? grandTotal / recipe.servings : 0;
      
      // Calculate suggested selling price based on food cost percentage
      const targetFoodCostPercentage = options.targetFoodCostPercentage || 30; // Default 30%
      const suggestedPrice = (grandTotal / (targetFoodCostPercentage / 100)).toFixed(2);
      const suggestedPricePerServing = recipe.servings ? (suggestedPrice / recipe.servings).toFixed(2) : 0;
      
      // Calculate profit
      const profit = suggestedPrice - grandTotal;
      const profitMargin = (profit / parseFloat(suggestedPrice) * 100).toFixed(2);
      
      const calculation = {
        recipeId,
        recipeName: recipe.name,
        recipeServings: recipe.servings,
        date: new Date().toISOString(),
        ingredientCosts,
        totalIngredientCost: totalCost.toFixed(2),
        laborCost: laborCost.toFixed(2),
        overheadCost: overheadCost.toFixed(2),
        packagingCost: packagingCost.toFixed(2),
        totalCost: grandTotal.toFixed(2),
        costPerServing: costPerServing.toFixed(2),
        targetFoodCostPercentage,
        suggestedPrice,
        suggestedPricePerServing,
        profit: profit.toFixed(2),
        profitMargin
      };

      dispatch({
        type: CALCULATE_RECIPE_COST,
        payload: calculation
      });
      
      return calculation;
    } catch (err) {
      dispatch({
        type: COSTING_ERROR,
        payload: err.response ? err.response.data.msg : 'Error calculating recipe cost'
      });
    }
  };

  // Get Cost Reports
  const getCostReports = async () => {
    try {
      setLoading();
      const res = await axios.get('/api/costing/reports');

      dispatch({
        type: GET_COST_REPORTS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: COSTING_ERROR,
        payload: err.response ? err.response.data.msg : 'Error fetching cost reports'
      });
    }
  };

  // Save Cost Calculation
  const saveCostCalculation = async (calculation) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      setLoading();
      const res = await axios.post('/api/costing/reports', calculation, config);

      dispatch({
        type: SAVE_COST_CALCULATION,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: COSTING_ERROR,
        payload: err.response ? err.response.data.msg : 'Error saving calculation'
      });
    }
  };

  // Delete Cost Calculation
  const deleteCostCalculation = async (id) => {
    try {
      setLoading();
      await axios.delete(`/api/costing/reports/${id}`);

      dispatch({
        type: DELETE_COST_CALCULATION,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: COSTING_ERROR,
        payload: err.response ? err.response.data.msg : 'Error deleting calculation'
      });
    }
  };

  // Set Current Calculation
  const setCurrentCalculation = (calculation) => {
    dispatch({ type: SET_CURRENT_CALCULATION, payload: calculation });
  };

  // Clear Current Calculation
  const clearCurrentCalculation = () => {
    dispatch({ type: CLEAR_CURRENT_CALCULATION });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_COSTING_LOADING });

  return (
    <CostingContext.Provider
      value={{
        costReports: state.costReports,
        currentCalculation: state.currentCalculation,
        error: state.error,
        loading: state.loading,
        calculateRecipeCost,
        getCostReports,
        saveCostCalculation,
        deleteCostCalculation,
        setCurrentCalculation,
        clearCurrentCalculation
      }}
    >
      {props.children}
    </CostingContext.Provider>
  );
};

export default CostingState; 