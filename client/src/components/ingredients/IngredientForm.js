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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  FormGroup,
  Checkbox,
  InputAdornment,
  Alert,
  AlertTitle,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';

const IngredientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ingredientContext = useContext(IngredientContext);
  const alertContext = useContext(AlertContext);

  const { 
    addIngredient, 
    updateIngredient, 
    current, 
    clearCurrent, 
    getIngredient 
  } = ingredientContext;
  const { setAlert } = alertContext;

  const [ingredient, setIngredient] = useState({
    name: '',
    code: '',
    consumerName: '',
    category: '',
    supplier: '',
    internalSupplier: '',
    productGroups: [],
    itemClass: 'food',
    price: 0,
    totalUOM: '',
    totalUnits: 1,
    alternativeUnit: '',
    alternativeSize: '',
    avgWeight: 0,
    useAvgWeight: false,
    packSize: 1,
    packSizeUnit: '',
    splitPack: false,
    packSizeInfo: '',
    netWeight: 0,
    expirationDate: '',
    taxValue: 0,
    taxClass: '',
    notes: '',
    compoundIngredients: [],
    isActive: true,
    allergens: {
      celery: false,
      gluten: false,
      crustaceans: false,
      eggs: false,
      fish: false,
      lupin: false,
      milk: false,
      molluscs: false,
      mustard: false,
      nuts: false,
      peanuts: false,
      sesameSeeds: false,
      soybeans: false,
      sulphurDioxide: false
    },
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: ''
    }
  });

  // Mock data for suppliers and other selectable options
  const [suppliers, setSuppliers] = useState([
    { _id: '1', name: 'Supplier A' },
    { _id: '2', name: 'Supplier B' },
    { _id: '3', name: 'Supplier C' },
    { _id: '4', name: 'Supplier D' }
  ]);

  const [internalSuppliers, setInternalSuppliers] = useState([
    { _id: '1', name: 'Internal Supplier A' },
    { _id: '2', name: 'Internal Supplier B' }
  ]);

  const [productGroups, setProductGroups] = useState([
    { _id: '1', name: 'Fresh Produce' },
    { _id: '2', name: 'Dairy Products' },
    { _id: '3', name: 'Meat & Poultry' },
    { _id: '4', name: 'Pantry Items' }
  ]);

  // Predefined categories and unit types
  const categories = ['Dairy', 'Meat', 'Seafood', 'Produce', 'Dry Goods', 'Bakery', 'Oils', 'Spices', 'Beverages', 'Other'];
  const unitTypes = ['g', 'kg', 'ml', 'l', 'pcs', 'bunch', 'ea', 'oz', 'lb', 'gal', 'qt'];
  const classTypes = ['food', 'non-food', 'packaging', 'beverage', 'alcohol', 'produce', 'meat', 'seafood', 'dairy'];
  const taxClasses = ['Standard', 'Reduced', 'Zero', 'Exempt'];

  // Check if we're in edit mode
  const isEditMode = id !== undefined;

  // Load ingredient data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      console.log('Edit mode detected, fetching ingredient with ID:', id);
      getIngredient(id);
    } else {
      clearCurrent();
    }
    
    // eslint-disable-next-line
  }, [isEditMode, id]);

  // Set form data when current changes
  useEffect(() => {
    if (current !== null) {
      console.log('Current ingredient data received:', current);
      
      // Ensure nutritionalInfo and allergens have default values if they're missing
      const updatedIngredient = {
        ...current,
        nutritionalInfo: current.nutritionalInfo || {
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          fiber: ''
        },
        allergens: current.allergens || {
          celery: false,
          gluten: false,
          crustaceans: false,
          eggs: false,
          fish: false,
          lupin: false,
          milk: false,
          molluscs: false,
          mustard: false,
          nuts: false,
          peanuts: false,
          sesameSeeds: false,
          soybeans: false,
          sulphurDioxide: false
        }
      };
      
      setIngredient(updatedIngredient);
    }
  }, [current]);

  const handleChange = e => {
    const { name, value } = e.target;
    setIngredient({ ...ingredient, [name]: value });
  };

  const handleAllergenChange = e => {
    const { name, checked } = e.target;
    
    // Ensure allergens exists before updating it
    const currentAllergens = ingredient.allergens || {
      celery: false,
      gluten: false,
      crustaceans: false,
      eggs: false,
      fish: false,
      lupin: false,
      milk: false,
      molluscs: false,
      mustard: false,
      nuts: false,
      peanuts: false,
      sesameSeeds: false,
      soybeans: false,
      sulphurDioxide: false
    };
    
    setIngredient({
      ...ingredient,
      allergens: {
        ...currentAllergens,
        [name]: checked
      }
    });
  };

  const handleNutritionalInfoChange = e => {
    const { name, value } = e.target;
    
    // Ensure nutritionalInfo exists before updating it
    const currentNutritionalInfo = ingredient.nutritionalInfo || {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: ''
    };
    
    setIngredient({
      ...ingredient,
      nutritionalInfo: {
        ...currentNutritionalInfo,
        [name]: value === '' ? '' : Number(value)
      }
    });
  };

  const handleActiveChange = e => {
    setIngredient({ ...ingredient, isActive: e.target.checked });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Validate required fields
    if (!ingredient.name || !ingredient.code || !ingredient.supplier || 
        !ingredient.itemClass || !ingredient.price || !ingredient.totalUOM || 
        !ingredient.unitType) {
      setAlert('Please fill in all required fields', 'error');
      return;
    }

    // Format the ingredient data
    const formattedIngredient = {
      ...ingredient,
      price: Number(ingredient.price),
      totalUOM: Number(ingredient.totalUOM),
      packSize: Number(ingredient.packSize),
      totalUnits: Number(ingredient.totalUnits),
      avgWeight: Number(ingredient.avgWeight),
      netWeight: Number(ingredient.netWeight),
      taxValue: Number(ingredient.taxValue)
    };

    if (isEditMode) {
      updateIngredient(formattedIngredient);
      setAlert('Ingredient updated successfully', 'success');
    } else {
      addIngredient(formattedIngredient);
      setAlert('Ingredient added successfully', 'success');
    }

    // Redirect to ingredients list
    navigate('/ingredients');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {ingredientContext.loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading ingredient data...
          </Typography>
        </Box>
      )}
      
      {ingredientContext.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {ingredientContext.error}
        </Alert>
      )}
      
      {!ingredientContext.loading && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              {isEditMode ? 'Edit Inventory Item' : 'Create New Product'}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/ingredients')}
            >
              Back to Inventory
            </Button>
          </Box>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={0}>
                <Tab label="Product profile" sx={{ fontWeight: 'bold', color: 'white', bgcolor: 'primary.main', borderRadius: '4px 4px 0 0' }} />
                <Tab label="Nutrition" />
                <Tab label="Allergens" />
                <Tab label="Images" />
                <Tab label="Order history" />
                <Tab label="Menu items" />
              </Tabs>
            </Box>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Name</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    required
                    placeholder="Product name"
                    name="name"
                    value={ingredient.name}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Code</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    required
                    placeholder="Product code"
                    name="code"
                    value={ingredient.code}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Consumer name</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    placeholder="Consumer name"
                    name="consumerName"
                    value={ingredient.consumerName}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Supplier</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <FormControl fullWidth variant="outlined" required>
                    <Select
                      name="supplier"
                      value={ingredient.supplier}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>-- Select a supplier --</em>;
                        }
                        const supplier = suppliers.find(s => s._id === selected);
                        return supplier ? supplier.name : '';
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>-- Select a supplier --</em>
                      </MenuItem>
                      {suppliers.map(supplier => (
                        <MenuItem key={supplier._id} value={supplier._id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Internal Supplier</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      name="internalSupplier"
                      value={ingredient.internalSupplier}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>-- Select a supplier --</em>;
                        }
                        const supplier = internalSuppliers.find(s => s._id === selected);
                        return supplier ? supplier.name : '';
                      }}
                    >
                      <MenuItem value="">
                        <em>-- Select a supplier --</em>
                      </MenuItem>
                      {internalSuppliers.map(supplier => (
                        <MenuItem key={supplier._id} value={supplier._id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Category</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      name="category"
                      value={ingredient.category}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>Default</em>;
                        }
                        return selected;
                      }}
                    >
                      <MenuItem value="">
                        <em>Default</em>
                      </MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Product groups</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      name="productGroups"
                      multiple
                      value={ingredient.productGroups}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <em>No option selected...</em>;
                        }
                        return selected.map(id => {
                          const group = productGroups.find(g => g._id === id);
                          return group ? group.name : '';
                        }).join(', ');
                      }}
                    >
                      {productGroups.map(group => (
                        <MenuItem key={group._id} value={group._id}>
                          {group.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Item class</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <FormControl fullWidth variant="outlined" required>
                    <Select
                      name="itemClass"
                      value={ingredient.itemClass}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>-- Select an item class --</em>;
                        }
                        return selected.charAt(0).toUpperCase() + selected.slice(1);
                      }}
                    >
                      <MenuItem value="">
                        <em>-- Select an item class --</em>
                      </MenuItem>
                      {classTypes.map(type => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Price</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>£</Typography>
                    <TextField
                      fullWidth
                      required
                      placeholder="Product price"
                      name="price"
                      type="number"
                      value={ingredient.price}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Total UOM</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        required
                        placeholder="Product Unit size"
                        name="totalUOM"
                        value={ingredient.totalUOM}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined" required>
                        <Select
                          name="unitType"
                          value={ingredient.unitType}
                          onChange={handleChange}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <em>-- Select a unit --</em>;
                            }
                            return selected;
                          }}
                        >
                          <MenuItem value="">
                            <em>-- Select a unit --</em>
                          </MenuItem>
                          {unitTypes.map(unit => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Total Units</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Product secondary unit"
                        name="totalUnits"
                        type="number"
                        value={ingredient.totalUnits}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined">
                        <Select
                          name="alternativeUnit"
                          value={ingredient.alternativeUnit}
                          onChange={handleChange}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <em>-- Select a secondary unit --</em>;
                            }
                            return selected;
                          }}
                        >
                          <MenuItem value="">
                            <em>-- Select a secondary unit --</em>
                          </MenuItem>
                          {unitTypes.map(unit => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Alternative unit</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Alternate size"
                        name="alternativeSize"
                        value={ingredient.alternativeSize}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined">
                        <Select
                          displayEmpty
                          renderValue={() => <em>-- Select an alternative unit(s) --</em>}
                        >
                          <MenuItem value="">
                            <em>-- Select an alternative unit(s) --</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Ave. weight</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={ingredient.useAvgWeight}
                        onChange={(e) => setIngredient({ ...ingredient, useAvgWeight: e.target.checked })}
                        name="useAvgWeight"
                      />
                    }
                    label="Use ave. weight"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Pack size</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="Product pack size"
                        name="packSize"
                        type="number"
                        value={ingredient.packSize}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined">
                        <Select
                          name="packSizeUnit"
                          value={ingredient.packSizeUnit}
                          onChange={handleChange}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <em>-- Select a pack size unit --</em>;
                            }
                            return selected;
                          }}
                        >
                          <MenuItem value="">
                            <em>-- Select a pack size unit --</em>
                          </MenuItem>
                          {unitTypes.map(unit => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Split pack</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Checkbox
                    checked={ingredient.splitPack}
                    onChange={(e) => setIngredient({ ...ingredient, splitPack: e.target.checked })}
                    name="splitPack"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Pack size info</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    placeholder="Pack size info"
                    name="packSizeInfo"
                    value={ingredient.packSizeInfo}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Net weight</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    placeholder="Product net weight"
                    name="netWeight"
                    type="number"
                    value={ingredient.netWeight}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Expiration date</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    placeholder="Expiration date"
                    name="expirationDate"
                    type="date"
                    value={ingredient.expirationDate}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Tax class</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      name="taxClass"
                      value={ingredient.taxClass}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>STD</em>;
                        }
                        return selected;
                      }}
                    >
                      <MenuItem value="">
                        <em>STD</em>
                      </MenuItem>
                      {taxClasses.map(taxClass => (
                        <MenuItem key={taxClass} value={taxClass}>
                          {taxClass}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Note</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    placeholder="Product note"
                    name="notes"
                    value={ingredient.notes}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="body1">Compound Ingredients</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    placeholder="Compound Ingredients"
                    name="compoundIngredients"
                    value={ingredient.compoundIngredients}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<SaveIcon />}
                    sx={{ mr: 2 }}
                  >
                    {isEditMode ? 'Update Product' : 'Save Product'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/ingredients')}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default IngredientForm; 