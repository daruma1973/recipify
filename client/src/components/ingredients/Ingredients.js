import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
  Popper,
  Checkbox,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Paper,
  Card,
  Avatar,
  Badge,
  Divider,
  TabScrollButton
} from '@mui/material';
import Container from '../layout/Container';
import BentoCard from '../common/BentoCard';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AuthContext from '../../context/auth/authContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';
import IngredientCSVUpload from './IngredientCSVUpload';
import CurrencyDisplay from '../common/CurrencyDisplay';

// Styled components for decorative elements
const DecorativeCircle = styled(Box)(({ theme, color = 'primary.main', size = 100, opacity = 0.1, top, left, right, bottom }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  backgroundColor: theme.palette[color.split('.')[0]][color.split('.')[1]] || color,
  opacity: opacity,
  top: top,
  left: left,
  right: right,
  bottom: bottom,
  zIndex: 0,
}));

const DecorativeShape = styled(Box)(({ theme, color = 'primary.main', opacity = 0.1, top, left, right, bottom, shape = 'square' }) => ({
  position: 'absolute',
  width: shape === 'square' ? 80 : 100,
  height: shape === 'square' ? 80 : 50,
  borderRadius: shape === 'square' ? 16 : shape === 'pill' ? 25 : '50%',
  backgroundColor: theme.palette[color.split('.')[0]][color.split('.')[1]] || color,
  opacity: opacity,
  top: top,
  left: left,
  right: right,
  bottom: bottom,
  zIndex: 0,
  transform: shape === 'square' ? 'rotate(20deg)' : 'none',
}));

// Styled components for inventory
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: theme.shadows[2],
  }
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
}));

const FilterSelect = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
}));

const StatusChip = styled(Chip)(({ theme, color = 'primary' }) => ({
  borderRadius: 16,
  fontWeight: 600,
  '&.MuiChip-filled': {
    backgroundColor: theme.palette[color].light,
    color: theme.palette[color].dark,
  }
}));

const StyledTableCell = styled(TableCell)(({ theme, align = 'left' }) => ({
  fontWeight: align === 'right' ? 400 : 500,
  padding: theme.spacing(1.5, 2),
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.grey[50], 
    color: theme.palette.text.secondary,
    fontSize: 14,
    fontWeight: 600
  }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: 4,
    borderRadius: 4,
  },
  '& .MuiTab-root': {
    minHeight: 56,
    fontWeight: 700,
    fontSize: 16,
    textTransform: 'none',
    borderRadius: '16px 16px 0 0',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    }
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  fontSize: 15,
  textTransform: 'none',
  '&.Mui-selected': {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  }
}));

const TabContent = styled(Box)(({ theme }) => ({
  minHeight: 300,
  padding: theme.spacing(2),
}));

