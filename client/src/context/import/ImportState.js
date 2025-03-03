import React, { useReducer } from 'react';
import axios from 'axios';
import ImportContext from './importContext';
import importReducer from './importReducer';
import {
  IMPORT_SUCCESS,
  IMPORT_FAIL,
  CLEAR_IMPORT,
  SET_LOADING
} from '../types';

const ImportState = props => {
  const initialState = {
    importData: null,
    error: null,
    loading: false
  };

  const [state, dispatch] = useReducer(importReducer, initialState);

  // Import data from file
  const importFromFile = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      dispatch({ type: SET_LOADING });
      
      const res = await axios.post(`/api/import/${type}`, formData, config);
      
      dispatch({
        type: IMPORT_SUCCESS,
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: IMPORT_FAIL,
        payload: err.response?.data?.msg || 'Import failed'
      });
      throw err;
    }
  };

  // Clear import data
  const clearImport = () => {
    dispatch({ type: CLEAR_IMPORT });
  };

  return (
    <ImportContext.Provider
      value={{
        importData: state.importData,
        error: state.error,
        loading: state.loading,
        importFromFile,
        clearImport
      }}
    >
      {props.children}
    </ImportContext.Provider>
  );
};

export default ImportState; 