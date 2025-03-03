import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlertContext from '../../context/alert/alertContext';
import {
  Box,
  Typography,
  Grid,
  Alert,
  TextField,
  useTheme
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '../layout/Container';
import Button from '../common/Button';
import Card from '../common/Card';

const Register = () => {
  const alertContext = useContext(AlertContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const { setAlert } = alertContext;

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    
    if (password !== password2) {
      setAlert('Passwords do not match', 'error');
    } else {
      console.log('Registration bypassed - navigating directly to dashboard');
      
      // Store a dummy token to simulate authentication
      localStorage.setItem('token', 'dummy-token-for-development');
      
      // Navigate directly to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth="sm" disablePaper>
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5
        }}
      >
        <Box 
          sx={{ 
            width: 70, 
            height: 70, 
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3 
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 32, color: '#fff' }} />
        </Box>
        <Typography 
          component="h1" 
          variant="h3"
          sx={{ 
            fontWeight: 700,
            mb: 1
          }}
        >
          Create Account
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: 450, mb: 4 }}
        >
          Join Recipify today to organize your recipes, manage inventory, and streamline your kitchen operations.
        </Typography>
      </Box>
      
      <Card>
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3, 
            borderRadius: theme.shape.borderRadius,
            backgroundColor: 'rgba(3, 169, 244, 0.08)'
          }}
        >
          Authentication is bypassed in development mode. Registration will not create a real user.
        </Alert>
        
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={name}
                onChange={onChange}
                autoComplete="name"
                placeholder="Enter your name"
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: theme.shape.borderRadius,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={onChange}
                autoComplete="email"
                placeholder="Enter your email"
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: theme.shape.borderRadius,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={onChange}
                autoComplete="new-password"
                placeholder="Create a password"
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: theme.shape.borderRadius,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                value={password2}
                onChange={onChange}
                autoComplete="new-password"
                placeholder="Confirm your password"
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: theme.shape.borderRadius,
                  }
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 4, mb: 2 }}
          >
            Create Account
          </Button>
          <Box 
            sx={{ 
              mt: 3, 
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  fontWeight: 500
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default Register; 