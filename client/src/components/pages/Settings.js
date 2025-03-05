import React, { useContext, useState, useEffect } from 'react';
import {
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
  Snackbar,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PublicIcon from '@mui/icons-material/Public';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PercentIcon from '@mui/icons-material/Percent';
import SettingsContext from '../../context/settings/settingsContext';

// Styled components for bento design
const BentoBox = styled(Paper)(({ theme, elevation = 0, active = false }) => ({
  height: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  padding: theme.spacing(2.5),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  ...(active && {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
    padding: theme.spacing(2.4),
  }),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[3],
  },
}));

const SectionTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& svg': {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main,
    fontSize: 24,
  },
  '& .MuiTypography-root': {
    fontWeight: 600,
  }
}));

const Settings = () => {
  const settingsContext = useContext(SettingsContext);
  const { settings, updateSettings, loading, error } = settingsContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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
  const [activeSection, setActiveSection] = useState('company');
  
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

  const handleSectionClick = (section) => {
    setActiveSection(section);
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

  // Sample of formatted date for preview
  const getDateFormatPreview = (format) => {
    const date = new Date();
    let formattedDate = format;
    
    // Replace format tokens with actual values
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dayOfWeek = date.getDay();
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    formattedDate = formattedDate
      .replace('d', day.toString().padStart(2, '0'))
      .replace('m', (month + 1).toString().padStart(2, '0'))
      .replace('Y', year)
      .replace('M', monthNames[month])
      .replace('D', dayNames[dayOfWeek]);
    
    return formattedDate;
  };

  // Sample of formatted time for preview
  const getTimeFormatPreview = (format) => {
    const date = new Date();
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const minutes = date.getMinutes();
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    
    let formattedTime = format;
    
    formattedTime = formattedTime
      .replace('H', hours24.toString().padStart(2, '0'))
      .replace('h', hours12.toString())
      .replace('i', minutes.toString().padStart(2, '0'))
      .replace('A', ampm);
    
    return formattedTime;
  };
  
  return (
    <Box sx={{ py: 4, px: isMobile ? 1 : 3 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your application preferences and company details
        </Typography>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Settings Navigation Cards */}
          <Grid item xs={12} md={12} lg={3}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={4} lg={12}>
                <BentoBox 
                  active={activeSection === 'company'} 
                  onClick={() => handleSectionClick('company')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 1.5 }}>
                      <BusinessIcon />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Company
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Name, location, and fiscal year settings
                  </Typography>
                </BentoBox>
              </Grid>
              
              <Grid item xs={6} sm={4} md={4} lg={12}>
                <BentoBox 
                  active={activeSection === 'financial'} 
                  onClick={() => handleSectionClick('financial')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: 'success.light', mr: 1.5 }}>
                      <AttachMoneyIcon />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Financial
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Currency, tax, and wastage settings
                  </Typography>
                </BentoBox>
              </Grid>
              
              <Grid item xs={6} sm={4} md={4} lg={12}>
                <BentoBox 
                  active={activeSection === 'display'} 
                  onClick={() => handleSectionClick('display')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: 'info.light', mr: 1.5 }}>
                      <VisibilityIcon />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Display
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Date, time, and visual preferences
                  </Typography>
                </BentoBox>
              </Grid>
            </Grid>
          </Grid>
        
          {/* Settings Forms */}
          <Grid item xs={12} md={12} lg={9}>
            <BentoBox>
              {/* Company Information Section */}
              {activeSection === 'company' && (
                <Box>
                  <SectionTitle>
                    <BusinessIcon />
                    <Typography variant="h6">Company Information</Typography>
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="Your Company Name"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Country</InputLabel>
                        <Select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          label="Country"
                        >
                          <MenuItem value="United States">United States</MenuItem>
                          <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                          <MenuItem value="Canada">Canada</MenuItem>
                          <MenuItem value="Australia">Australia</MenuItem>
                          <MenuItem value="France">France</MenuItem>
                          <MenuItem value="Germany">Germany</MenuItem>
                          <MenuItem value="Italy">Italy</MenuItem>
                          <MenuItem value="Spain">Spain</MenuItem>
                          <MenuItem value="Japan">Japan</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
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
                        helperText="When your company's fiscal year begins"
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
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Enable this option if this is a central kitchen facility
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {/* Financial Settings Section */}
              {activeSection === 'financial' && (
                <Box>
                  <SectionTitle>
                    <AttachMoneyIcon />
                    <Typography variant="h6">Financial Settings</Typography>
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Currency Symbol"
                        name="currencySymbol"
                        value={formData.currencySymbol}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="$"
                        InputProps={{
                          startAdornment: <AttachMoneyIcon color="action" sx={{ mr: 1, fontSize: 20 }} />,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Currency Code"
                        name="currencyCode"
                        value={formData.currencyCode}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="USD"
                        InputProps={{
                          startAdornment: <AccountBalanceIcon color="action" sx={{ mr: 1, fontSize: 20 }} />,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Tax/VAT %"
                        name="taxVat"
                        value={formData.taxVat}
                        onChange={handleChange}
                        variant="outlined"
                        type="number"
                        InputProps={{ 
                          inputProps: { min: 0, step: 0.01 },
                          startAdornment: <PercentIcon color="action" sx={{ mr: 1, fontSize: 20 }} />,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Default Wastage %"
                        name="wastage"
                        value={formData.wastage}
                        onChange={handleChange}
                        variant="outlined"
                        type="number"
                        InputProps={{ 
                          inputProps: { min: 0, step: 0.01 },
                          startAdornment: <PercentIcon color="action" sx={{ mr: 1, fontSize: 20 }} />,
                        }}
                        helperText="Default wastage percentage for recipe calculations"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {/* Display Settings Section */}
              {activeSection === 'display' && (
                <Box>
                  <SectionTitle>
                    <VisibilityIcon />
                    <Typography variant="h6">Display Settings</Typography>
                  </SectionTitle>
                  
                  <Grid container spacing={3}>
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
                              {format} ({getDateFormatPreview(format)})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Typography variant="caption" color="text.secondary" mt={1} display="block">
                        Example: {formData.dateFormat ? getDateFormatPreview(formData.dateFormat) : 'Select a format'}
                      </Typography>
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
                              {format} ({getTimeFormatPreview(format)})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Typography variant="caption" color="text.secondary" mt={1} display="block">
                        Example: {formData.timeFormat ? getTimeFormatPreview(formData.timeFormat) : 'Select a format'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    
                    <Grid item xs={12}>
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
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        When enabled, the date will be shown alongside time values
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  Save Settings
                </Button>
              </Box>
            </BentoBox>
          </Grid>
        </Grid>
      </form>
      
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
          Settings updated successfully!
        </Alert>
      </Snackbar>
      
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Settings; 