import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import IngredientContext from '../../context/ingredient/ingredientContext';

const IngredientCSVUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [downloading, setDownloading] = useState(false);
  
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const ingredientContext = useContext(IngredientContext);
  
  const { setAlert } = alertContext;
  const { loadUser } = authContext;
  const { getIngredients } = ingredientContext;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log('Selected file:', selectedFile.name);
      console.log('File type:', selectedFile.type);
      
      // Check if file is a CSV by extension or MIME type
      const isCSV = 
        selectedFile.name.toLowerCase().endsWith('.csv') || 
        selectedFile.type === 'text/csv' || 
        selectedFile.type === 'application/csv' ||
        selectedFile.type === 'application/vnd.ms-excel' ||
        selectedFile.type === 'application/octet-stream';
      
      if (!isCSV) {
        console.error('Invalid file type:', selectedFile.type);
        setAlert('Please select a CSV file (.csv extension)', 'error');
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
      console.log('File accepted:', selectedFile.name);
    }
  };

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      console.log('DEVELOPMENT MODE: Attempting to download template with dummy token...');
      
      // DEVELOPMENT MODE: Always use a dummy token
      const token = 'dummy-token-for-development';
      
      // Store the dummy token in localStorage in case it's missing
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', token);
        console.log('DEVELOPMENT MODE: Stored dummy token in localStorage');
      }
      
      try {
        console.log('Trying authenticated endpoint with dummy token...');
        
        const res = await axios.get('/api/inventory/template', {
          responseType: 'blob',
          headers: {
            'x-auth-token': token
          }
        });
        
        console.log('Response received:', res.status);
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ingredient_template.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        setAlert('Template downloaded successfully', 'success');
      } catch (authErr) {
        console.error('Error with authenticated endpoint:', authErr);
        
        // Fall back to the public test endpoint
        console.log('Falling back to public test endpoint...');
        const publicRes = await axios.get('/api/inventory/test-template', {
          responseType: 'blob'
        });
        
        console.log('Public endpoint response:', publicRes.status);
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([publicRes.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ingredient_template.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        setAlert('Template downloaded successfully (using public endpoint)', 'success');
      }
    } catch (err) {
      console.error('Error downloading template:', err);
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      
      setAlert('Error downloading template. Check console for details.', 'error');
      
      // Direct download fallback
      try {
        console.log('Attempting direct download fallback...');
        window.open('http://localhost:5000/api/inventory/test-template', '_blank');
        setAlert('Attempted direct download. Check your downloads folder.', 'info');
      } catch (fallbackErr) {
        console.error('Fallback download failed:', fallbackErr);
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleUpload = async e => {
    e.preventDefault();
    
    if (!file) {
      setAlert('Please select a CSV file', 'error');
      return;
    }
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // DEVELOPMENT MODE: Always use a dummy token
    console.log('DEVELOPMENT MODE: Using dummy token for upload');
    const token = 'dummy-token-for-development';
    
    // Store the dummy token in localStorage in case it's missing
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', token);
      console.log('DEVELOPMENT MODE: Stored dummy token in localStorage');
    }
    
    console.log('Uploading file:', file.name);

    try {
      console.log('Sending upload request...');
      const res = await axios.post('/api/inventory/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });

      console.log('Upload response:', res.status, res.data);
      setUploadResults(res.data);
      setAlert(res.data.message, 'success');
      
      // Refresh ingredients list
      getIngredients();
      
      // Reset file input
      setFile(null);
      setFileName('');
    } catch (err) {
      console.error('Error uploading file:', err);
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        
        if (err.response.status === 401) {
          // DEVELOPMENT MODE: Authentication errors shouldn't happen
          console.error('DEVELOPMENT MODE: Authentication error occurred despite bypass');
          setAlert('Server error during upload. Please check the server logs.', 'error');
        } else {
          setAlert(
            err.response?.data?.message || err.response?.data?.msg || 'Error uploading file. Check console for details.',
            'error'
          );
        }
      } else {
        setAlert('Error uploading file. Check console for details.', 'error');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Batch Upload Ingredients
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Development Mode</AlertTitle>
        Authentication is bypassed. All features should work without requiring login.
        If you encounter any issues, check the browser console for details.
      </Alert>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" paragraph>
          Upload multiple ingredients at once using a CSV file. 
          Download the template below to ensure your data is formatted correctly.
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadTemplate}
          disabled={downloading}
          sx={{ mr: 2 }}
        >
          {downloading ? 'Downloading...' : 'Download Template'}
          {downloading && <CircularProgress size={24} sx={{ ml: 1 }} />}
        </Button>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <input
          accept=".csv"
          style={{ display: 'none' }}
          id="csv-file-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="csv-file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Select CSV File
          </Button>
        </label>
        
        {fileName && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected file: {fileName}
          </Typography>
        )}
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || uploading}
          sx={{ minWidth: 150 }}
        >
          {uploading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </Box>
      
      {uploadResults && (
        <Box sx={{ mt: 3 }}>
          <Alert severity={uploadResults.success ? 'success' : 'error'}>
            <AlertTitle>{uploadResults.success ? 'Upload Successful' : 'Upload Failed'}</AlertTitle>
            {uploadResults.message}
          </Alert>
          
          {uploadResults.errors && uploadResults.errors.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Errors:
              </Typography>
              <List dense>
                {uploadResults.errors.map((error, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Row ${error.row}: ${error.name || 'Unknown ingredient'}`}
                      secondary={error.error}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {uploadResults.results && uploadResults.results.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Successfully imported:
              </Typography>
              <List dense>
                {uploadResults.results.map((result, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={result.name}
                      secondary={`Row ${result.row}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default IngredientCSVUpload; 