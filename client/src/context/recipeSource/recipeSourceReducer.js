import {
  GET_RECIPE_SOURCES,
  ADD_RECIPE_SOURCE,
  DELETE_RECIPE_SOURCE,
  SET_CURRENT_RECIPE_SOURCE,
  CLEAR_CURRENT_RECIPE_SOURCE,
  UPDATE_RECIPE_SOURCE,
  RECIPE_SOURCE_ERROR,
  CLEAR_RECIPE_SOURCES,
  CLEAR_RECIPE_SOURCE_FILTER,
  FILTER_RECIPE_SOURCES,
  SET_LOADING
} from '../types';

const recipeSourceReducer = (state, action) => {
  switch (action.type) {
    case GET_RECIPE_SOURCES:
      return {
        ...state,
        recipeSources: action.payload,
        loading: false
      };
    case ADD_RECIPE_SOURCE:
      return {
        ...state,
        recipeSources: [action.payload, ...state.recipeSources],
        loading: false
      };
    case UPDATE_RECIPE_SOURCE:
      return {
        ...state,
        recipeSources: state.recipeSources.map(source =>
          source._id === action.payload._id ? action.payload : source
        ),
        loading: false
      };
    case DELETE_RECIPE_SOURCE:
      return {
        ...state,
        recipeSources: state.recipeSources.filter(
          source => source._id !== action.payload
        ),
        loading: false
      };
    case SET_CURRENT_RECIPE_SOURCE:
      return {
        ...state,
        current: action.payload
      };
    case CLEAR_CURRENT_RECIPE_SOURCE:
      return {
        ...state,
        current: null
      };
    case FILTER_RECIPE_SOURCES:
      return {
        ...state,
        filtered: state.recipeSources.filter(source => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return source.name.match(regex) || source.url.match(regex);
        })
      };
    case CLEAR_RECIPE_SOURCE_FILTER:
      return {
        ...state,
        filtered: null
      };
    case RECIPE_SOURCE_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case CLEAR_RECIPE_SOURCES:
      return {
        ...state,
        recipeSources: [],
        filtered: null,
        error: null,
        current: null
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

export default recipeSourceReducer; 