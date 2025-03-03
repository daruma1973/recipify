import React, { Fragment, useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
  Divider,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [inventoryMenuAnchorEl, setInventoryMenuAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleInventoryMenu = (event) => {
    setInventoryMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleInventoryMenuClose = () => {
    setInventoryMenuAnchorEl(null);
  };

  const onLogout = () => {
    logout();
    handleClose();
    handleMobileMenuClose();
    handleInventoryMenuClose();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const authLinks = (
    <Fragment>
      {isMobile ? (
        <Fragment>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenu}
            sx={{ ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={mobileMenuAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(mobileMenuAnchorEl)}
            onClose={handleMobileMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: 'divider',
                minWidth: 200
              }
            }}
          >
            <MenuItem component={RouterLink} to="/dashboard" onClick={handleMobileMenuClose}>
              Dashboard
            </MenuItem>
            
            {/* Inventory Menu Items for Mobile */}
            <MenuItem 
              component={RouterLink} 
              to="/inventory" 
              onClick={handleMobileMenuClose}
              sx={{ fontWeight: 600 }}
            >
              Inventory
            </MenuItem>
            <MenuItem 
              component={RouterLink} 
              to="/inventory" 
              onClick={handleMobileMenuClose}
              sx={{ pl: 4 }}
            >
              <InventoryIcon fontSize="small" sx={{ mr: 1 }} />
              Inventory Items
            </MenuItem>
            <MenuItem 
              component={RouterLink} 
              to="/inventory/take" 
              onClick={handleMobileMenuClose}
              sx={{ pl: 4 }}
            >
              <CheckBoxIcon fontSize="small" sx={{ mr: 1 }} />
              Take Inventory
            </MenuItem>
            <MenuItem 
              component={RouterLink} 
              to="/inventory/locations" 
              onClick={handleMobileMenuClose}
              sx={{ pl: 4 }}
            >
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
              Manage Locations
            </MenuItem>
            
            <MenuItem component={RouterLink} to="/suppliers" onClick={handleMobileMenuClose}>
              Suppliers
            </MenuItem>
            <MenuItem component={RouterLink} to="/recipes" onClick={handleMobileMenuClose}>
              Recipes
            </MenuItem>
            <MenuItem component={RouterLink} to="/about" onClick={handleMobileMenuClose}>
              About
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>
        </Fragment>
      ) : (
        <Fragment>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/dashboard"
              sx={{ 
                mx: 1,
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'transparent',
                  color: 'primary.main'
                }
              }}
            >
              Dashboard
            </Button>
            
            {/* Inventory Dropdown for Desktop */}
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Button 
                color="inherit"
                aria-controls="inventory-menu"
                aria-haspopup="true"
                onClick={handleInventoryMenu} 
                endIcon={<ArrowDropDownIcon />}
                sx={{ 
                  mx: 1,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'primary.main'
                  }
                }}
              >
                Inventory
              </Button>
              <Menu
                id="inventory-menu"
                anchorEl={inventoryMenuAnchorEl}
                keepMounted
                open={Boolean(inventoryMenuAnchorEl)}
                onClose={handleInventoryMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid',
                    borderColor: 'divider',
                    minWidth: 200
                  }
                }}
              >
                <MenuItem 
                  component={RouterLink} 
                  to="/inventory" 
                  onClick={handleInventoryMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <InventoryIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                  Inventory Items
                </MenuItem>
                <MenuItem 
                  component={RouterLink} 
                  to="/inventory/take" 
                  onClick={handleInventoryMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <CheckBoxIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                  Take Inventory
                </MenuItem>
                <MenuItem 
                  component={RouterLink} 
                  to="/inventory/locations" 
                  onClick={handleInventoryMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <LocationOnIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                  Manage Locations
                </MenuItem>
              </Menu>
            </Box>
            
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/suppliers"
              sx={{ 
                mx: 1,
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'transparent',
                  color: 'primary.main'
                }
              }}
            >
              Suppliers
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/recipes"
              sx={{ 
                mx: 1,
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'transparent',
                  color: 'primary.main'
                }
              }}
            >
              Recipes
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/about"
              sx={{ 
                mx: 1,
                fontSize: '0.95rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'transparent',
                  color: 'primary.main'
                }
              }}
            >
              About
            </Button>
          </Box>
          
          <Box sx={{ ml: 3 }}>
            <Tooltip title="Account settings">
              <IconButton onClick={handleMenu} sx={{ p: 0, ml: 1 }}>
                <Avatar sx={{ 
                  width: 38, 
                  height: 38, 
                  bgcolor: 'secondary.main',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>
                  {getUserInitials()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: 1 }}
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid',
                  borderColor: 'divider',
                  minWidth: 180
                }
              }}
            >
              <MenuItem component={RouterLink} to="/profile" onClick={handleClose} sx={{ py: 1.5 }}>
                Profile
              </MenuItem>
              <MenuItem component={RouterLink} to="/settings" onClick={handleClose} sx={{ py: 1.5 }}>
                Settings
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={onLogout} sx={{ py: 1.5 }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Fragment>
      )}
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <Button 
        color="inherit" 
        component={RouterLink} 
        to="/login"
        variant="text"
        sx={{ 
          mx: 1,
          fontSize: '0.95rem',
          fontWeight: 500,
          '&:hover': {
            bgcolor: 'transparent',
            color: 'primary.main'
          }
        }}
      >
        Login
      </Button>
      <Button 
        variant="contained"
        color="primary" 
        component={RouterLink} 
        to="/register"
        sx={{ 
          ml: 2,
          borderRadius: 2,
          px: 3
        }}
      >
        Register
      </Button>
    </Fragment>
  );

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            py: 2,
            px: { xs: 1, sm: 2 }
          }}
        >
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <RestaurantMenuIcon sx={{ mr: 1.5, fontSize: 28 }} />
            RECIPIFY
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {isAuthenticated ? authLinks : guestLinks}
          
          <Tooltip title="Toggle theme">
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <LightModeIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 