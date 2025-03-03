import {
  IMPORT_SUCCESS,
  IMPORT_FAIL,
  CLEAR_IMPORT,
  SET_LOADING
} from '../types';

const importReducer = (state, action) => {
  switch (action.type) {
    case IMPORT_SUCCESS:
      return {
        ...state,
        importData: action.payload,
        loading: false,
        error: null
      };
    case IMPORT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case CLEAR_IMPORT:
      return {
        ...state,
        importData: null,
        error: null,
        loading: false
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

export default importReducer; 