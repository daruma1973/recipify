import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  Alert,
  AlertTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WarningIcon from '@mui/icons-material/Warning';
import AlertContext from '../../context/alert/alertContext';
import IngredientContext from '../../context/ingredient/ingredientContext';

const ResetProducts = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  
  const navigate = useNavigate();
  const alertContext = useContext(AlertContext);
  const ingredientContext = useContext(IngredientContext);
  
  const { deleteAllIngredients } = ingredientContext;
  
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleDeleteAllProducts = async () => {
    try {
      setIsDeleting(true);
      
      // Call the actual API endpoint to delete all products
      await deleteAllIngredients();
      
      setIsDeleting(false);
      setIsDeleted(true);
      handleCloseDialog();
      alertContext.setAlert('All products have been deleted', 'success');
      
      // Automatically redirect to the new product system after 3 seconds
      setTimeout(() => navigate('/new-product-system'), 3000);
    } catch (error) {
      setIsDeleting(false);
      alertContext.setAlert('Failed to delete products: ' + error.message, 'danger');
      console.error('Error deleting products:', error);
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          mt: 4, 
          borderRadius: 3, 
          backgroundColor: '#FFFFFF' 
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Reset Products
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <WarningIcon sx={{ color: 'warning.main', fontSize: 28, mr: 2 }} />
          <Typography variant="h6" color="warning.main">
            Warning: Destructive Action
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          This tool will permanently delete ALL products from your database. This action cannot be undone.
        </Typography>
        
        <Typography variant="body1" paragraph fontWeight={600}>
          Before proceeding, ensure that:
        </Typography>
        
        <ul>
          <li>
            <Typography variant="body1" paragraph>
              You have a backup of your data if needed
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              All team members are aware of this change
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              You understand that ALL product data will be permanently deleted
            </Typography>
          </li>
        </ul>
        
        {isDeleted ? (
          <Alert severity="success" sx={{ mt: 4 }}>
            <AlertTitle>Success</AlertTitle>
            All products have been deleted. You can now proceed to the new product system.
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/new-product-system')}
              >
                Go to New Product System
              </Button>
            </Box>
          </Alert>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={handleOpenDialog}
              sx={{ 
                borderRadius: 20,
                px: 3,
                py: 1.5
              }}
            >
              Delete All Products
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Permanent Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you absolutely sure you want to delete ALL products? This action CANNOT be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAllProducts} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete Everything"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResetProducts; 