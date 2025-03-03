import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import InventoryIcon from '@mui/icons-material/Inventory';
import AuthContext from '../../context/auth/authContext';
import SupplierContext from '../../context/supplier/supplierContext';
import AlertContext from '../../context/alert/alertContext';

const SupplierDetail = () => {
  const authContext = useContext(AuthContext);
  const supplierContext = useContext(SupplierContext);
  const alertContext = useContext(AlertContext);

  const { loadUser } = authContext;
  const { 
    getSupplier, 
    current, 
    clearCurrentSupplier, 
    deleteSupplier, 
    loading 
  } = supplierContext;
  const { setAlert } = alertContext;

  const navigate = useNavigate();
  const { id } = useParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Mock data for ingredients supplied by this supplier
  const [suppliedIngredients] = useState([
    { _id: '1', name: 'Flour', unitSize: '25', unitType: 'kg' },
    { _id: '2', name: 'Sugar', unitSize: '10', unitType: 'kg' },
    { _id: '3', name: 'Salt', unitSize: '5', unitType: 'kg' }
  ]);

  // Load user data and supplier data
  useEffect(() => {
    console.log('SupplierDetail: useEffect triggered with ID:', id);
    loadUser();
    console.log('SupplierDetail: Calling getSupplier with ID:', id);
    getSupplier(id);

    return () => {
      console.log('SupplierDetail: Cleanup - clearing current supplier');
      clearCurrentSupplier();
    };
    // eslint-disable-next-line
  }, [id]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteSupplier(id);
    setAlert('Supplier deleted successfully', 'success');
    setOpenDeleteDialog(false);
    navigate('/suppliers');
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  if (loading || !current) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const { 
    name, 
    contact, 
    email, 
    phone, 
    address = {}, 
    website, 
    notes, 
    paymentTerms, 
    isActive 
  } = current;

  const fullAddress = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country
  ].filter(Boolean).join(', ');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Supplier Details
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/suppliers')}
            sx={{ mr: 1 }}
          >
            Back to Suppliers
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/suppliers/edit/${id}`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                {name}
              </Typography>
              <Chip
                label={isActive ? 'Active' : 'Inactive'}
                color={isActive ? 'success' : 'default'}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {contact && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Contact Person:
                  </Typography>
                  <Typography variant="body1">{contact}</Typography>
                </Grid>
              )}

              {email && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <a href={`mailto:${email}`} style={{ textDecoration: 'none' }}>
                        {email}
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              )}

              {phone && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <a href={`tel:${phone}`} style={{ textDecoration: 'none' }}>
                        {phone}
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              )}

              {website && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <a href={website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        {website}
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              )}

              {fullAddress && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main', mt: 0.5 }} />
                    <Typography variant="body1">{fullAddress}</Typography>
                  </Box>
                </Grid>
              )}

              {paymentTerms && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Payment Terms:</strong> {paymentTerms}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            {notes && (
              <>
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Notes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {notes}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Ingredients Supplied */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Ingredients Supplied
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {suppliedIngredients.length === 0 ? (
              <Typography variant="body1">
                No ingredients from this supplier yet.
              </Typography>
            ) : (
              <List>
                {suppliedIngredients.map((ingredient) => (
                  <ListItem 
                    key={ingredient._id}
                    component={Link}
                    to={`/inventory/${ingredient._id}`}
                    sx={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        borderRadius: 1
                      }
                    }}
                  >
                    <ListItemText
                      primary={ingredient.name}
                      secondary={`${ingredient.unitSize} ${ingredient.unitType}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Supplier?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {name}? This action cannot be undone.
            {suppliedIngredients.length > 0 && (
              <>
                <br /><br />
                <strong>Warning:</strong> This supplier is associated with {suppliedIngredients.length} ingredient(s).
                Deleting this supplier may affect those ingredients.
              </>
            )}
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

export default SupplierDetail; 