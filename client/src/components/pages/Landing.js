import React from 'react';
import { Box, Typography, Grid, useTheme, Button as MuiButton, Paper, Stack, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Container from '../layout/Container';
import Button from '../common/Button';
import Card from '../common/Card';

// Icons
import LocalBarIcon from '@mui/icons-material/LocalBar';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalculateIcon from '@mui/icons-material/Calculate';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import LiquorIcon from '@mui/icons-material/Liquor';
import WineBarIcon from '@mui/icons-material/WineBar';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(16),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(12),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: `radial-gradient(circle at 20% 25%, ${theme.palette.primary.light}22 0%, transparent 50%),
                radial-gradient(circle at 80% 75%, ${theme.palette.secondary.light}22 0%, transparent 50%)`,
    zIndex: 0,
  }
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(4),
  borderRadius: 16,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[4],
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, transparent, transparent)',
    transition: 'background 0.3s ease',
  },
  '&:hover::after': {
    background: 'linear-gradient(90deg, #6366F1, #F97316)',
  }
}));

const FeatureIcon = styled(Box)(({ theme, color }) => ({
  width: 64,
  height: 64,
  borderRadius: 16,
  backgroundColor: `${color}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 32,
    color: color,
  }
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: theme.shadows[1],
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #6366F1, #F97316)',
  }
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
}));

const Landing = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'Cocktail Management',
      description: 'Create, organize, and perfect your signature cocktails. Calculate costs and manage spirit information.',
      icon: <LocalBarIcon />,
      color: theme.palette.primary.main
    },
    {
      title: 'Bar Inventory',
      description: 'Track spirits, mixers, and garnishes. Monitor stock levels and manage storage efficiently.',
      icon: <InventoryIcon />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Pour Cost Analysis',
      description: 'Calculate drink costs, determine margins, and optimize your cocktail menu pricing.',
      icon: <CalculateIcon />,
      color: theme.palette.error.main
    },
    {
      title: 'Supplier Management',
      description: 'Organize distributor information, track orders, and monitor spirit sourcing.',
      icon: <LocalShippingIcon />,
      color: theme.palette.success.main
    }
  ];

  const benefits = [
    {
      title: 'Reduce Waste',
      description: 'Track inventory levels accurately to minimize waste and optimize ordering of spirits and mixers.',
      icon: <CheckCircleOutlineIcon />,
    },
    {
      title: 'Increase Efficiency',
      description: 'Streamline bar operations and save time with digital cocktail recipe management.',
      icon: <SpeedIcon />,
    },
    {
      title: 'Improve Profitability',
      description: 'Analyze pour costs and optimize pricing to maximize your profit margins.',
      icon: <TrendingUpIcon />,
    },
    {
      title: 'Data-Driven Decisions',
      description: 'Make informed decisions based on real-time analytics of your most popular cocktails.',
      icon: <BarChartIcon />,
    }
  ];

  const testimonials = [
    {
      quote: "Recipify has transformed how we manage our cocktail bar. We've reduced waste by 30% and improved our profit margins significantly.",
      author: "Sarah Johnson",
      role: "Bar Manager, The Copper Still"
    },
    {
      quote: "The pour cost analysis feature alone has saved us thousands of dollars. I can't imagine running our bar without Recipify now.",
      author: "Michael Chen",
      role: "Owner, Elixir Lounge"
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" disablePaper>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} sx={{ position: 'relative', zIndex: 1 }}>
              <Box className="animate-fade-in">
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                  }}
                >
                  Elevate Your Bar
                  <Box component="span" sx={{ display: 'block', mt: 1 }}>
                    <GradientText variant="h1" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                      Perfect Your Cocktails
                    </GradientText>
                  </Box>
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: '1.125rem',
                    mb: 4,
                    color: 'text.secondary',
                    maxWidth: 520,
                    lineHeight: 1.6
                  }}
                >
                  Recipify helps cocktail bars manage recipes, spirits, and suppliers all in one place. Save time, reduce waste, and improve profitability behind the bar.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} className="animate-slide-up">
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 500 },
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
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
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                  alt="Cocktail bar"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 }, 
          backgroundColor: 'background.paper' 
        }}
      >
        <Container maxWidth="lg" disablePaper>
          <Box sx={{ textAlign: 'center', mb: 8 }} className="animate-fade-in">
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 800,
                mb: 2
              }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                maxWidth: 700,
                mx: 'auto',
                fontSize: '1.125rem',
                lineHeight: 1.6
              }}
            >
              Recipify combines everything you need to run your cocktail bar efficiently in one intuitive platform.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index} className="animate-slide-up" sx={{ animationDelay: `${index * 0.1}s` }}>
                <FeatureCard>
                  <FeatureIcon color={feature.color}>
                    {feature.icon}
                  </FeatureIcon>
                  <Typography 
                    variant="h5" 
                    component="h3"
                    sx={{ 
                      fontWeight: 700,
                      mb: 1.5
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 }, 
          backgroundColor: 'background.default',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: `radial-gradient(circle at 70% 50%, ${theme.palette.primary.light}15 0%, transparent 60%)`,
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="lg" disablePaper>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5} sx={{ position: 'relative', zIndex: 1 }}>
              <Box className="animate-fade-in">
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 3
                  }}
                >
                  Why Choose <GradientText>Recipify</GradientText>
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    fontSize: '1.125rem',
                    lineHeight: 1.6
                  }}
                >
                  Our platform is designed specifically for cocktail bars and mixologists, with features that address the unique challenges of bar management.
                </Typography>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                >
                  Start Free Trial
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={3}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index} className="animate-slide-up" sx={{ animationDelay: `${index * 0.1}s` }}>
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          color: 'primary.main', 
                          mr: 2,
                          '& svg': { fontSize: 28 }
                        }}>
                          {benefit.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={700}>
                          {benefit.title}
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 }, 
          backgroundColor: 'background.paper' 
        }}
      >
        <Container maxWidth="lg" disablePaper>
          <Box sx={{ textAlign: 'center', mb: 8 }} className="animate-fade-in">
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 800,
                mb: 2
              }}
            >
              What Our Users Say
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                maxWidth: 700,
                mx: 'auto',
                fontSize: '1.125rem',
                lineHeight: 1.6
              }}
            >
              Hear from bartenders and bar owners who have transformed their operations with Recipify.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index} className="animate-slide-up">
                <TestimonialCard>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3, 
                      fontStyle: 'italic',
                      fontSize: '1.125rem',
                      lineHeight: 1.6,
                      position: 'relative',
                      '&::before': {
                        content: '"""',
                        fontSize: '4rem',
                        position: 'absolute',
                        top: -20,
                        left: -10,
                        opacity: 0.1,
                        color: theme.palette.primary.main,
                        fontFamily: 'serif'
                      }
                    }}
                  >
                    {testimonial.quote}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {testimonial.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </TestimonialCard>
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
          <Paper
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              background: 'linear-gradient(135deg, #6366F1, #F97316)',
              boxShadow: theme.shadows[3],
            }}
          >
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: { xs: 5, md: 7 },
                px: { xs: 3, md: 8 },
                color: 'white',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: 'white'
                }}
              >
                Ready to elevate your cocktail program?
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 4,
                  fontSize: '1.125rem',
                  maxWidth: 700,
                  mx: 'auto',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.6
                }}
              >
                Join hundreds of bars and mixologists who are saving time, reducing waste, and increasing profits with Recipify.
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                Get Started Today
              </Button>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: 'url(https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80) center/cover no-repeat',
              }}
            />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 