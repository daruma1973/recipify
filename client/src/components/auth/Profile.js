import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AlertTitle
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import axios from 'axios';

const Profile = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { user, loading, error, loadUser, clearErrors } = authContext;
  const { setAlert } = alertContext;

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user'
      });
    }
  }, [user]);

  // Handle error alerts
  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setUpdateSuccess(false);

    try {
      // DEVELOPMENT MODE: Always use a dummy token
      const token = 'dummy-token-for-development';
      
      // Store the dummy token in localStorage in case it's missing
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', token);
        console.log('DEVELOPMENT MODE: Stored dummy token in localStorage');
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.put('/api/users/profile', profileData, config);
      
      if (res.data) {
        setUpdateSuccess(true);
        loadUser(); // Reload user data
        setAlert('Profile updated successfully', 'success');
      }
    } catch (err) {
      setAlert(
        err.response && err.response.data.msg 
          ? err.response.data.msg 
          : 'Error updating profile',
        'error'
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess(false);

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    // Validate password inputs
    if (newPassword !== confirmPassword) {
      setAlert('New passwords do not match', 'error');
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setAlert('Password must be at least 6 characters', 'error');
      setPasswordLoading(false);
      return;
    }

    try {
      // DEVELOPMENT MODE: Always use a dummy token
      const token = 'dummy-token-for-development';
      
      // Store the dummy token in localStorage in case it's missing
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', token);
        console.log('DEVELOPMENT MODE: Stored dummy token in localStorage');
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.put(
        '/api/users/password',
        {
          currentPassword,
          newPassword
        },
        config
      );
      
      if (res.data) {
        setPasswordSuccess(true);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setAlert('Password updated successfully', 'success');
      }
    } catch (err) {
      setAlert(
        err.response && err.response.data.msg 
          ? err.response.data.msg 
          : 'Error updating password',
        'error'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Development Mode</AlertTitle>
        Authentication is bypassed. Profile updates will work without requiring login.
        If you encounter any issues, check the browser console for details.
      </Alert>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <AccountCircleIcon />
              </Avatar>
              <Typography variant="h6">
                Profile Information
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={updateProfile}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                    disabled
                  />
                  <Typography variant="caption" color="text.secondary">
                    Email cannot be changed
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth disabled>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      name="role"
                      value={profileData.role}
                      label="Role"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="chef">Chef</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary">
                    Role cannot be changed by user
                  </Typography>
                </Grid>
                
                {updateSuccess && (
                  <Grid item xs={12}>
                    <Alert severity="success">
                      Profile updated successfully!
                    </Alert>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={profileLoading}
                    fullWidth
                  >
                    {profileLoading ? <CircularProgress size={24} /> : 'Update Profile'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <LockIcon />
              </Avatar>
              <Typography variant="h6">
                Change Password
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={updatePassword}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    helperText="Password must be at least 6 characters"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                
                {passwordSuccess && (
                  <Grid item xs={12}>
                    <Alert severity="success">
                      Password updated successfully!
                    </Alert>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={<LockIcon />}
                    disabled={passwordLoading}
                    fullWidth
                  >
                    {passwordLoading ? <CircularProgress size={24} /> : 'Change Password'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 