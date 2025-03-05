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

export default (state, action) => {
  switch (action.type) {
    case GET_INGREDIENTS:
      return {
        ...state,
        ingredients: action.payload,
        loading: false
      };
    case GET_INGREDIENT:
      return {
        ...state,
        current: action.payload,
        loading: false
      };
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [action.payload, ...state.ingredients],
        loading: false
      };
    case UPDATE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.map(ingredient =>
          ingredient._id === action.payload._id ? action.payload : ingredient
        ),
        loading: false
      };
    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          ingredient => ingredient._id !== action.payload
        ),
        loading: false
      };
    case DELETE_ALL_INGREDIENTS:
      return {
        ...state,
        ingredients: [],
        loading: false
      };
    case CLEAR_INGREDIENTS:
      return {
        ...state,
        ingredients: null,
        filtered: null,
        error: null,
        current: null
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null
      };
    case FILTER_INGREDIENTS:
      return {
        ...state,
        filtered: state.ingredients.filter(ingredient => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return (
            ingredient.name.match(regex) || 
            (ingredient.supplier && ingredient.supplier.name && ingredient.supplier.name.match(regex))
          );
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case INGREDIENT_ERROR:
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