const Ingredients = () => {
  const authContext = useContext(AuthContext);
  const ingredientContext = useContext(IngredientContext);
  const alertContext = useContext(AlertContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const { 
    ingredients, 
    filtered, 
    getIngredients, 
    filterIngredients, 
    clearFilter,
    loading,
    deleteIngredient,
    updateIngredient
  } = ingredientContext;
  const { setAlert } = alertContext;

  // Local state for pagination and filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Add state for quick edit dialog
  const [quickEditDialog, setQuickEditDialog] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [editFormData, setEditFormData] = useState({
    productFamily: '',
    category: '',
    subcategory: ''
  });

  // Categories
  const categories = Array.from(
    new Set(ingredients?.map(item => item.category).filter(Boolean) || [])
  ).sort();

  // Suppliers
  const suppliers = Array.from(
    new Set(ingredients?.map(item => item.supplier).filter(Boolean) || [])
  ).sort();

  // Is actions menu open
  const actionsMenuOpen = Boolean(actionsAnchorEl);

  // Are all items selected
  const isAllSelected = ingredients?.length > 0 && selected.length === ingredients.length;

  // Actions menu handlers
  const handleActionsClick = (event) => {
    setActionsAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  const handleActionSelect = (action) => {
    handleActionsClose();
    
    switch(action) {
      case 'delete':
        setConfirmBulkDelete(true);
        break;
      case 'merge':
        // Implement merge logic
        break;
      case 'setPars':
        // Implement setPars logic
        break;
      case 'setVendors':
        // Implement setVendors logic
        break;
      case 'setSize':
        // Implement setSize logic
        break;
      case 'setUnits':
        // Implement setUnits logic
        break;
      default:
        break;
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value !== '') {
      filterIngredients(e.target.value);
    } else if (categoryFilter === '' && supplierFilter === '') {
      clearFilter();
    }
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    filterIngredients(e.target.value);
  };

  // Handle supplier filter change
  const handleSupplierChange = (e) => {
    setSupplierFilter(e.target.value);
    filterIngredients(e.target.value);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Delete handlers
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteIngredient(confirmDelete);
      setAlert('Ingredient deleted successfully', 'success');
      setConfirmDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Import dialog handlers
  const handleImportOpen = () => {
    setImportDialogOpen(true);
  };

  const handleImportClose = () => {
    setImportDialogOpen(false);
    getIngredients(); // Refresh ingredients after import
  };

  // Export handler
  const handleExport = () => {
    // Implement CSV export
    setAlert('Export feature not implemented yet', 'info');
  };

  // Bulk selection handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = ingredients.map(ingredient => ingredient._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = [...selected.slice(1)];
    } else if (selectedIndex === selected.length - 1) {
      newSelected = [...selected.slice(0, -1)];
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Handle bulk delete confirmation
  const handleConfirmBulkDelete = () => {
    selected.forEach(id => {
      deleteIngredient(id);
    });
    setAlert(`Successfully deleted ${selected.length} items`, 'success');
    setSelected([]);
    setConfirmBulkDelete(false);
  };

  // Handle bulk delete cancellation
  const handleCancelBulkDelete = () => {
    setConfirmBulkDelete(false);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Product families and subcategories for dropdowns
  const productFamilies = ['Spirit', 'Wine', 'Beer', 'Soft Drink', 'Mixer', 'Raw Material', 'Consumable', 'Non-Consumable', 'Equipment', 'Other'];
  const subcategories = {
    'Spirit': ['Vodka', 'Gin', 'Whiskey', 'Rum', 'Tequila', 'Brandy', 'Liqueur', 'Other'],
    'Wine': ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Other'],
    'Beer': ['Lager', 'Ale', 'Stout', 'IPA', 'Wheat', 'Craft', 'Other'],
    'Soft Drink': ['Cola', 'Lemonade', 'Juice', 'Water', 'Energy Drink', 'Other'],
    'Mixer': ['Tonic', 'Soda', 'Juice', 'Syrup', 'Other'],
    'Raw Material': ['Vegetable', 'Fruit', 'Meat', 'Seafood', 'Grain', 'Herb', 'Spice', 'Other'],
    'Dairy': ['Milk', 'Cheese', 'Yogurt', 'Cream', 'Butter', 'Other'],
    'Meat': ['Beef', 'Pork', 'Chicken', 'Lamb', 'Game', 'Other'],
    'Seafood': ['Fish', 'Shellfish', 'Crustacean', 'Other'],
    'Produce': ['Vegetable', 'Fruit', 'Herb', 'Other'],
    'Other': ['Miscellaneous']
  };

  // Handle opening the quick edit dialog
  const handleQuickEditOpen = (ingredient) => {
    setEditingIngredient(ingredient);
    setEditFormData({
      productFamily: ingredient.productFamily || '',
      category: ingredient.category || '',
      subcategory: ingredient.subcategory || ''
    });
    setQuickEditDialog(true);
  };

  // Handle closing the quick edit dialog
  const handleQuickEditClose = () => {
    setQuickEditDialog(false);
  };

  // Handle form field changes in quick edit
  const handleQuickEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
      // Clear subcategory if family or category changes
      ...(name === 'productFamily' || name === 'category' ? { subcategory: '' } : {})
    });
  };

  // Handle saving the quick edit changes
  const handleQuickEditSave = () => {
    if (editingIngredient) {
      // Create updated ingredient with new classification data
      const updatedIngredient = {
        ...editingIngredient,
        productFamily: editFormData.productFamily,
        category: editFormData.category,
        subcategory: editFormData.subcategory
      };

      // Update the ingredient in the database
      updateIngredient(updatedIngredient);
      
      // Show success message
      setAlert('Product classification updated', 'success');
      
      // Close the dialog
      handleQuickEditClose();
    }
  };

  useEffect(() => {
    getIngredients();
    // eslint-disable-next-line
  }, []);

  const filteredIngredients = filtered !== null ? filtered : ingredients;

  // Get ingredients for current page
  const currentIngredients = filteredIngredients?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  ) || [];

  // Define the columns for each tab
  const tabColumns = [
    // Tab 0: Product Name
    [
      { id: 'name', label: 'Product Name', align: 'left' },
      { id: 'brand', label: 'Brand', align: 'left' },
      { id: 'supplier', label: 'Supplier', align: 'left' },
      { id: 'status', label: 'Status', align: 'left' },
      { id: 'actions', label: 'Actions', align: 'right' }
    ],
    // Tab 1: Product Format
    [
      { id: 'name', label: 'Product Name', align: 'left' },
      { id: 'size', label: 'Size', align: 'left' },
      { id: 'unit', label: 'Unit', align: 'left' },
      { id: 'format', label: 'Format', align: 'left' },
      { id: 'actions', label: 'Actions', align: 'right' }
    ],
    // Tab 2: Purchase Unit
    [
      { id: 'name', label: 'Product Name', align: 'left' },
      { id: 'cost', label: 'Cost', align: 'right' },
      { id: 'supplier', label: 'Supplier', align: 'left' },
      { id: 'packSize', label: 'Pack Size', align: 'left' },
      { id: 'actions', label: 'Actions', align: 'right' }
    ],
    // Tab 3: Training Details
    [
      { id: 'name', label: 'Product Name', align: 'left' },
      { id: 'description', label: 'Description', align: 'left' },
      { id: 'allergens', label: 'Allergens', align: 'left' },
      { id: 'storage', label: 'Storage', align: 'left' },
      { id: 'actions', label: 'Actions', align: 'right' }
    ]
  ];

  // Helper functions to render cell content
  const renderCell = (ingredient, column) => {
    switch (column.id) {
      case 'name':
        return (
          <Box 
            display="flex" 
            alignItems="flex-start"
            onClick={() => handleQuickEditOpen(ingredient)}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                '& .edit-indicator': {
                  opacity: 1
                }
              }
            }}
          >
            <Avatar
              sx={{ 
                mr: 2, 
                bgcolor: 'primary.light',
                width: 40,
                height: 40
              }}
            >
              <InventoryIcon />
            </Avatar>
            <Box sx={{ position: 'relative', flex: 1 }}>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" fontWeight={700}>
                  {ingredient.name}
                </Typography>
                <EditIcon 
                  className="edit-indicator"
                  sx={{ 
                    ml: 1, 
                    fontSize: 16, 
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                    color: 'primary.main'
                  }} 
                />
              </Box>
              <Box sx={{ display: 'flex', mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                {ingredient.productFamily && (
                  <Chip 
                    label={ingredient.productFamily}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      borderRadius: 1, 
                      height: 20, 
                      fontSize: '0.7rem',
                      fontWeight: 500
                    }}
                  />
                )}
                {ingredient.category && (
                  <Chip 
                    label={ingredient.category}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ 
                      borderRadius: 1, 
                      height: 20, 
                      fontSize: '0.7rem',
                      fontWeight: 500
                    }}
                  />
                )}
                {ingredient.subcategory && (
                  <Chip 
                    label={ingredient.subcategory}
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{ 
                      borderRadius: 1, 
                      height: 20, 
                      fontSize: '0.7rem',
                      fontWeight: 500
                    }}
                  />
                )}
                {!ingredient.productFamily && !ingredient.category && !ingredient.subcategory && (
                  <Typography variant="caption" color="text.secondary">
                    No classification
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        );
      case 'brand':
        return ingredient.brand || 'Not specified';
      case 'supplier':
        // Check if supplier is a string or an object with a name property
        const supplierName = typeof ingredient.supplier === 'string' 
          ? ingredient.supplier 
          : ingredient.supplier?.name || 'Not specified';
        return supplierName;
      case 'status':
        const isLowStock = ingredient.currentStock && ingredient.minStock && ingredient.currentStock <= ingredient.minStock;
        const status = isLowStock ? 'Low Stock' : 'In Stock';
        const statusColor = isLowStock ? 'warning' : 'success';
        return (
          <StatusChip
            label={status}
            color={statusColor}
            size="small"
          />
        );
      case 'size':
        return ingredient.size || ingredient.unitSize || 'Not specified';
      case 'unit':
        return ingredient.unit || ingredient.unitType || 'Not specified';
      case 'format':
        return ingredient.format || (ingredient.unitSize && ingredient.unitType ? `${ingredient.unitSize} ${ingredient.unitType}` : 'Not specified');
      case 'cost':
        return (
          <Typography variant="body2" fontWeight={600}>
            <CurrencyDisplay amount={ingredient.unitCost || ingredient.cost || 0} />
          </Typography>
        );
      case 'packSize':
        // Try to use packSize or create a formatted string from unitSize and unitType
        const unitName = ingredient.unit || ingredient.unitType || 'units';
        if (ingredient.packSize) {
          return `${ingredient.packSize} ${unitName}`;
        } else if (ingredient.unitSize) {
          return `${ingredient.unitSize} ${unitName}`;
        } else {
          return 'Not specified';
        }
      case 'description':
        return ingredient.description || ingredient.notes || 'No description';
      case 'allergens':
        // Handle allergens if it's an object
        if (ingredient.allergens && typeof ingredient.allergens === 'object') {
          const activeAllergens = Object.entries(ingredient.allergens)
            .filter(([_, value]) => value === true || value === 'true')
            .map(([key]) => key);
          
          if (activeAllergens.length === 0) {
            return 'None listed';
          }
          
          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {activeAllergens.map(allergen => (
                <Chip 
                  key={allergen}
                  label={allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ borderRadius: 4, fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          );
        }
        
        // If it's a string or other primitive
        return ingredient.allergens || ingredient.allergies || 'None listed';
      case 'storage':
        return ingredient.storageInstructions || ingredient.storage || 'No instructions';
      case 'actions':
        return (
          <Box>
            <IconButton
              color="primary"
              component={Link}
              to={`/inventory/${ingredient._id}`}
              size="small"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              color="primary"
              component={Link}
              to={`/inventory/edit/${ingredient._id}`}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(ingredient._id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <DecorativeCircle color="primary.light" size={200} opacity={0.15} top="-50px" right="-50px" />
        <DecorativeShape color="secondary.light" opacity={0.1} bottom="30px" left="-20px" shape="pill" />
        
        {/* Page Header */}
        <Box mb={4} mt={2} sx={{ position: 'relative', zIndex: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Typography variant="h3" fontWeight={800}>
              Inventory Management
            </Typography>
            
            {/* Action Buttons */}
            <Box display="flex" gap={2} flexWrap="wrap">
              <ActionButton
                variant="outlined"
                color="primary"
                endIcon={<ArrowDropDownIcon />}
                onClick={handleActionsClick}
                aria-controls={actionsMenuOpen ? 'actions-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={actionsMenuOpen ? 'true' : undefined}
              >
                Actions
              </ActionButton>
              
              <ActionButton
                variant="outlined"
                color="primary"
                startIcon={<FileUploadIcon />}
                onClick={handleImportOpen}
              >
                Import
              </ActionButton>
              
              <ActionButton
                variant="outlined"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
              >
                Export
              </ActionButton>
              
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component={Link}
                to="/inventory/add"
              >
                Add Product
              </ActionButton>
            </Box>
          </Box>
          
          <Typography variant="subtitle1" color="text.secondary" mt={1}>
            Manage your inventory, track stock levels, and update product information
          </Typography>
        </Box>
        
        {/* Search & Filter Section */}
        <BentoCard
          colorVariant="default"
          sx={{ mb: 4 }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={isMobile ? 12 : 6}>
              <SearchField
                fullWidth
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FilterSelect fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FilterSelect>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FilterSelect fullWidth>
                <InputLabel>Supplier</InputLabel>
                <Select
                  value={supplierFilter}
                  onChange={handleSupplierChange}
                  label="Supplier"
                >
                  <MenuItem value="">All Suppliers</MenuItem>
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier} value={supplier}>
                      {supplier}
                    </MenuItem>
                  ))}
                </Select>
              </FilterSelect>
            </Grid>
          </Grid>
        </BentoCard>
        
        {/* Actions Menu */}
        <Menu
          id="actions-menu"
          anchorEl={actionsAnchorEl}
          open={actionsMenuOpen}
          onClose={handleActionsClose}
          MenuListProps={{
            'aria-labelledby': 'actions-button',
          }}
          sx={{ 
            mt: 1,
            '& .MuiPaper-root': { 
              boxShadow: '0px 2px 8px rgba(0,0,0,0.12)',
              borderRadius: 16,
              py: 1
            }
          }}
        >
          <MenuItem onClick={() => handleActionSelect('merge')}>Merge items</MenuItem>
          <MenuItem onClick={() => handleActionSelect('setPars')}>Set pars</MenuItem>
          <MenuItem onClick={() => handleActionSelect('setVendors')}>Set vendors</MenuItem>
          <MenuItem onClick={() => handleActionSelect('setSize')}>Set size</MenuItem>
          <MenuItem onClick={() => handleActionSelect('setUnits')}>Set units per case</MenuItem>
          <MenuItem onClick={() => handleActionSelect('delete')}>Delete</MenuItem>
        </Menu>
        
        {/* Tabbed Content */}
        <BentoCard
          colorVariant="default"
          sx={{ p: 0, overflow: 'hidden' }}
        >
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile}
            allowScrollButtonsMobile
            TabScrollButtonProps={{
              sx: {
                '&.Mui-disabled': { opacity: 0.3 }
              }
            }}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              backgroundColor: theme.palette.grey[50],
            }}
          >
            <StyledTab 
              label="Product Name" 
              icon={<RestaurantIcon />} 
              iconPosition="start"
            />
            <StyledTab 
              label="Product Format" 
              icon={<FormatListBulletedIcon />} 
              iconPosition="start"
            />
            <StyledTab 
              label="Purchase Unit" 
              icon={<ShoppingCartIcon />} 
              iconPosition="start"
            />
            <StyledTab 
              label="Training Details" 
              icon={<MenuBookIcon />} 
              iconPosition="start"
            />
          </StyledTabs>
          
          {/* Table Content */}
          <TabContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Typography>Loading inventory...</Typography>
              </Box>
            ) : filteredIngredients.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No inventory items found
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  {search || categoryFilter || supplierFilter ? 
                    'Try adjusting your search or filters' : 
                    'Start by adding your first inventory item'}
                </Typography>
                <ActionButton
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  component={Link}
                  to="/inventory/add"
                >
                  Add Product
                </ActionButton>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="inventory table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            indeterminate={selected.length > 0 && !isAllSelected}
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            inputProps={{
                              'aria-label': 'select all ingredients',
                            }}
                          />
                        </StyledTableCell>
                        {tabColumns[tabValue].map((column) => (
                          <StyledTableCell key={column.id} align={column.align}>
                            {column.label}
                          </StyledTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentIngredients.map((ingredient) => {
                        const isItemSelected = isSelected(ingredient._id);
                        
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={ingredient._id}
                            selected={isItemSelected}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                onClick={() => handleSelect(ingredient._id)}
                                inputProps={{
                                  'aria-labelledby': `enhanced-table-checkbox-${ingredient._id}`,
                                }}
                              />
                            </TableCell>
                            {tabColumns[tabValue].map((column) => (
                              <TableCell 
                                key={`${ingredient._id}-${column.id}`} 
                                align={column.align}
                              >
                                {renderCell(ingredient, column)}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  component="div"
                  count={filteredIngredients.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{ 
                    borderTop: 1, 
                    borderColor: 'divider',
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontWeight: 500
                    }
                  }}
                />
              </>
            )}
          </TabContent>
        </BentoCard>
      </Box>
      
      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={handleImportClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Import Inventory Items</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Upload a CSV file to batch import inventory items. Download a template to see the required format.
          </DialogContentText>
          <IngredientCSVUpload onSuccess={handleImportClose} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleImportClose}
            variant="outlined" 
            color="primary"
            sx={{ borderRadius: 20 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete !== null}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCancelDelete}
            variant="outlined" 
            color="primary"
            sx={{ borderRadius: 20 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{ borderRadius: 20 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        open={confirmBulkDelete}
        onClose={handleCancelBulkDelete}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selected.length} selected items? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCancelBulkDelete}
            variant="outlined" 
            color="primary"
            sx={{ borderRadius: 20 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmBulkDelete} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{ borderRadius: 20 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Edit Dialog */}
      <Dialog 
        open={quickEditDialog} 
        onClose={handleQuickEditClose}
        maxWidth="md"
        PaperProps={{
          sx: { 
            borderRadius: 3,
            overflow: 'visible'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontWeight: 700, 
            fontSize: '1.5rem', 
            pt: 4, 
            px: 4,
            pb: 2
          }}
        >
          Edit Product
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 2 }}>
          <Box sx={{ 
            p: 3, 
            mb: 2, 
            border: 1, 
            borderColor: 'divider', 
            borderRadius: 2,
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                {editingIngredient?.name}
              </Typography>
              <IconButton sx={{ position: 'absolute', top: 10, right: 10 }}>
                <EditIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Product Family
                </Typography>
                <FormControl fullWidth variant="outlined" size="small">
                  <Select
                    name="productFamily"
                    value={editFormData.productFamily}
                    onChange={handleQuickEditChange}
                    displayEmpty
                    renderValue={(selected) => selected || 'Subcategory'}
                    sx={{ 
                      borderRadius: 2,
                      '.MuiSelect-select': { 
                        display: 'flex', 
                        alignItems: 'center' 
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>-- Select --</em>
                    </MenuItem>
                    {productFamilies.map(family => (
                      <MenuItem key={family} value={family}>
                        {family}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Category
                </Typography>
                <FormControl fullWidth variant="outlined" size="small">
                  <Select
                    name="category"
                    value={editFormData.category}
                    onChange={handleQuickEditChange}
                    displayEmpty
                    renderValue={(selected) => selected || 'Category'}
                    sx={{ 
                      borderRadius: 2,
                      '.MuiSelect-select': { 
                        display: 'flex', 
                        alignItems: 'center' 
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>-- Select --</em>
                    </MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Subcategory
                </Typography>
                <FormControl fullWidth variant="outlined" size="small">
                  <Select
                    name="subcategory"
                    value={editFormData.subcategory}
                    onChange={handleQuickEditChange}
                    displayEmpty
                    disabled={!editFormData.productFamily && !editFormData.category}
                    renderValue={(selected) => selected || 'Subcategory'}
                    sx={{ 
                      borderRadius: 2,
                      '.MuiSelect-select': { 
                        display: 'flex', 
                        alignItems: 'center' 
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>-- Select --</em>
                    </MenuItem>
                    {(subcategories[editFormData.productFamily] || subcategories[editFormData.category] || []).map(subcategory => (
                      <MenuItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={handleQuickEditClose}
            variant="outlined"
            sx={{ 
              borderRadius: 2, 
              minWidth: 120,
              fontWeight: 600,
              borderColor: theme.palette.text.secondary,
              color: theme.palette.text.secondary
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleQuickEditSave}
            variant="contained"
            color="primary"
            sx={{ 
              borderRadius: 2, 
              minWidth: 120,
              fontWeight: 600,
              backgroundColor: '#c75c2c'
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Ingredients; 