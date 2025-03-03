import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Divider,
  IconButton,
  Paper,
  Button,
  Stack
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'light' 
          ? theme.palette.grey[100] 
          : theme.palette.grey[900],
        color: (theme) => theme.palette.mode === 'light'
          ? theme.palette.grey[800]
          : theme.palette.grey[100],
      }}
    >
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(12, 1fr)'
            },
            gap: 4,
            mb: 6
          }}
        >
          {/* Brand and About - Spans 4 columns */}
          <Box sx={{ gridColumn: { md: 'span 4' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RestaurantMenuIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h5" component="div" fontWeight="bold">
                Recipify
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 4, maxWidth: '90%' }}>
              A chef's recipe and ingredient management platform designed to streamline kitchen operations, 
              control costs and boost your culinary creativity.
            </Typography>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 4,
                bgcolor: 'rgba(25, 118, 210, 0.04)',
                border: '1px solid',
                borderColor: 'primary.light'
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Subscribe to our newsletter
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Get the latest recipes and culinary tips directly to your inbox.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Subscribe Now
              </Button>
            </Paper>
          </Box>

          {/* Quick Links - Spans 3 columns */}
          <Box sx={{ gridColumn: { md: 'span 3' } }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1.5}>
              <Link 
                component={RouterLink} 
                to="/" 
                sx={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 'medium',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Home
              </Link>
              <Link 
                component={RouterLink} 
                to="/about" 
                sx={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 'medium',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                About
              </Link>
              <Link 
                component={RouterLink} 
                to="/recipes" 
                sx={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 'medium',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Recipes
              </Link>
              <Link 
                component={RouterLink} 
                to="/register" 
                sx={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 'medium',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Register
              </Link>
              <Link 
                component={RouterLink} 
                to="/login" 
                sx={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 'medium',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Login
              </Link>
            </Stack>
          </Box>

          {/* Contact Us - Spans 5 columns */}
          <Box sx={{ gridColumn: { md: 'span 5' } }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
                <Typography variant="body2">
                  info@recipify.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalPhoneIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
                <Typography variant="body2">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1.5, mt: 0.5, color: 'primary.main' }} />
                <Typography variant="body2">
                  123 Kitchen Street, Culinary City, CC 12345
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                color="primary" 
                aria-label="Facebook" 
                component="a" 
                href="#" 
                target="_blank"
                sx={{ 
                  bgcolor: 'rgba(25, 118, 210, 0.1)', 
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' } 
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                color="primary" 
                aria-label="Twitter" 
                component="a" 
                href="#" 
                target="_blank"
                sx={{ 
                  bgcolor: 'rgba(25, 118, 210, 0.1)', 
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' } 
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                color="primary" 
                aria-label="Instagram" 
                component="a" 
                href="#" 
                target="_blank"
                sx={{ 
                  bgcolor: 'rgba(25, 118, 210, 0.1)', 
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' } 
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                color="primary" 
                aria-label="LinkedIn" 
                component="a" 
                href="#" 
                target="_blank"
                sx={{ 
                  bgcolor: 'rgba(25, 118, 210, 0.1)', 
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' } 
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ borderColor: 'divider' }} />
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            pt: 3 
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            &copy; {new Date().getFullYear()} Recipify. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link 
              component={RouterLink} 
              to="/privacy"
              sx={{ 
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '0.875rem',
                opacity: 0.8,
                '&:hover': { 
                  opacity: 1,
                  color: 'primary.main' 
                }
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              component={RouterLink} 
              to="/terms"
              sx={{ 
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '0.875rem',
                opacity: 0.8,
                '&:hover': { 
                  opacity: 1,
                  color: 'primary.main' 
                }
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 