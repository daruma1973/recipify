import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
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
  Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AuthContext from '../../context/auth/authContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';
import IngredientCSVUpload from './IngredientCSVUpload';

const Ingredients = () => {
  const authContext = useContext(AuthContext);
  const ingredientContext = useContext(IngredientContext);
  const alertContext = useContext(AlertContext);

  const { loadUser } = authContext;
  const { 
    ingredients, 
    filtered, 
    getIngredients, 
    filterIngredients, 
    clearFilter,
    loading,
    deleteIngredient
  } = ingredientContext;
  const { setAlert } = alertContext;

  // Local state for pagination and filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  // Actions menu state
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const actionsMenuOpen = Boolean(actionsAnchorEl);
  
  // Selected items state
  const [selected, setSelected] = useState([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  // Load user data and ingredients when component mounts
  useEffect(() => {
    loadUser();
    getIngredients();
    // eslint-disable-next-line
  }, []);

  // Handle actions menu
  const handleActionsClick = (event) => {
    setActionsAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  const handleActionSelect = (action) => {
    switch(action) {
      case 'merge':
        setAlert('Merge items functionality coming soon', 'info');
        break;
      case 'setPars':
        setAlert('Set pars functionality coming soon', 'info');
        break;
      case 'setVendors':
        setAlert('Set vendors functionality coming soon', 'info');
        break;
      case 'setSize':
        setAlert('Set size functionality coming soon', 'info');
        break;
      case 'setUnits':
        setAlert('Set units per case functionality coming soon', 'info');
        break;
      case 'delete':
        if (selected.length === 0) {
          setAlert('Please select items to delete', 'warning');
        } else {
          setConfirmBulkDelete(true);
        }
        break;
      default:
        break;
    }
    handleActionsClose();
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value !== '') {
      filterIngredients(e.target.value);
    } else {
      clearFilter();
    }
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle delete confirmation
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
  };

  // Export inventory to CSV
  const handleExport = () => {
    if (!ingredients || ingredients.length === 0) {
      setAlert('No inventory items to export', 'warning');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Category', 'Cost', 'Unit Size', 'Unit Type', 'Supplier', 'Status'];
    const csvContent = [
      headers.join(','),
      ...ingredients.map(item => [
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category || ''}"`,
        item.cost || 0,
        item.unitSize || '',
        `"${item.unitType || ''}"`,
        `"${item.supplier ? item.supplier.name.replace(/"/g, '""') : 'N/A'}"`,
        item.isActive ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAlert('Inventory exported successfully', 'success');
  };

  // Filter ingredients by category if categoryFilter is set
  const filteredIngredients = categoryFilter
    ? (filtered || ingredients || []).filter(ingredient => ingredient.category === categoryFilter)
    : (filtered || ingredients || []);

  // Get unique categories for the filter dropdown
  const categories = ingredients
    ? [...new Set(ingredients.map(ingredient => ingredient.category))]
    : [];

  // Bulk delete handlers
  const handleConfirmBulkDelete = () => {
    if (selected.length > 0) {
      // Delete all selected items
      selected.forEach(id => {
        deleteIngredient(id);
      });
      setAlert(`${selected.length} items deleted successfully`, 'success');
      setSelected([]);
      setConfirmBulkDelete(false);
    }
  };

  const handleCancelBulkDelete = () => {
    setConfirmBulkDelete(false);
  };

  // Checkbox selection handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredIngredients.map((ingredient) => ingredient._id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(item => item !== id);
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  
  // Check if all visible items are selected
  const isAllSelected = 
    filteredIngredients.length > 0 && 
    filteredIngredients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .every(ingredient => isSelected(ingredient._id));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Inventory Items
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/inventory/add"
        >
          Add Product
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined" 
          color="primary"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleActionsClick}
          aria-controls={actionsMenuOpen ? 'actions-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={actionsMenuOpen ? 'true' : undefined}
        >
          Actions
        </Button>
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
              borderRadius: 1
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
        
        <Button 
          variant="outlined" 
          color="primary"
        >
          Filters
        </Button>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<FileUploadIcon />}
          onClick={handleImportOpen}
        >
          Import
        </Button>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
        >
          Export
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/inventory/add"
        >
          Add Product
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Ingredients"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-filter-label">Filter by Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={categoryFilter}
                onChange={handleCategoryChange}
                label="Filter by Category"
              >
                <MenuItem value="">
                  <em>All Categories</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={handleImportClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Import Inventory Items</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Upload a CSV file to batch import inventory items. Download a template to see the required format.
          </DialogContentText>
          <IngredientCSVUpload onSuccess={handleImportClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImportClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        open={confirmBulkDelete}
        onClose={handleCancelBulkDelete}
      >
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selected.length} selected items? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelBulkDelete}>Cancel</Button>
          <Button onClick={handleConfirmBulkDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Paper elevation={2}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="ingredients table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && !isAllSelected}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    inputProps={{
                      'aria-label': 'select all ingredients',
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading ingredients...
                  </TableCell>
                </TableRow>
              ) : filteredIngredients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No ingredients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredIngredients
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((ingredient) => {
                    const isItemSelected = isSelected(ingredient._id);
                    
                    return (
                      <TableRow 
                        key={ingredient._id}
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={() => handleSelect(ingredient._id)}
                            inputProps={{
                              'aria-labelledby': `ingredient-${ingredient._id}`,
                            }}
                          />
                        </TableCell>
                        <TableCell 
                          component="th" 
                          scope="row"
                          id={`ingredient-${ingredient._id}`}
                        >
                          {ingredient.name}
                        </TableCell>
                        <TableCell>{ingredient.category}</TableCell>
                        <TableCell>${ingredient.cost.toFixed(2)}</TableCell>
                        <TableCell>{`${ingredient.unitSize} ${ingredient.unitType}`}</TableCell>
                        <TableCell>
                          {ingredient.supplier ? ingredient.supplier.name : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ingredient.isActive ? 'Active' : 'Inactive'}
                            color={ingredient.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            component={Link}
                            to={`/ingredients/${ingredient._id}`}
                            size="small"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            component={Link}
                            to={`/ingredients/edit/${ingredient._id}`}
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
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
              {confirmDelete && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ bgcolor: 'error.light', p: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Are you sure you want to delete this ingredient?
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleConfirmDelete}
                      sx={{ mr: 1 }}
                    >
                      Delete
                    </Button>
                    <Button variant="outlined" onClick={handleCancelDelete}>
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredIngredients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        
        {/* Show selected count and bulk actions if items are selected */}
        {selected.length > 0 && (
          <Box 
            sx={{ 
              position: 'sticky', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              p: 2, 
              bgcolor: 'primary.light', 
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 2,
              zIndex: 1
            }}
          >
            <Typography variant="body1">
              {selected.length} items selected
            </Typography>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => setConfirmBulkDelete(true)}
              startIcon={<DeleteIcon />}
            >
              Delete Selected
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Ingredients; 