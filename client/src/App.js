import React, { Fragment, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

// Import our Honk-inspired theme
import honkTheme from './utils/honkTheme';

// Components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profile from './components/auth/Profile';
import Dashboard from './components/pages/Dashboard';
import Alerts from './components/layout/Alerts';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFound from './components/pages/NotFound';
import Landing from './components/pages/Landing';
import Settings from './components/pages/Settings';

// Ingredient Components
import Ingredients from './components/ingredients/Ingredients';
import IngredientForm from './components/ingredients/IngredientForm';
import IngredientDetail from './components/ingredients/IngredientDetail';
import TakeInventory from './components/ingredients/TakeInventory';
import ManageLocations from './components/ingredients/ManageLocations';
import ResetProducts from './components/ingredients/ResetProducts';
import NewProductSystem from './components/ingredients/NewProductSystem';
import ProductSystemReset from './components/ingredients/ProductSystemReset';

// Supplier Components
import Suppliers from './components/suppliers/Suppliers';
import SupplierForm from './components/suppliers/SupplierForm';
import SupplierDetail from './components/suppliers/SupplierDetail';

// Recipe Components
import Recipes from './components/recipes/Recipes';
import RecipeForm from './components/recipes/RecipeForm';
import RecipeDetail from './components/recipes/RecipeDetail';
import RecipeImport from './components/recipes/RecipeImport';

// Costing Components
import Costing from './components/costing/Costing';
import CostCalculator from './components/costing/CostCalculator';
import CostReports from './components/costing/CostReports';
import CostReportDetail from './components/costing/CostReportDetail';

// Context
import AuthContext from './context/auth/authContext';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import IngredientState from './context/ingredient/IngredientState';
import SupplierState from './context/supplier/SupplierState';
import RecipeState from './context/recipe/RecipeState';
import CostingState from './context/costing/CostingState';
import ImportState from './context/import/ImportState';
import RecipeSourceState from './context/recipeSource/RecipeSourceState';
import SettingsState from './context/settings/SettingsState';

// Utils
import setAuthToken from './utils/setAuthToken';

// Check for token in localStorage
if (localStorage.token) {
  console.log('App.js: Token found in localStorage, setting auth token');
  setAuthToken(localStorage.token);
} else {
  console.log('App.js: No token found in localStorage');
}

const App = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    // Check for token in localStorage when the app loads
    if (localStorage.token) {
      console.log('App.js useEffect: Token found in localStorage, setting auth token');
      setAuthToken(localStorage.token);
    } else {
      console.log('App.js useEffect: No token found in localStorage');
    }
  }, []);

  // This will render the basic application structure
  const renderApp = () => {
    return (
      <ThemeProvider theme={honkTheme}>
        <CssBaseline />
        <Router>
          <Fragment>
            <Navbar />
            <Container maxWidth="xl">
              <Alerts />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
                <Route path="/inventory" element={<PrivateRoute component={Ingredients} />} />
                <Route path="/inventory/add" element={<PrivateRoute component={IngredientForm} />} />
                <Route path="/inventory/:id" element={<PrivateRoute component={IngredientDetail} />} />
                <Route path="/inventory/take" element={<PrivateRoute component={TakeInventory} />} />
                <Route path="/inventory/locations" element={<PrivateRoute component={ManageLocations} />} />
                <Route path="/suppliers" element={<PrivateRoute component={Suppliers} />} />
                <Route path="/suppliers/add" element={<PrivateRoute component={SupplierForm} />} />
                <Route path="/suppliers/:id" element={<PrivateRoute component={SupplierDetail} />} />
                <Route path="/recipes" element={<PrivateRoute component={Recipes} />} />
                <Route path="/recipes/add" element={<PrivateRoute component={RecipeForm} />} />
                <Route path="/recipes/edit/:id" element={<PrivateRoute component={RecipeForm} />} />
                <Route path="/recipes/import" element={<PrivateRoute component={RecipeImport} />} />
                <Route path="/recipes/:id" element={<PrivateRoute component={RecipeDetail} />} />
                <Route path="/settings" element={<PrivateRoute component={Settings} />} />
                <Route path="/profile" element={<PrivateRoute component={Profile} />} />
                <Route path="/reset-products" element={<PrivateRoute component={ResetProducts} />} />
                <Route path="/new-product-system" element={<PrivateRoute component={NewProductSystem} />} />
                <Route path="/product-system-reset" element={<PrivateRoute component={ProductSystemReset} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>
          </Fragment>
        </Router>
      </ThemeProvider>
    );
  };

  return (
    <AuthState>
      <AlertState>
        <IngredientState>
          <SupplierState>
            <RecipeState>
              <CostingState>
                <ImportState>
                  <RecipeSourceState>
                    <SettingsState>
                      {renderApp()}
                    </SettingsState>
                  </RecipeSourceState>
                </ImportState>
              </CostingState>
            </RecipeState>
          </SupplierState>
        </IngredientState>
      </AlertState>
    </AuthState>
  );
};

export default App;
