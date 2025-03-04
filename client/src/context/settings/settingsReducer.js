import {
  GET_SETTINGS,
  UPDATE_SETTINGS,
  SETTINGS_ERROR,
  SET_SETTINGS_LOADING,
  SET_CURRENCY_SYMBOL,
  SET_THOUSAND_SEPARATOR
} from '../types';

const settingsReducer = (state, action) => {
  switch (action.type) {
    case GET_SETTINGS:
      return {
        ...state,
        settings: action.payload,
        loading: false
      };
    case UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        },
        loading: false
      };
    case SETTINGS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case SET_SETTINGS_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_CURRENCY_SYMBOL:
      return {
        ...state,
        settings: {
          ...state.settings,
          currencySymbol: action.payload
        }
      };
    case SET_THOUSAND_SEPARATOR:
      return {
        ...state,
        settings: {
          ...state.settings,
          thousandSeparator: action.payload
        }
      };
    default:
      return state;
  }
};

export default settingsReducer; 