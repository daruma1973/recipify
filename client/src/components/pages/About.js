import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalculateIcon from '@mui/icons-material/Calculate';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            About Recipify
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            The Ultimate Recipe Management Platform for Professional Chefs
          </Typography>
          <Divider sx={{ my: 3 }} />
        </Box>

        <Typography variant="body1" paragraph>
          Recipify is a comprehensive recipe management system designed specifically for professional chefs and food service businesses. 
          Our platform streamlines the process of creating, costing, and managing recipes, helping you optimize your kitchen operations 
          and maximize profitability.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Key Features
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RestaurantMenuIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Recipe Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Create, store, and organize your recipes in one central location. Add detailed instructions, 
                  cooking methods, and preparation notes. Categorize recipes for easy access and search.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InventoryIcon color="secondary" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Ingredient Database</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Maintain a comprehensive database of ingredients with costs, allergen information, 
                  and nutritional data. Link ingredients to suppliers for streamlined ordering and inventory management.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalculateIcon color="success" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Cost Analysis</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Automatically calculate recipe costs based on ingredient prices. Determine accurate portion costs, 
                  selling prices, and profit margins. Analyze the financial performance of your menu items.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShippingIcon color="info" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Supplier Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Keep track of your suppliers with detailed contact information. Associate ingredients with specific 
                  suppliers for streamlined ordering and inventory management.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            About the Team
          </Typography>
          <Typography variant="body1" paragraph>
            Recipify was developed by a team of software engineers with extensive experience in the food service industry. 
            We understand the unique challenges faced by professional chefs and kitchen managers, and we've built this 
            platform to address those specific needs.
          </Typography>
          <Typography variant="body1">
            Our mission is to help food service businesses optimize their operations, reduce waste, and increase profitability 
            through better recipe and ingredient management.
          </Typography>
        </Box>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Version 1.0.0
          </Typography>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Recipify. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About; 