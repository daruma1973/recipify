import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AuthContext from '../../context/auth/authContext';
import SupplierContext from '../../context/supplier/supplierContext';
import AlertContext from '../../context/alert/alertContext';

const SupplierForm = () => {
  const authContext = useContext(AuthContext);
  const supplierContext = useContext(SupplierContext);
  const alertContext = useContext(AlertContext);

  const { loadUser } = authContext;
  const { 
    addSupplier, 
    updateSupplier, 
    current, 
    clearCurrentSupplier, 
    getSupplier,
    loading 
  } = supplierContext;
  const { setAlert } = alertContext;

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== undefined;

  // Initial state for the supplier form
  const [supplier, setSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    website: '',
    notes: '',
    paymentTerms: '',
    isActive: true
  });

  // Load user data and supplier data if in edit mode
  useEffect(() => {
    loadUser();
    
    if (isEditMode) {
      getSupplier(id);
    } else {
      clearCurrentSupplier();
    }

    return () => {
      clearCurrentSupplier();
    };
    // eslint-disable-next-line
  }, [id]);

  // Update form when current supplier changes
  useEffect(() => {
    if (current) {
      setSupplier({
        ...current,
        address: current.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    }
  }, [current]);

  const { 
    name, 
    contact, 
    email, 
    phone, 
    address, 
    website, 
    notes, 
    paymentTerms, 
    isActive 
  } = supplier;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setSupplier({
        ...supplier,
        [parent]: {
          ...supplier[parent],
          [child]: value
        }
      });
    } else {
      setSupplier({
        ...supplier,
        [name]: value
      });
    }
  };

  const handleSwitchChange = (e) => {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name) {
      setAlert('Supplier name is required', 'error');
      return;
    }

    if (isEditMode) {
      updateSupplier(supplier);
      setAlert('Supplier updated successfully', 'success');
    } else {
      addSupplier(supplier);
      setAlert('Supplier added successfully', 'success');
    }

    // Redirect to suppliers list
    navigate('/suppliers');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Supplier' : 'Add Supplier'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/suppliers')}
        >
          Back to Suppliers
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={2} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Supplier Name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Company or business name"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  name="contact"
                  value={contact}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Primary contact person at this supplier"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  variant="outlined"
                  type="email"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={website}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="https://"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Terms"
                  name="paymentTerms"
                  value={paymentTerms}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="e.g., Net 30, COD, etc."
                />
              </Grid>

              {/* Address Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                  Address Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="address.street"
                  value={address.street}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="address.city"
                  value={address.city}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="address.state"
                  value={address.state}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Zip/Postal Code"
                  name="address.zipCode"
                  value={address.zipCode}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="address.country"
                  value={address.country}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              {/* Additional Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={notes}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={4}
                  helperText="Any additional information about this supplier"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={handleSwitchChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active Supplier"
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                >
                  {isEditMode ? 'Update Supplier' : 'Add Supplier'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}
    </Container>
  );
};

export default SupplierForm; 