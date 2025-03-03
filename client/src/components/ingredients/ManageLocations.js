import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import AlertContext from '../../context/alert/alertContext';

const ManageLocations = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  // State for locations
  const [locations, setLocations] = useState([
    { id: '1', name: 'Main Kitchen', description: 'Main food preparation area', isActive: true },
    { id: '2', name: 'Prep Area', description: 'Food prep station', isActive: true },
    { id: '3', name: 'Bar', description: 'Bar storage and service area', isActive: true },
    { id: '4', name: 'Dry Storage', description: 'Non-refrigerated storage', isActive: true },
    { id: '5', name: 'Walk-in Refrigerator', description: 'Cold storage', isActive: true }
  ]);

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLocation, setEditLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  // State for loading
  const [loading, setLoading] = useState(false);

  const handleOpenDialog = (location = null) => {
    if (location) {
      setEditLocation(location);
      setFormData({
        name: location.name,
        description: location.description || '',
        isActive: location.isActive
      });
    } else {
      setEditLocation(null);
      setFormData({
        name: '',
        description: '',
        isActive: true
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditLocation(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isActive' ? checked : value
    });
  };

  const handleSaveLocation = () => {
    if (!formData.name.trim()) {
      setAlert('Location name is required', 'error');
      return;
    }

    if (editLocation) {
      // Update existing location
      setLocations(prevLocations =>
        prevLocations.map(loc =>
          loc.id === editLocation.id
            ? { ...loc, ...formData }
            : loc
        )
      );
      setAlert('Location updated successfully', 'success');
    } else {
      // Add new location
      const newLocation = {
        id: Date.now().toString(), // Generate a unique ID
        ...formData
      };
      setLocations(prevLocations => [...prevLocations, newLocation]);
      setAlert('Location added successfully', 'success');
    }

    handleCloseDialog();
  };

  const handleDeleteLocation = (id) => {
    // In a real application, you might want to check if this location is in use
    // before allowing deletion, or implement a soft delete.
    setLocations(prevLocations =>
      prevLocations.filter(loc => loc.id !== id)
    );
    setAlert('Location deleted', 'success');
  };

  const handleToggleActive = (id, currentState) => {
    setLocations(prevLocations =>
      prevLocations.map(loc =>
        loc.id === id
          ? { ...loc, isActive: !currentState }
          : loc
      )
    );
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Inventory Locations
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Create and manage locations where inventory items are stored.
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Location
        </Button>
      </Box>

      <Grid container spacing={3}>
        {locations.map(location => (
          <Grid item xs={12} sm={6} md={4} key={location.id}>
            <Card 
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                opacity: location.isActive ? 1 : 0.7
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {location.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {location.description || 'No description provided'}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={location.isActive}
                      onChange={() => handleToggleActive(location.id, location.isActive)}
                      color="primary"
                    />
                  }
                  label={location.isActive ? 'Active' : 'Inactive'}
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(location)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteLocation(location.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Location Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editLocation ? 'Edit Location' : 'Add New Location'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Location Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              variant="outlined"
              autoFocus
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
            />
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveLocation}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Alert 
        severity="info" 
        sx={{ mt: 4 }}
      >
        Note: In this demo version, locations are stored locally and will reset when you refresh the page.
        In a production application, these would be saved to a database.
      </Alert>
    </Container>
  );
};

export default ManageLocations; 