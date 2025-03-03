import React, { useReducer } from 'react';
import axios from 'axios';
import SupplierContext from './supplierContext';
import supplierReducer from './supplierReducer';
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

const SupplierState = props => {
  const initialState = {
    suppliers: [],
    current: null,
    filtered: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(supplierReducer, initialState);

  // Get Suppliers
  const getSuppliers = async () => {
    try {
      setLoading();
      const res = await axios.get('/api/suppliers');

      dispatch({
        type: GET_SUPPLIERS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: SUPPLIER_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Get Supplier
  const getSupplier = async id => {
    try {
      console.log('SupplierState: getSupplier called with ID:', id);
      setLoading();
      console.log('SupplierState: Making API request to:', `/api/suppliers/${id}`);
      const res = await axios.get(`/api/suppliers/${id}`);
      console.log('SupplierState: API response received:', res.data);

      dispatch({
        type: GET_SUPPLIER,
        payload: res.data
      });
    } catch (err) {
      console.error('SupplierState: Error in getSupplier:', err);
      console.error('SupplierState: Error response:', err.response);
      dispatch({
        type: SUPPLIER_ERROR,
        payload: err.response?.msg || 'Error fetching supplier'
      });
    }
  };

  // Add Supplier
  const addSupplier = async supplier => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      setLoading();
      const res = await axios.post('/api/suppliers', supplier, config);

      dispatch({
        type: ADD_SUPPLIER,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: SUPPLIER_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Delete Supplier
  const deleteSupplier = async id => {
    try {
      setLoading();
      await axios.delete(`/api/suppliers/${id}`);

      dispatch({
        type: DELETE_SUPPLIER,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: SUPPLIER_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Update Supplier
  const updateSupplier = async supplier => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      setLoading();
      const res = await axios.put(
        `/api/suppliers/${supplier._id}`,
        supplier,
        config
      );

      dispatch({
        type: UPDATE_SUPPLIER,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: SUPPLIER_ERROR,
        payload: err.response.msg
      });
    }
  };

  // Clear Suppliers
  const clearSuppliers = () => {
    dispatch({ type: CLEAR_SUPPLIERS });
  };

  // Set Current Supplier
  const setCurrentSupplier = supplier => {
    dispatch({ type: SET_CURRENT_SUPPLIER, payload: supplier });
  };

  // Clear Current Supplier
  const clearCurrentSupplier = () => {
    dispatch({ type: CLEAR_CURRENT_SUPPLIER });
  };

  // Filter Suppliers
  const filterSuppliers = text => {
    dispatch({ type: FILTER_SUPPLIERS, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <SupplierContext.Provider
      value={{
        suppliers: state.suppliers,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getSuppliers,
        getSupplier,
        addSupplier,
        deleteSupplier,
        updateSupplier,
        clearSuppliers,
        setCurrentSupplier,
        clearCurrentSupplier,
        filterSuppliers,
        clearFilter
      }}
    >
      {props.children}
    </SupplierContext.Provider>
  );
};

export default SupplierState; 