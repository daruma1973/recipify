import React, { useContext, useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SettingsContext from '../../context/settings/settingsContext';

const Settings = () => {
  const settingsContext = useContext(SettingsContext);
  const { settings, updateSettings, loading, error } = settingsContext;
  
  const [formData, setFormData] = useState({
    companyName: '',
    country: '',
    fiscalYearStart: '',
    currencySymbol: '',
    currencyCode: '',
    taxVat: '',
    wastage: '',
    dateFormat: '',
    timeFormat: '',
    displayDateWithTime: '',
    isCPU: ''
  });
  
  const [success, setSuccess] = useState(false);
  
  // Load current settings when component mounts
  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || '',
        country: settings.country || '',
        fiscalYearStart: settings.fiscalYearStart || '',
        currencySymbol: settings.currencySymbol || '',
        currencyCode: settings.currencyCode || '',
        taxVat: settings.taxVat || '',
        wastage: settings.wastage || '',
        dateFormat: settings.dateFormat || '',
        timeFormat: settings.timeFormat || '',
        displayDateWithTime: settings.displayDateWithTime || 'Yes',
        isCPU: settings.isCPU || 'No'
      });
    }
  }, [settings]);
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSwitchChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.checked ? 'Yes' : 'No' });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    const result = await updateSettings(formData);
    if (result) {
      setSuccess(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSuccess(false);
  };
  
  const dateFormats = [
    'D d M Y', // 'Thu 1 Apr 2023'
    'd M Y',   // '1 Apr 2023'
    'M d, Y',  // 'Apr 1, 2023'
    'Y-m-d',   // '2023-04-01'
    'd/m/Y',   // '01/04/2023'
    'm/d/Y'    // '04/01/2023'
  ];
  
  const timeFormats = [
    'h:i A',   // '9:30 AM'
    'H:i'      // '09:30'
  ];
  
  return (
    <Container maxWidth="md">
      <Box mt={4} mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Configure your application settings
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">General Settings</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fiscal Year Start"
                name="fiscalYearStart"
                value={formData.fiscalYearStart}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g. 1st April"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Financial Settings</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Currency Symbol"
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Currency Code"
                name="currencyCode"
                value={formData.currencyCode}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tax/VAT %"
                name="taxVat"
                value={formData.taxVat}
                onChange={handleChange}
                variant="outlined"
                type="number"
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Wastage %"
                name="wastage"
                value={formData.wastage}
                onChange={handleChange}
                variant="outlined"
                type="number"
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Display Settings</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Date Format</InputLabel>
                <Select
                  name="dateFormat"
                  value={formData.dateFormat}
                  onChange={handleChange}
                  label="Date Format"
                >
                  {dateFormats.map(format => (
                    <MenuItem key={format} value={format}>
                      {format}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Time Format</InputLabel>
                <Select
                  name="timeFormat"
                  value={formData.timeFormat}
                  onChange={handleChange}
                  label="Time Format"
                >
                  {timeFormats.map(format => (
                    <MenuItem key={format} value={format}>
                      {format}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.displayDateWithTime === 'Yes'}
                    onChange={handleSwitchChange}
                    name="displayDateWithTime"
                    color="primary"
                  />
                }
                label="Display date with time"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isCPU === 'Yes'}
                    onChange={handleSwitchChange}
                    name="isCPU"
                    color="primary"
                  />
                }
                label="Is CPU (Central Production Unit)"
              />
            </Grid>
          </Grid>
          
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              Save Settings
            </Button>
          </Box>
        </form>
      </Paper>
      
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Settings updated successfully!
        </Alert>
      </Snackbar>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default Settings; 