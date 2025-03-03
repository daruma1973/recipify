import {
  GET_SUPPLIERS,
  GET_SUPPLIER,
  ADD_SUPPLIER,
  DELETE_SUPPLIER,
  UPDATE_SUPPLIER,
  CLEAR_SUPPLIERS,
  FILTER_SUPPLIERS,
  CLEAR_FILTER,
  SUPPLIER_ERROR,
  SET_CURRENT_SUPPLIER,
  CLEAR_CURRENT_SUPPLIER,
  SET_LOADING
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_SUPPLIERS:
      return {
        ...state,
        suppliers: action.payload,
        loading: false
      };
    case GET_SUPPLIER:
      return {
        ...state,
        current: action.payload,
        loading: false
      };
    case ADD_SUPPLIER:
      return {
        ...state,
        suppliers: [action.payload, ...state.suppliers],
        loading: false
      };
    case UPDATE_SUPPLIER:
      return {
        ...state,
        suppliers: state.suppliers.map(supplier =>
          supplier._id === action.payload._id ? action.payload : supplier
        ),
        loading: false
      };
    case DELETE_SUPPLIER:
      return {
        ...state,
        suppliers: state.suppliers.filter(
          supplier => supplier._id !== action.payload
        ),
        loading: false
      };
    case CLEAR_SUPPLIERS:
      return {
        ...state,
        suppliers: null,
        filtered: null,
        error: null,
        current: null
      };
    case SET_CURRENT_SUPPLIER:
      return {
        ...state,
        current: action.payload
      };
    case CLEAR_CURRENT_SUPPLIER:
      return {
        ...state,
        current: null
      };
    case FILTER_SUPPLIERS:
      return {
        ...state,
        filtered: state.suppliers.filter(supplier => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return (
            supplier.name.match(regex) || 
            (supplier.contact && supplier.contact.match(regex)) ||
            (supplier.email && supplier.email.match(regex))
          );
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case SUPPLIER_ERROR:
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