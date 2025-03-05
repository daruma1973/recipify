import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NotificationsIcon from '@mui/icons-material/Notifications';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  }
}));

const BrandLogo = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '-0.5px',
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main
  }
}));

const NavItem = styled(Button)(({ theme, active }) => ({
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    color: theme.palette.primary.main
  },
  ...(active && {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  })
}));

const MobileNavItem = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: 4,
  ...(active && {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    }
  })
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 38,
  height: 38,
  backgroundColor: theme.palette.primary.main,
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  border: '2px solid white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const Navbar = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  
  // Close drawer when path changes (mobile navigation)
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const handleUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleInventoryToggle = () => {
    setInventoryOpen(!inventoryOpen);
  };

  const closeUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const closeNotificationMenu = () => {
    setNotificationAnchor(null);
  };

  const onLogout = () => {
    logout();
    closeUserMenu();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  const authLinks = (
    <Fragment>
      {isMobile ? (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <NavItem 
            component={RouterLink} 
            to="/dashboard"
            active={isActive('/dashboard') ? 1 : 0}
            disableRipple
          >
            Dashboard
          </NavItem>
          
          <NavItem 
            component={RouterLink} 
            to="/recipes"
            active={isActive('/recipes') ? 1 : 0}
            disableRipple
          >
            Recipes
          </NavItem>
          
          <NavItem 
            component={RouterLink} 
            to="/inventory"
            active={isActive('/inventory') ? 1 : 0}
            disableRipple
          >
            Inventory
          </NavItem>
          
          <NavItem 
            component={RouterLink} 
            to="/suppliers"
            active={isActive('/suppliers') ? 1 : 0}
            disableRipple
          >
            Suppliers
          </NavItem>
        </Box>
      )}

      {/* Notification Icon & Menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
        <Tooltip title="Notifications">
          <IconButton 
            onClick={handleNotificationMenu}
            size="large"
            color="inherit"
            sx={{ mr: 1, color: 'text.secondary' }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={closeNotificationMenu}
          PaperProps={{
            sx: {
              width: 320,
              maxWidth: '100%',
              mt: 1.5,
              borderRadius: 2,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'visible',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                borderTop: '1px solid',
                borderLeft: '1px solid',
                borderColor: 'divider',
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
          <Divider />
          
          {/* Example notifications */}
          <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
            <MenuItem sx={{ py: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Low stock alert: Salt
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  2 hours ago
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            
            <MenuItem sx={{ py: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  New recipe added by John
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Yesterday
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            
            <MenuItem sx={{ py: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Supplier order confirmed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  3 days ago
                </Typography>
              </Box>
            </MenuItem>
          </Box>
          
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            <Button size="small" sx={{ width: '100%' }}>
              View All
            </Button>
          </Box>
        </Menu>

        {/* User Avatar & Menu */}
        <Tooltip title="Account">
          <Box onClick={handleUserMenu} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <UserAvatar>{getUserInitials()}</UserAvatar>
            {!isSmall && (
              <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
                  {user?.role === 'admin' ? 'Administrator' : 'Chef'}
                </Typography>
              </Box>
            )}
          </Box>
        </Tooltip>
        
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={closeUserMenu}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: 2,
              minWidth: 200,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem component={RouterLink} to="/profile" onClick={closeUserMenu} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem component={RouterLink} to="/settings" onClick={closeUserMenu} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={onLogout} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: '0 16px 16px 0',
            px: 2,
            py: 2
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <BrandLogo variant="h6">
            <RestaurantMenuIcon />
            Recipify
          </BrandLogo>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {user && (
          <Box sx={{ mb: 3, px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <UserAvatar sx={{ width: 42, height: 42, mr: 1.5 }}>{getUserInitials()}</UserAvatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        <List component="nav" sx={{ mb: 2 }}>
          <MobileNavItem
            component={RouterLink}
            to="/dashboard"
            active={isActive('/dashboard') ? 1 : 0}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </MobileNavItem>
          
          <MobileNavItem
            component={RouterLink}
            to="/recipes"
            active={isActive('/recipes') ? 1 : 0}
          >
            <ListItemIcon>
              <RestaurantMenuIcon />
            </ListItemIcon>
            <ListItemText primary="Recipes" />
          </MobileNavItem>
          
          <MobileNavItem
            onClick={handleInventoryToggle}
            active={isActive('/inventory') ? 1 : 0}
          >
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
            {inventoryOpen ? <ExpandLess /> : <ExpandMore />}
          </MobileNavItem>
          
          <Collapse in={inventoryOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <MobileNavItem
                component={RouterLink}
                to="/inventory"
                active={location.pathname === '/inventory' ? 1 : 0}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <InventoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="All Items" />
              </MobileNavItem>
              
              <MobileNavItem
                component={RouterLink}
                to="/inventory/take"
                active={location.pathname === '/inventory/take' ? 1 : 0}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <CheckBoxIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Take Inventory" />
              </MobileNavItem>
              
              <MobileNavItem
                component={RouterLink}
                to="/inventory/locations"
                active={location.pathname === '/inventory/locations' ? 1 : 0}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <LocationOnIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Locations" />
              </MobileNavItem>
            </List>
          </Collapse>
          
          <MobileNavItem
            component={RouterLink}
            to="/suppliers"
            active={isActive('/suppliers') ? 1 : 0}
          >
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText primary="Suppliers" />
          </MobileNavItem>
          
          <Divider sx={{ my: 1.5 }} />
          
          <MobileNavItem
            component={RouterLink}
            to="/settings"
            active={isActive('/settings') ? 1 : 0}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MobileNavItem>
          
          <MobileNavItem
            component={RouterLink}
            to="/about"
            active={isActive('/about') ? 1 : 0}
          >
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </MobileNavItem>
          
          <MobileNavItem onClick={onLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MobileNavItem>
        </List>
      </Drawer>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <NavItem component={RouterLink} to="/register" disableRipple>
        Register
      </NavItem>
      <NavItem component={RouterLink} to="/login" disableRipple>
        Login
      </NavItem>
    </Fragment>
  );

  return (
    <StyledAppBar position="sticky" color="default">
      <Container maxWidth="xl" disableGutters>
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <BrandLogo variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
            <RestaurantMenuIcon />
            Recipify
          </BrandLogo>
          
          <Box sx={{ ml: { xs: 1, md: 4 }, flexGrow: 1, display: 'flex' }}>
            {isAuthenticated ? authLinks : guestLinks}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar; 