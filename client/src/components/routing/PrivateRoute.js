import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const PrivateRoute = ({ component: Component }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  // For development purposes, we're bypassing authentication
  // In a production environment, you would use the commented code below
  console.log('PrivateRoute - Authentication bypassed');
  console.log('PrivateRoute - Component:', Component ? 'Component exists' : 'Component is null or undefined');
  
  if (!Component) {
    console.error('PrivateRoute - Component is null or undefined!');
    return <div>Error: The requested component could not be found. This page might not exist yet.</div>;
  }
  
  try {
    return <Component />;
  } catch (error) {
    console.error('PrivateRoute - Error rendering component:', error);
    return <div>Error rendering component: {error.message}</div>;
  }
  
  // Uncomment for production use with authentication
  /*
  if (loading) return <div>Loading...</div>;
  
  if (isAuthenticated) {
    return <Component />;
  } else {
    return <Navigate to="/login" />;
  }
  */
};

export default PrivateRoute; 