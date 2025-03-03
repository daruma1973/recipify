import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AuthContext from '../../context/auth/authContext';
import CostingContext from '../../context/costing/costingContext';
import AlertContext from '../../context/alert/alertContext';

const CostReports = () => {
  const authContext = useContext(AuthContext);
  const costingContext = useContext(CostingContext);
  const alertContext = useContext(AlertContext);

  const { loadUser } = authContext;
  const { 
    costReports, 
    getCostReports, 
    deleteCostCalculation, 
    loading 
  } = costingContext;
  const { setAlert } = alertContext;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Load user data and cost reports when component mounts
  useEffect(() => {
    loadUser();
    getCostReports();
    // eslint-disable-next-line
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleDeleteConfirm = () => {
    if (confirmDelete) {
      deleteCostCalculation(confirmDelete);
      setAlert('Cost report deleted successfully', 'success');
      setConfirmDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  // Filter reports based on search term
  const filteredReports = costReports
    ? costReports.filter(report => {
        const searchTerm = search.toLowerCase();
        return (
          report.name.toLowerCase().includes(searchTerm) ||
          report.recipeName.toLowerCase().includes(searchTerm)
        );
      })
    : [];

  // Apply pagination
  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Cost Reports
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/costing/calculator"
          startIcon={<AttachMoneyIcon />}
        >
          New Calculation
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Reports"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by report name or recipe"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredReports.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6">No cost reports found</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {search
              ? 'Try adjusting your search term'
              : 'Create your first cost calculation to get started'}
          </Typography>
          {!search && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/costing/calculator"
              sx={{ mt: 2 }}
            >
              Create Calculation
            </Button>
          )}
        </Paper>
      ) : (
        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report Name</TableCell>
                  <TableCell>Recipe</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Total Cost</TableCell>
                  <TableCell align="right">Suggested Price</TableCell>
                  <TableCell align="right">Profit Margin</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RestaurantIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                        {report.recipeName}
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(report.date)}</TableCell>
                    <TableCell align="right">${report.totalCost}</TableCell>
                    <TableCell align="right">${report.suggestedPrice}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${report.profitMargin}%`}
                        color={parseFloat(report.profitMargin) > 20 ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        component={Link}
                        to={`/costing/reports/${report._id}`}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(report._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredReports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete !== null}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Cost Report?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this cost report? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CostReports; 