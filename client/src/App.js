import React, { Fragment, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

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

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#121212',
      light: '#3b3b3b',
      dark: '#000000',
    },
    secondary: {
      main: '#5c6bc0',
      light: '#8e99f3',
      dark: '#26418f',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#121212',
      secondary: '#545454',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 600, 
      fontSize: '2rem',
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem', 
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: factor => `${0.5 * factor}rem`,
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '2rem',
          paddingRight: '2rem',
          '@media (min-width: 600px)': {
            paddingLeft: '3rem',
            paddingRight: '3rem',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '0.5rem 1.5rem',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          transition: 'transform 0.2s ease-in-out, border-color 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '1.5rem',
          '&:last-child': {
            paddingBottom: '1.5rem',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.24)',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '1.5rem 0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Fragment>
            <Navbar />
            <Container maxWidth="xl">
              <Alerts />
              <Routes>
                <Route path="/about" element={<About />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
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
                <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
                <Route path="/settings" element={<PrivateRoute component={Settings} />} />
                <Route path="/" element={
                  localStorage.token ? <Dashboard /> : <Landing />
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>
          </Fragment>
        </Router>
      </ThemeProvider>
    );
  };

  return (
    <AlertState>
      <AuthState>
        <RecipeState>
          <IngredientState>
            <SupplierState>
              <CostingState>
                <ImportState>
                  <RecipeSourceState>
                    <SettingsState>
                      {renderApp()}
                    </SettingsState>
                  </RecipeSourceState>
                </ImportState>
              </CostingState>
            </SupplierState>
          </IngredientState>
        </RecipeState>
      </AuthState>
    </AlertState>
  );
};

export default App;
