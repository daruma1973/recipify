import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import AuthContext from '../../context/auth/authContext';
import RecipeContext from '../../context/recipe/recipeContext';
import CostingContext from '../../context/costing/costingContext';
import AlertContext from '../../context/alert/alertContext';

const CostCalculator = () => {
  const authContext = useContext(AuthContext);
  const recipeContext = useContext(RecipeContext);
  const costingContext = useContext(CostingContext);
  const alertContext = useContext(AlertContext);

  const { loadUser } = authContext;
  const { recipes, getRecipes, loading: recipesLoading } = recipeContext;
  const { 
    calculateRecipeCost, 
    saveCostCalculation, 
    currentCalculation, 
    loading: costingLoading 
  } = costingContext;
  const { setAlert } = alertContext;

  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    recipeId: '',
    laborCost: 0,
    overheadCost: 0,
    packagingCost: 0,
    targetFoodCostPercentage: 30
  });

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [reportName, setReportName] = useState('');

  const { recipeId, laborCost, overheadCost, packagingCost, targetFoodCostPercentage } = formData;

  // Load user data and recipes when component mounts
  useEffect(() => {
    loadUser();
    getRecipes();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    
    if (!recipeId) {
      setAlert('Please select a recipe', 'error');
      return;
    }

    try {
      await calculateRecipeCost(recipeId, {
        laborCost: parseFloat(laborCost) || 0,
        overheadCost: parseFloat(overheadCost) || 0,
        packagingCost: parseFloat(packagingCost) || 0,
        targetFoodCostPercentage: parseFloat(targetFoodCostPercentage) || 30
      });
    } catch (err) {
      setAlert('Error calculating recipe cost', 'error');
    }
  };

  const handleSaveClick = () => {
    if (!currentCalculation) {
      setAlert('Please calculate a recipe cost first', 'error');
      return;
    }
    
    setSaveDialogOpen(true);
    setReportName(`${currentCalculation.recipeName} Cost Analysis - ${new Date().toLocaleDateString()}`);
  };

  const handleSaveConfirm = async () => {
    if (!reportName.trim()) {
      setAlert('Please enter a name for the report', 'error');
      return;
    }

    try {
      const savedReport = await saveCostCalculation({
        ...currentCalculation,
        name: reportName
      });
      
      setSaveDialogOpen(false);
      setAlert('Cost calculation saved successfully', 'success');
      
      // Navigate to the report detail page
      navigate(`/costing/reports/${savedReport._id}`);
    } catch (err) {
      setAlert('Error saving cost calculation', 'error');
    }
  };

  const handleSaveCancel = () => {
    setSaveDialogOpen(false);
  };

  const loading = recipesLoading || costingLoading;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Recipe Cost Calculator
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/costing')}
        >
          Back to Costing
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Calculator Form */}
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cost Parameters
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleCalculate}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="recipe-select-label">Select Recipe</InputLabel>
                    <Select
                      labelId="recipe-select-label"
                      id="recipeId"
                      name="recipeId"
                      value={recipeId}
                      onChange={handleChange}
                      label="Select Recipe"
                      disabled={loading}
                    >
                      <MenuItem value="">
                        <em>Select a recipe</em>
                      </MenuItem>
                      {recipes && recipes.map(recipe => (
                        <MenuItem key={recipe._id} value={recipe._id}>
                          {recipe.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Additional Costs
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Labor Cost"
                    name="laborCost"
                    type="number"
                    value={laborCost}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      inputProps: { min: 0, step: 0.01 }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Overhead Cost"
                    name="overheadCost"
                    type="number"
                    value={overheadCost}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      inputProps: { min: 0, step: 0.01 }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Packaging Cost"
                    name="packagingCost"
                    type="number"
                    value={packagingCost}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      inputProps: { min: 0, step: 0.01 }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Pricing Parameters
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Target Food Cost Percentage"
                    name="targetFoodCostPercentage"
                    type="number"
                    value={targetFoodCostPercentage}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      inputProps: { min: 1, max: 100, step: 1 }
                    }}
                    helperText="Typical food cost percentage is 25-35%"
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    startIcon={<CalculateIcon />}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Calculate Cost'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={7}>
          {currentCalculation ? (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Cost Analysis Results
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                >
                  Save Report
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {currentCalculation.recipeName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    Servings: {currentCalculation.recipeServings}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Total Cost
                      </Typography>
                      <Typography variant="h4">
                        ${currentCalculation.totalCost}
                      </Typography>
                      <Typography variant="body2">
                        ${currentCalculation.costPerServing} per serving
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Suggested Price
                      </Typography>
                      <Typography variant="h4">
                        ${currentCalculation.suggestedPrice}
                      </Typography>
                      <Typography variant="body2">
                        ${currentCalculation.suggestedPricePerServing} per serving
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Profit
                      </Typography>
                      <Typography variant="h5">
                        ${currentCalculation.profit}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Profit Margin
                      </Typography>
                      <Typography variant="h5">
                        {currentCalculation.profitMargin}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Cost Breakdown
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">% of Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Ingredients</TableCell>
                      <TableCell align="right">${currentCalculation.totalIngredientCost}</TableCell>
                      <TableCell align="right">
                        {(parseFloat(currentCalculation.totalIngredientCost) / parseFloat(currentCalculation.totalCost) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Labor</TableCell>
                      <TableCell align="right">${currentCalculation.laborCost}</TableCell>
                      <TableCell align="right">
                        {(parseFloat(currentCalculation.laborCost) / parseFloat(currentCalculation.totalCost) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Overhead</TableCell>
                      <TableCell align="right">${currentCalculation.overheadCost}</TableCell>
                      <TableCell align="right">
                        {(parseFloat(currentCalculation.overheadCost) / parseFloat(currentCalculation.totalCost) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Packaging</TableCell>
                      <TableCell align="right">${currentCalculation.packagingCost}</TableCell>
                      <TableCell align="right">
                        {(parseFloat(currentCalculation.packagingCost) / parseFloat(currentCalculation.totalCost) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>${currentCalculation.totalCost}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" gutterBottom>
                Ingredient Costs
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ingredient</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">Unit Cost</TableCell>
                      <TableCell align="right">Total Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentCalculation.ingredientCosts.map((ingredient, index) => (
                      <TableRow key={index}>
                        <TableCell>{ingredient.name}</TableCell>
                        <TableCell>{ingredient.quantity} {ingredient.unit}</TableCell>
                        <TableCell align="right">${ingredient.unitCost}</TableCell>
                        <TableCell align="right">${ingredient.totalCost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" align="center" color="text.secondary">
                Select a recipe and calculate its cost
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 1 }}>
                The cost analysis will appear here
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Save Report Dialog */}
      <Dialog open={saveDialogOpen} onClose={handleSaveCancel}>
        <DialogTitle>Save Cost Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for this cost report to save it for future reference.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Report Name"
            type="text"
            fullWidth
            variant="outlined"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveCancel}>Cancel</Button>
          <Button onClick={handleSaveConfirm} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CostCalculator; 