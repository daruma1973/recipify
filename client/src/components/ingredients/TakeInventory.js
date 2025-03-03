import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';

const TakeInventory = () => {
  const ingredientContext = useContext(IngredientContext);
  const alertContext = useContext(AlertContext);
  const { ingredients, getIngredients, updateIngredient, loading } = ingredientContext;
  const { setAlert } = alertContext;

  const [selectedLocation, setSelectedLocation] = useState('all');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');

  // Mock locations - in a real app, these would come from a context or API
  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'main', name: 'Main Kitchen' },
    { id: 'prep', name: 'Prep Area' },
    { id: 'bar', name: 'Bar' },
    { id: 'storage', name: 'Dry Storage' }
  ];

  useEffect(() => {
    getIngredients();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (ingredients) {
      // Initialize inventory items with current quantities
      const items = ingredients.map(ingredient => ({
        ...ingredient,
        newQuantity: ingredient.stockQuantity,
        difference: 0,
        notes: ''
      }));
      setInventoryItems(items);
    }
  }, [ingredients]);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleQuantityChange = (id, value) => {
    const numValue = value === '' ? '' : Number(value);
    
    setInventoryItems(prevItems => 
      prevItems.map(item => {
        if (item._id === id) {
          const difference = numValue === '' ? 0 : numValue - item.stockQuantity;
          return {
            ...item,
            newQuantity: numValue,
            difference
          };
        }
        return item;
      })
    );
  };

  const handleNotesChange = (id, value) => {
    setInventoryItems(prevItems => 
      prevItems.map(item => {
        if (item._id === id) {
          return {
            ...item,
            notes: value
          };
        }
        return item;
      })
    );
  };

  const handleSaveInventory = async () => {
    setSaving(true);
    
    try {
      // Filter out items with no changes
      const changedItems = inventoryItems.filter(
        item => item.newQuantity !== item.stockQuantity
      );
      
      if (changedItems.length === 0) {
        setAlert('No changes to save', 'info');
        setSaving(false);
        return;
      }
      
      let successCount = 0;
      
      // Update each changed item
      for (const item of changedItems) {
        try {
          const updatedItem = {
            _id: item._id,
            stockQuantity: item.newQuantity,
            // In a real app, you might want to log the inventory adjustment
            // and the notes in a separate collection for historical records
          };
          
          await updateIngredient(updatedItem);
          successCount++;
        } catch (err) {
          console.error(`Failed to update ${item.name}:`, err);
        }
      }
      
      setAlert(`Successfully updated ${successCount} of ${changedItems.length} items`, 'success');
      
      // Refresh ingredients to get updated data
      await getIngredients();
    } catch (err) {
      console.error('Error saving inventory:', err);
      setAlert('Error saving inventory', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    // Filter by location if a specific one is selected
    const locationMatch = selectedLocation === 'all' ? true : 
      // In a real app, each item would have a location property
      // This is just a placeholder for demonstration
      true;
    
    // Filter by search text
    const searchMatch = filter === '' ? true :
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(filter.toLowerCase()));
    
    return locationMatch && searchMatch;
  });

  if (loading && !ingredients.length) {
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
          Take Inventory
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Update current inventory levels for your ingredients.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="location-select-label">Location</InputLabel>
              <Select
                labelId="location-select-label"
                id="location-select"
                value={selectedLocation}
                onChange={handleLocationChange}
                label="Location"
              >
                {locations.map(location => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search Ingredients"
              variant="outlined"
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {filteredItems.length === 0 ? (
          <Alert severity="info">No ingredients found matching your criteria.</Alert>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Current Quantity</TableCell>
                  <TableCell>New Quantity</TableCell>
                  <TableCell>Difference</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map(item => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.stockQuantity}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        variant="outlined"
                        size="small"
                        value={item.newQuantity}
                        onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                        sx={{ width: '100px' }}
                        InputProps={{
                          inputProps: { min: 0, step: "any" }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.difference > 0 ? `+${item.difference}` : item.difference}
                        color={
                          item.difference > 0 
                            ? 'success' 
                            : item.difference < 0 
                              ? 'error' 
                              : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.unitType}</TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={item.notes}
                        onChange={(e) => handleNotesChange(item._id, e.target.value)}
                        placeholder="Add notes..."
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveInventory}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Inventory Count'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TakeInventory; 