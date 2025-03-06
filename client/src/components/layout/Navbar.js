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
import LocalBarIcon from '@mui/icons-material/LocalBar';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
  fontWeight: 600,
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    color: theme.palette.primary.main
  },
  ...(active && {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '30%',
      height: '3px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '3px 3px 0 0',
    }
  })
}));

const MobileNavItem = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: 4,
  ...(active && {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
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
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  border: '2px solid white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    fontWeight: 'bold',
    boxShadow: '0 0 0 2px white',
  }
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
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
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </NavItem>
          
          <NavItem 
            component={RouterLink} 
            to="/recipes"
            active={isActive('/recipes') ? 1 : 0}
            disableRipple
            startIcon={<LocalBarIcon />}
          >
            Cocktails
          </NavItem>
          
          <NavItem 
            component={RouterLink} 
            to="/inventory"
            active={isActive('/inventory') ? 1 : 0}
            disableRipple
            startIcon={<InventoryIcon />}
          >
            Bar Stock
          </NavItem>
          
          <NavItem 
            component={RouterLink} 
            to="/suppliers"
            active={isActive('/suppliers') ? 1 : 0}
            disableRipple
            startIcon={<LocalShippingIcon />}
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
            <NotificationBadge badgeContent={3} color="error">
              <NotificationsIcon />
            </NotificationBadge>
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
              boxShadow: theme.shadows[3],
              borderRadius: 2,
              '& .MuiList-root': {
                p: 1,
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
          </Box>
          
          <MenuItem onClick={closeNotificationMenu} sx={{ borderRadius: 1, py: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" fontWeight={600}>Low stock alert</Typography>
              <Typography variant="caption" color="text.secondary">
                Flour is running low (2kg remaining)
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem onClick={closeNotificationMenu} sx={{ borderRadius: 1, py: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" fontWeight={600}>Order reminder</Typography>
              <Typography variant="caption" color="text.secondary">
                Place your weekly order with Supplier A
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem onClick={closeNotificationMenu} sx={{ borderRadius: 1, py: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" fontWeight={600}>Recipe update</Typography>
              <Typography variant="caption" color="text.secondary">
                Chocolate Cake recipe was updated
              </Typography>
            </Box>
          </MenuItem>
          
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button 
              component={RouterLink} 
              to="/notifications" 
              size="small" 
              sx={{ width: '100%', borderRadius: 1 }}
            >
              View all notifications
            </Button>
          </Box>
        </Menu>

        {/* User Avatar & Menu */}
        <Tooltip title={user?.name || 'Account'}>
          <UserAvatar onClick={handleUserMenu}>
            {getUserInitials()}
          </UserAvatar>
        </Tooltip>
        
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={closeUserMenu}
          PaperProps={{
            sx: {
              width: 220,
              maxWidth: '100%',
              mt: 1.5,
              boxShadow: theme.shadows[3],
              borderRadius: 2,
              '& .MuiList-root': {
                p: 1,
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem 
            component={RouterLink} 
            to="/profile" 
            onClick={closeUserMenu}
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          
          <MenuItem 
            component={RouterLink} 
            to="/settings" 
            onClick={closeUserMenu}
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem 
            onClick={onLogout}
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </Box>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
        <Button 
          component={RouterLink} 
          to="/login" 
          variant="outlined" 
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          Login
        </Button>
        <Button 
          component={RouterLink} 
          to="/register" 
          variant="contained" 
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          Register
        </Button>
      </Box>
    </Fragment>
  );

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <DrawerHeader>
        <BrandLogo variant="h6">
          Recipify
        </BrandLogo>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
        <List component="nav" sx={{ width: '100%' }}>
          <MobileNavItem
            component={RouterLink}
            to="/dashboard"
            active={isActive('/dashboard') ? 1 : 0}
          >
            <ListItemIcon>
              <DashboardIcon color={isActive('/dashboard') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </MobileNavItem>
          
          <MobileNavItem
            component={RouterLink}
            to="/recipes"
            active={isActive('/recipes') ? 1 : 0}
          >
            <ListItemIcon>
              <LocalBarIcon color={isActive('/recipes') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Cocktails" />
          </MobileNavItem>
          
          <MobileNavItem
            onClick={handleInventoryToggle}
            active={isActive('/inventory') ? 1 : 0}
          >
            <ListItemIcon>
              <InventoryIcon color={isActive('/inventory') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Bar Stock" />
            {inventoryOpen ? <ExpandLess /> : <ExpandMore />}
          </MobileNavItem>
          
          <Collapse in={inventoryOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <MobileNavItem
                component={RouterLink}
                to="/inventory"
                sx={{ pl: 4 }}
                active={location.pathname === '/inventory' ? 1 : 0}
              >
                <ListItemIcon>
                  <InventoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="All Products" />
              </MobileNavItem>
              
              <MobileNavItem
                component={RouterLink}
                to="/inventory/take"
                sx={{ pl: 4 }}
                active={location.pathname === '/inventory/take' ? 1 : 0}
              >
                <ListItemIcon>
                  <CheckBoxIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Take Inventory" />
              </MobileNavItem>
              
              <MobileNavItem
                component={RouterLink}
                to="/inventory/locations"
                sx={{ pl: 4 }}
                active={location.pathname === '/inventory/locations' ? 1 : 0}
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
              <LocalShippingIcon color={isActive('/suppliers') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Suppliers" />
          </MobileNavItem>
          
          <Divider sx={{ my: 2 }} />
          
          <MobileNavItem
            component={RouterLink}
            to="/settings"
            active={isActive('/settings') ? 1 : 0}
          >
            <ListItemIcon>
              <SettingsIcon color={isActive('/settings') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MobileNavItem>
          
          <MobileNavItem
            component={RouterLink}
            to="/about"
            active={isActive('/about') ? 1 : 0}
          >
            <ListItemIcon>
              <InfoIcon color={isActive('/about') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="About" />
          </MobileNavItem>
        </List>
      </Box>
      
      {isAuthenticated && (
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Fragment>
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            <BrandLogo variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none', mr: 3 }}>
              Recipify
            </BrandLogo>
            
            {isAuthenticated ? authLinks : guestLinks}
          </Toolbar>
        </Container>
      </StyledAppBar>
      
      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ 
          sx: { 
            width: 280,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          } 
        }}
      >
        {drawerContent}
      </Drawer>
    </Fragment>
  );
};

export default Navbar; 