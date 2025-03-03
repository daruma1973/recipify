import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AuthContext from '../../context/auth/authContext';
import CostingContext from '../../context/costing/costingContext';

const Costing = () => {
  const authContext = useContext(AuthContext);
  const costingContext = useContext(CostingContext);

  const { loadUser } = authContext;
  const { costReports, getCostReports } = costingContext;

  // Load user data and cost reports when component mounts
  useEffect(() => {
    loadUser();
    getCostReports();
    // eslint-disable-next-line
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recipe Costing & Pricing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Calculate recipe costs, determine optimal pricing, and track profitability.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Actions */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Costing Tools
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent sx={{ minHeight: '180px' }}>
                    <CalculateIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" component="div">
                      Cost Calculator
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calculate the cost of your recipes including ingredients, labor, overhead, and packaging costs.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to="/costing/calculator"
                      color="primary"
                    >
                      Open Calculator
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent sx={{ minHeight: '180px' }}>
                    <AssessmentIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" component="div">
                      Cost Reports
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View and manage your saved cost calculations and pricing reports.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to="/costing/reports"
                      color="primary"
                    >
                      View Reports
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent sx={{ minHeight: '180px' }}>
                    <RestaurantIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" component="div">
                      Menu Analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Analyze your menu items by cost, popularity, and profitability to optimize your offerings.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to="/costing/menu-analysis"
                      color="primary"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent sx={{ minHeight: '180px' }}>
                    <TrendingUpIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" component="div">
                      Profitability Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track the profitability of your recipes over time and identify opportunities for improvement.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to="/costing/profitability"
                      color="primary"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Reports */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Cost Reports
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {costReports && costReports.length > 0 ? (
              <Box>
                {costReports.slice(0, 5).map((report) => (
                  <Box key={report._id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                    <Typography variant="subtitle1" component={Link} to={`/costing/reports/${report._id}`} sx={{ 
                      textDecoration: 'none', 
                      color: 'primary.main',
                      display: 'block',
                      mb: 0.5
                    }}>
                      {report.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recipe: {report.recipeName}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2">
                        Cost: ${report.totalCost}
                      </Typography>
                      <Typography variant="body2">
                        Price: ${report.suggestedPrice}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/costing/reports"
                  >
                    View All Reports
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  No cost reports yet
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/costing/calculator"
                >
                  Create Your First Report
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Costing; 