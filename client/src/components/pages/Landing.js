import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import Button from '../common/Button';
import Card from '../common/Card';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalculateIcon from '@mui/icons-material/Calculate';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Landing = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'Recipe Management',
      description: 'Create, organize, and scale your recipes with ease. Calculate costs and manage nutrition information.',
      icon: <RestaurantMenuIcon sx={{ fontSize: '2.5rem' }} />,
      color: theme.palette.primary.main
    },
    {
      title: 'Inventory Control',
      description: 'Track ingredients, monitor stock levels, and manage storage locations efficiently.',
      icon: <InventoryIcon sx={{ fontSize: '2.5rem' }} />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Cost Analysis',
      description: 'Calculate recipe costs, determine margins, and optimize your menu pricing.',
      icon: <CalculateIcon sx={{ fontSize: '2.5rem' }} />,
      color: theme.palette.error.main
    },
    {
      title: 'Supplier Management',
      description: 'Organize supplier information, track orders, and monitor ingredient sourcing.',
      icon: <LocalShippingIcon sx={{ fontSize: '2.5rem' }} />,
      color: theme.palette.success.main
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          backgroundColor: 'background.default',
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 16 }
        }}
      >
        <Container maxWidth="lg" disablePaper>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                  }}
                >
                  Organize Your Kitchen
                  <Box
                    component="span"
                    sx={{
                      color: 'primary.main',
                      position: 'relative',
                      display: 'block'
                    }}
                  >
                    Streamline Your Workflow
                  </Box>
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: '1.125rem',
                    mb: 4,
                    color: 'text.secondary',
                    maxWidth: 520
                  }}
                >
                  Recipify helps food service businesses manage recipes, ingredients, and suppliers all in one place. Save time, reduce waste, and improve profitability.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                  >
                    Sign In
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 500 },
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
                    zIndex: 1
                  }
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1968&q=80"
                  alt="Professional kitchen"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 }, 
          backgroundColor: 'background.paper' 
        }}
      >
        <Container maxWidth="lg" disablePaper>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2
              }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Recipify combines everything you need to run your food service operation efficiently in one intuitive platform.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{ height: '100%' }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 3
                    }}
                  >
                    <Box 
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: feature.color,
                        mr: 3
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography 
                        variant="h5" 
                        component="h3"
                        sx={{ 
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 10 }, 
          backgroundColor: 'background.default' 
        }}
      >
        <Container maxWidth="md" disablePaper>
          <Card>
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: { xs: 3, md: 5 },
                px: { xs: 3, md: 8 }
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2
                }}
              >
                Ready to streamline your kitchen operations?
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Join thousands of food service professionals who are saving time and money with Recipify.
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Get Started Now
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 