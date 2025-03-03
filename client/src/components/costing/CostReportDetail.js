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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalculateIcon from '@mui/icons-material/Calculate';
import AuthContext from '../../context/auth/authContext';
import CostingContext from '../../context/costing/costingContext';
import AlertContext from '../../context/alert/alertContext';

const CostReportDetail = () => {
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

  const navigate = useNavigate();
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Load user data and cost reports when component mounts
  useEffect(() => {
    loadUser();
    getCostReports();
    // eslint-disable-next-line
  }, []);

  // Find the report with the matching ID
  useEffect(() => {
    if (costReports && costReports.length > 0) {
      const foundReport = costReports.find(report => report._id === id);
      if (foundReport) {
        setReport(foundReport);
      } else {
        setAlert('Cost report not found', 'error');
        navigate('/costing/reports');
      }
    }
  }, [costReports, id, setAlert, navigate]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteCostCalculation(id);
    setAlert('Cost report deleted successfully', 'success');
    setOpenDeleteDialog(false);
    navigate('/costing/reports');
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading || !report) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Cost Report
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/costing/reports')}
            sx={{ mr: 1 }}
          >
            Back to Reports
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

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              {report.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created on {formatDate(report.date)}
            </Typography>
          </Box>
          <Box>
            <Button 
              startIcon={<PrintIcon />} 
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            <Button startIcon={<ShareIcon />}>
              Share
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recipe Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Recipe:</strong> {report.recipeName}
                </Typography>
              </Box>
              {report.recipeServings && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">
                    <strong>Servings:</strong> {report.recipeServings}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pricing Parameters
              </Typography>
              <Typography variant="body1">
                <strong>Target Food Cost Percentage:</strong> {report.targetFoodCostPercentage}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cost Summary
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Total Cost
                    </Typography>
                    <Typography variant="h4">
                      ${report.totalCost}
                    </Typography>
                    <Typography variant="body2">
                      ${report.costPerServing} per serving
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
                      ${report.suggestedPrice}
                    </Typography>
                    <Typography variant="body2">
                      ${report.suggestedPricePerServing} per serving
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
                      ${report.profit}
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
                      {report.profitMargin}%
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
                    <TableCell align="right">${report.totalIngredientCost}</TableCell>
                    <TableCell align="right">
                      {(parseFloat(report.totalIngredientCost) / parseFloat(report.totalCost) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Labor</TableCell>
                    <TableCell align="right">${report.laborCost}</TableCell>
                    <TableCell align="right">
                      {(parseFloat(report.laborCost) / parseFloat(report.totalCost) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Overhead</TableCell>
                    <TableCell align="right">${report.overheadCost}</TableCell>
                    <TableCell align="right">
                      {(parseFloat(report.overheadCost) / parseFloat(report.totalCost) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Packaging</TableCell>
                    <TableCell align="right">${report.packagingCost}</TableCell>
                    <TableCell align="right">
                      {(parseFloat(report.packagingCost) / parseFloat(report.totalCost) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>${report.totalCost}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ingredient Costs
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ingredient</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.ingredientCosts.map((ingredient, index) => (
                    <TableRow key={index}>
                      <TableCell>{ingredient.name}</TableCell>
                      <TableCell align="right">{ingredient.quantity} {ingredient.unit}</TableCell>
                      <TableCell align="right">${ingredient.totalCost}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total Ingredient Cost</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>${report.totalIngredientCost}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CalculateIcon />}
                component={Link}
                to={`/costing/calculator?recipeId=${report.recipeId}`}
                fullWidth
              >
                Recalculate
              </Button>
            </Box>
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

export default CostReportDetail; 