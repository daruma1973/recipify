import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RecipeSourceContext from '../../context/recipeSource/recipeSourceContext';
import AlertContext from '../../context/alert/alertContext';
import RecipeSourceItem from './RecipeSourceItem';
import RecipeSourceForm from './RecipeSourceForm';

const RecipeSourceList = () => {
  const recipeSourceContext = useContext(RecipeSourceContext);
  const alertContext = useContext(AlertContext);

  const {
    recipeSources,
    filtered,
    loading,
    getRecipeSources,
    filterRecipeSources,
    clearFilter
  } = recipeSourceContext;
  const { setAlert } = alertContext;

  const [formOpen, setFormOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getRecipeSources();
    // eslint-disable-next-line
  }, []);

  const handleAddClick = () => {
    setCurrentSource(null);
    setFormOpen(true);
  };

  const handleEditClick = (source) => {
    setCurrentSource(source);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setCurrentSource(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    
    if (value !== '') {
      filterRecipeSources(value);
    } else {
      clearFilter();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const sourcesToDisplay = filtered || recipeSources;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Recipe Sources</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Source
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search sources..."
        value={searchText}
        onChange={handleSearchChange}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        size="small"
      />

      <Paper elevation={2} sx={{ mt: 2 }}>
        {sourcesToDisplay.length > 0 ? (
          <List>
            {sourcesToDisplay.map(source => (
              <RecipeSourceItem
                key={source._id}
                recipeSource={source}
                onEdit={handleEditClick}
              />
            ))}
          </List>
        ) : (
          <Box p={3} textAlign="center">
            <Typography variant="body1" color="textSecondary">
              No recipe sources found. Add your first source to get started!
            </Typography>
          </Box>
        )}
      </Paper>

      <RecipeSourceForm
        open={formOpen}
        handleClose={handleFormClose}
        initialSource={currentSource}
      />
    </Box>
  );
};

export default RecipeSourceList; 