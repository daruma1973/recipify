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

export default (state, action) => {
  switch (action.type) {
    case GET_RECIPES:
      return {
        ...state,
        recipes: action.payload,
        loading: false
      };
    case GET_RECIPE:
      return {
        ...state,
        current: action.payload,
        loading: false
      };
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [action.payload, ...state.recipes],
        loading: false
      };
    case UPDATE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe._id === action.payload._id ? action.payload : recipe
        ),
        loading: false
      };
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(
          recipe => recipe._id !== action.payload
        ),
        loading: false
      };
    case CLEAR_RECIPES:
      return {
        ...state,
        recipes: null,
        filtered: null,
        error: null,
        current: null
      };
    case SET_CURRENT_RECIPE:
      return {
        ...state,
        current: action.payload
      };
    case CLEAR_CURRENT_RECIPE:
      return {
        ...state,
        current: null
      };
    case FILTER_RECIPES:
      return {
        ...state,
        filtered: state.recipes.filter(recipe => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return (
            recipe.name.match(regex) || 
            (recipe.category && recipe.category.match(regex)) ||
            (recipe.description && recipe.description.match(regex))
          );
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case RECIPE_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}; 