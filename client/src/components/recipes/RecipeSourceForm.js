import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import RecipeSourceContext from '../../context/recipeSource/recipeSourceContext';
import AlertContext from '../../context/alert/alertContext';

const RecipeSourceForm = ({ open, handleClose, initialSource = null }) => {
  const recipeSourceContext = useContext(RecipeSourceContext);
  const alertContext = useContext(AlertContext);

  const { addRecipeSource, updateRecipeSource, clearCurrentRecipeSource } = recipeSourceContext;
  const { setAlert } = alertContext;

  const [recipeSource, setRecipeSource] = useState({
    name: '',
    url: '',
    apiKey: '',
    isActive: true,
    isDefault: false
  });

  const { name, url, apiKey, isActive, isDefault } = recipeSource;

  useEffect(() => {
    if (initialSource !== null) {
      setRecipeSource(initialSource);
    } else {
      setRecipeSource({
        name: '',
        url: '',
        apiKey: '',
        isActive: true,
        isDefault: false
      });
    }
  }, [initialSource]);

  const onChange = e => {
    const { name, value } = e.target;
    setRecipeSource({ ...recipeSource, [name]: value });
  };

  const onSwitchChange = e => {
    const { name, checked } = e.target;
    setRecipeSource({ ...recipeSource, [name]: checked });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (name === '' || url === '') {
      setAlert('Please enter all required fields', 'error');
      return;
    }

    try {
      if (initialSource === null) {
        await addRecipeSource(recipeSource);
        setAlert('Recipe source added', 'success');
      } else {
        await updateRecipeSource(recipeSource);
        setAlert('Recipe source updated', 'success');
      }
      
      handleClose();
      clearForm();
    } catch (err) {
      setAlert(err.response?.data?.msg || 'Error saving recipe source', 'error');
    }
  };

  const clearForm = () => {
    setRecipeSource({
      name: '',
      url: '',
      apiKey: '',
      isActive: true,
      isDefault: false
    });
    clearCurrentRecipeSource();
  };

  const handleCancel = () => {
    clearForm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialSource ? 'Edit Recipe Source' : 'Add Recipe Source'}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                value={name}
                onChange={onChange}
                fullWidth
                required
                margin="normal"
                placeholder="e.g., Allrecipes, Food Network"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="url"
                label="URL"
                value={url}
                onChange={onChange}
                fullWidth
                required
                margin="normal"
                placeholder="e.g., https://api.example.com/recipes"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="apiKey"
                label="API Key (if required)"
                value={apiKey}
                onChange={onChange}
                fullWidth
                margin="normal"
                placeholder="Your API key for this service"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={onSwitchChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDefault}
                    onChange={onSwitchChange}
                    name="isDefault"
                    color="primary"
                  />
                }
                label="Default Source"
              />
              <Typography variant="caption" display="block" color="textSecondary">
                This will be the default source for recipe searches
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {initialSource ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RecipeSourceForm; 