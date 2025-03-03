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

export default (state, action) => {
  switch (action.type) {
    case CALCULATE_RECIPE_COST:
      return {
        ...state,
        currentCalculation: action.payload,
        loading: false
      };
    case GET_COST_REPORTS:
      return {
        ...state,
        costReports: action.payload,
        loading: false
      };
    case SAVE_COST_CALCULATION:
      return {
        ...state,
        costReports: [action.payload, ...state.costReports],
        loading: false
      };
    case DELETE_COST_CALCULATION:
      return {
        ...state,
        costReports: state.costReports.filter(
          report => report._id !== action.payload
        ),
        loading: false
      };
    case SET_CURRENT_CALCULATION:
      return {
        ...state,
        currentCalculation: action.payload
      };
    case CLEAR_CURRENT_CALCULATION:
      return {
        ...state,
        currentCalculation: null
      };
    case COSTING_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case SET_COSTING_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}; 