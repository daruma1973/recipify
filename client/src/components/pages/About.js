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
import LocalBarIcon from '@mui/icons-material/LocalBar';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalculateIcon from '@mui/icons-material/Calculate';
import LiquorIcon from '@mui/icons-material/Liquor';
import WineBarIcon from '@mui/icons-material/WineBar';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            About Recipify
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            The Ultimate Cocktail Management Platform for Professional Bartenders
          </Typography>
          <Divider sx={{ my: 3 }} />
        </Box>

        <Typography variant="body1" paragraph>
          Recipify is a comprehensive cocktail management system designed specifically for professional bartenders and cocktail bars. 
          Our platform streamlines the process of creating, costing, and managing cocktail recipes, helping you optimize your bar operations 
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
                  <LocalBarIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Cocktail Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Create, store, and organize your signature cocktails in one central location. Add detailed instructions, 
                  mixing methods, and presentation notes. Categorize drinks for easy access and search.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LiquorIcon color="secondary" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Spirit & Mixer Database</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Maintain a comprehensive database of spirits, mixers, and garnishes with costs, ABV information, 
                  and product details. Link products to distributors for streamlined ordering and inventory management.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalculateIcon color="success" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Pour Cost Analysis</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Automatically calculate cocktail costs based on spirit and mixer prices. Determine accurate pour costs, 
                  selling prices, and profit margins. Analyze the financial performance of your signature drinks.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShippingIcon color="info" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Distributor Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Keep track of your liquor distributors with detailed contact information. Associate products with specific 
                  distributors for streamlined ordering and bar inventory management.
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
            Recipify was developed by a team of software engineers with extensive experience in the bar and hospitality industry. 
            We understand the unique challenges faced by professional bartenders and bar managers, and we've built this 
            platform to address those specific needs.
          </Typography>
          <Typography variant="body1">
            Our mission is to help cocktail bars optimize their operations, reduce waste, and increase profitability 
            through better cocktail recipe and spirit inventory management.
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