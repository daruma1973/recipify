import React, { useReducer } from 'react';
import axios from 'axios';
import SettingsContext from './settingsContext';
import settingsReducer from './settingsReducer';
import {
  GET_SETTINGS,
  UPDATE_SETTINGS,
  SETTINGS_ERROR,
  SET_SETTINGS_LOADING
} from '../types';

const SettingsState = props => {
  const initialState = {
    settings: {
      companyName: 'Restaurant',
      country: 'UK',
      fiscalYearStart: '1st April',
      timeZone: 'Europe/London',
      startOfBusinessDay: '09:00',
      dateFormat: 'D d M Y',
      timeFormat: 'h:i A',
      displayDateWithTime: 'Yes',
      currencySymbol: '£',
      currencyCode: 'GBP',
      taxVat: '20.00',
      wastage: '4.00',
      criticalControl: 'All our products are produced in one central kitchen.\nTherefore there maybe NUT traces in all of our foods.\nCheck quality of all ingredients.\nStore raw and cooked foods separately.\nKeep raw and cooked foods separated at all times.\nWhen food is prepped return to fridge immediately.\nFrequently wash hands.\nCook food to at least 75°c.\nIf reheating food cook to 75°c and keep hot above 63°c.\nAlways label and date all food products.\nKeep foods covered at all time when storing with cling film or covers.',
      logo: 'logo.png',
      isCPU: 'No',
      thousandSeparator: 'Yes'
    },
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Get settings
  const getSettings = async () => {
    try {
      setLoading();

      // In a real app, this would be an API call to fetch settings
      // const res = await axios.get('/api/settings');
      // dispatch({ type: GET_SETTINGS, payload: res.data });

      // For now, we'll use the default settings
      dispatch({ type: GET_SETTINGS, payload: initialState.settings });
    } catch (err) {
      dispatch({
        type: SETTINGS_ERROR,
        payload: err.response?.data?.msg || 'Error fetching settings'
      });
    }
  };

  // Update settings
  const updateSettings = async (updatedSettings) => {
    try {
      setLoading();

      // In a real app, this would be an API call to update settings
      // const res = await axios.put('/api/settings', updatedSettings);
      // dispatch({ type: UPDATE_SETTINGS, payload: res.data });

      // For now, we'll just update the state directly
      dispatch({ type: UPDATE_SETTINGS, payload: updatedSettings });

      // If we're updating the currency symbol, we need to pass this to all components
      if (updatedSettings.currencySymbol) {
        console.log(`Currency symbol updated to ${updatedSettings.currencySymbol}`);
        // In a real app, you might want to save this to localStorage as well
        localStorage.setItem('currencySymbol', updatedSettings.currencySymbol);
      }

      return true;
    } catch (err) {
      dispatch({
        type: SETTINGS_ERROR,
        payload: err.response?.data?.msg || 'Error updating settings'
      });
      return false;
    }
  };

  // Set loading
  const setLoading = () => dispatch({ type: SET_SETTINGS_LOADING });

  return (
    <SettingsContext.Provider
      value={{
        settings: state.settings,
        loading: state.loading,
        error: state.error,
        getSettings,
        updateSettings
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};

export default SettingsState; 