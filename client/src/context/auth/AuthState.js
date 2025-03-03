import React, { useReducer } from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_ERRORS
} from '../types';

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token') || 'dummy-token-for-development',
    isAuthenticated: true, // Always authenticated for development
    loading: false,
    user: {
      _id: 'mock-user-id',
      name: 'Development User',
      email: 'dev@example.com',
      role: 'admin',
      date: new Date().toISOString()
    },
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User - mocked version
  const loadUser = async () => {
    console.log('AuthState: loadUser called (MOCKED)');
    
    // Simulate successful user load
    dispatch({
      type: USER_LOADED,
      payload: initialState.user
    });
    
    return true;
  };

  // Register User - mocked version
  const register = async formData => {
    console.log('AuthState: register called (MOCKED)');
    
    // Simulate successful registration
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token: 'dummy-token-for-development' }
    });
    
    loadUser();
    return true;
  };

  // Login User - mocked version
  const login = async formData => {
    console.log('AuthState: login called (MOCKED)');
    
    // Store token in localStorage
    localStorage.setItem('token', 'dummy-token-for-development');
    
    // Simulate successful login
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token: 'dummy-token-for-development' }
    });
    
    loadUser();
    return true;
  };

  // Logout - still functional
  const logout = () => {
    console.log('AuthState: logout called');
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
  };

  // Clear Errors - still functional
  const clearErrors = () => {
    console.log('AuthState: clearErrors called');
    dispatch({ type: CLEAR_ERRORS });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState; 