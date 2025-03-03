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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AuthContext from '../../context/auth/authContext';
import SupplierContext from '../../context/supplier/supplierContext';
import AlertContext from '../../context/alert/alertContext';

const Suppliers = () => {
  const authContext = useContext(AuthContext);
  const supplierContext = useContext(SupplierContext);
  const alertContext = useContext(AlertContext);

  const { loadUser } = authContext;
  const { 
    suppliers, 
    filtered, 
    getSuppliers, 
    filterSuppliers, 
    clearFilter,
    loading,
    deleteSupplier
  } = supplierContext;
  const { setAlert } = alertContext;

  // Local state for pagination and filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Load user data and suppliers when component mounts
  useEffect(() => {
    loadUser();
    getSuppliers();
    // eslint-disable-next-line
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value !== '') {
      filterSuppliers(e.target.value);
    } else {
      clearFilter();
    }
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
      deleteSupplier(confirmDelete);
      setAlert('Supplier deleted successfully', 'success');
      setConfirmDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Get filtered suppliers
  const filteredSuppliers = filtered || suppliers || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Suppliers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/suppliers/add"
        >
          Add Supplier
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Suppliers"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name, contact person, or email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="suppliers table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading suppliers...
                  </TableCell>
                </TableRow>
              ) : filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No suppliers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((supplier) => (
                    <TableRow key={supplier._id}>
                      <TableCell component="th" scope="row">
                        {supplier.name}
                      </TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>
                        {supplier.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <a href={`mailto:${supplier.email}`} style={{ textDecoration: 'none' }}>
                              {supplier.email}
                            </a>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <a href={`tel:${supplier.phone}`} style={{ textDecoration: 'none' }}>
                              {supplier.phone}
                            </a>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={supplier.isActive ? 'Active' : 'Inactive'}
                          color={supplier.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          component={Link}
                          to={`/suppliers/${supplier._id}`}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          component={Link}
                          to={`/suppliers/edit/${supplier._id}`}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(supplier._id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
              {confirmDelete && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ bgcolor: 'error.light', p: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Are you sure you want to delete this supplier?
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
          count={filteredSuppliers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog - Alternative to inline confirmation */}
      <Dialog
        open={confirmDelete !== null}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Supplier?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this supplier? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Suppliers; 