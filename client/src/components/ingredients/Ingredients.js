import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Checkbox,
  Tabs,
  Tab,
  useTheme,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Context
import AuthContext from '../../context/auth/authContext';
import IngredientContext from '../../context/ingredient/ingredientContext';
import AlertContext from '../../context/alert/alertContext';

// Components
import IngredientCSVUpload from './IngredientCSVUpload';
import Container from '../layout/Container';

// Simple inline edit field component
const InlineEditField = ({ value, onSave, type = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setEditValue(value);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(editValue);
  };

  return (
    <div onClick={handleStartEdit} style={{ cursor: 'pointer', minHeight: '24px' }}>
      {isEditing ? (
        <TextField
          inputRef={inputRef}
          value={editValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          variant="standard"
          type={type}
          size="small"
          fullWidth
          autoFocus
        />
      ) : (
        <span>{value || '-'}</span>
      )}
    </div>
  );
};

// PackagingTypeInfoDialog component for displaying packaging type information
const PackagingTypeInfoDialog = ({ open, onClose }) => {
  // Base64 encoded image of packaging type information
  const packagingTypeImage = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIEJhY2tncm91bmQgLS0+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmZmZmZmYiLz4KCiAgPCEtLSBCb3R0bGUgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwLCAxMDApIj4KICAgIDxwYXRoIGQ9Ik03MCwxMDAgQzcwLDgwIDEwMCw4MCAxMDAsNjAgTDEwMCwyMCBDMTAwLDEwIDkwLDAgODAsMCBMNDAsMCBDMzAsMCAyMCwxMCAyMCwyMCBMMjAsNjAgQzIwLDgwIDUwLDgwIDUwLDEwMCBMNTAsMzAwIEw3MCwzMDAgTDcwLDEwMCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiNDMjVFMzAiIHN0cm9rZS13aWR0aD0iMyIvPgogICAgPHRleHQgeD0iNjAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjQzI1RTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj43MGNsPC90ZXh0PgogICAgPHRleHQgeD0iMTUwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjQzI1RTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QYWNrYWdpbmcgVHlwZTwvdGV4dD4KICAgIDxwYXRoIGQ9Ik0xMjAsODAgQzE1MCw4MCAxODAsNjAgMjIwLDgwIiBmaWxsPSJub25lIiBzdHJva2U9IiNDMjVFMzAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNSw1Ii8+CiAgICA8dGV4dCB4PSIxNTAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjQzI1RTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Vbml0IFNpemU8L3RleHQ+CiAgICA8cGF0aCBkPSJNMTIwLDE1MCBDMTUwLDE1MCAxNTAsMTgwIDEyMCwxODAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MyNUUzMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KICA8L2c+CgogIDwhLS0gQ2FzZSAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MDAsIDIwMCkiPgogICAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MyNUUzMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgICA8dGV4dCB4PSIxMDAiIHk9IjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiNDMjVFMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhc2U8L3RleHQ+CiAgICA8dGV4dCB4PSIxMDAiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjQzI1RTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj54NjwvdGV4dD4KICAgIDx0ZXh0IHg9IjEwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNDMjVFMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlVuaXQgQW1vdW50PC90ZXh0PgogICAgPHBhdGggZD0iTTEwMCwxNTAgQzEwMCwxNjAgMTAwLDE3MCAxMDAsMTgwIiBmaWxsPSJub25lIiBzdHJva2U9IiNDMjVFMzAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNSw1Ii8+CiAgICA8dGV4dCB4PSIyNTAiIHk9IjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNDMjVFMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlB1cmNoYXNlIFVuaXQgTmFtZTwvdGV4dD4KICAgIDxwYXRoIGQ9Ik0yMDAsMTAwIEMyMjAsMTAwIDI0MCwxMDAgMjYwLDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzI1RTMwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUsNSIvPgogIDwvZz4KCiAgPCEtLSBCb3R0bGVzIGluIENhc2UgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDIwLCAxNTApIj4KICAgIDxwYXRoIGQ9Ik0xMCw1MCBDMTAsNDAgMjAsNDAgMjAsMzAgTDIwLDEwIEMyMCw1IDE1LDAgMTAsMCBMNSwwIEMwLDAgLTUsNSAtNSwxMCBMLTUsMzAgQy01LDQwIDUsNDAgNSw1MCBMNSw4MCBMMTAsODAgTDEwLDUwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MyNUUzMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPC9nPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1MCwgMTUwKSI+CiAgICA8cGF0aCBkPSJNMTAsNTAgQzEwLDQwIDIwLDQwIDIwLDMwIEwyMCwxMCBDMjAsNSAxNSwwIDEwLDAgTDUsMCBDMCwwIC01LDUgLTUsMTAgTC01LDMwIEMtNSw0MCA1LDQwIDUsNTAgTDUsODAgTDEwLDgwIEwxMCw1MCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiNDMjVFMzAiIHN0cm9rZS13aWR0aD0iMiIvPgogIDwvZz4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0ODAsIDE1MCkiPgogICAgPHBhdGggZD0iTTEwLDUwIEMxMCw0MCAyMCw0MCAyMCwzMCBMMjAsMTAgQzIwLDUgMTUsMCAxMCwwIEw1LDAgQzAsMCAtNSw1IC01LDEwIEwtNSwzMCBDLTUsNDAgNSw0MCA1LDUwIEw1LDgwIEwxMCw4MCBMMTAsNTAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzI1RTMwIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8L2c+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTEwLCAxNTApIj4KICAgIDxwYXRoIGQ9Ik0xMCw1MCBDMTAsNDAgMjAsNDAgMjAsMzAgTDIwLDEwIEMyMCw1IDE1LDAgMTAsMCBMNSwwIEMwLDAgLTUsNSAtNSwxMCBMLTUsMzAgQy01LDQwIDUsNDAgNSw1MCBMNSw4MCBMMTAsODAgTDEwLDUwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MyNUUzMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPC9nPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU0MCwgMTUwKSI+CiAgICA8cGF0aCBkPSJNMTAsNTAgQzEwLDQwIDIwLDQwIDIwLDMwIEwyMCwxMCBDMjAsNSAxNSwwIDEwLDAgTDUsMCBDMCwwIC01LDUgLTUsMTAgTC01LDMwIEMtNSw0MCA1LDQwIDUsNTAgTDUsODAgTDEwLDgwIEwxMCw1MCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiNDMjVFMzAiIHN0cm9rZS13aWR0aD0iMiIvPgogIDwvZz4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NzAsIDE1MCkiPgogICAgPHBhdGggZD0iTTEwLDUwIEMxMCw0MCAyMCw0MCAyMCwzMCBMMjAsMTAgQzIwLDUgMTUsMCAxMCwwIEw1LDAgQzAsMCAtNSw1IC01LDEwIEwtNSwzMCBDLTUsNDAgNSw0MCA1LDUwIEw1LDgwIEwxMCw4MCBMMTAsNTAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzI1RTMwIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8L2c+Cjwvc3ZnPg==`;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Product Setup</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ maxWidth: '100%', width: 500, mb: 3 }}>
            <img 
              src={packagingTypeImage} 
              alt="Packaging Type Information" 
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            If there is anything you are still unsure of, please visit our
            glossary or feel free to reach out and ask us any
            questions you may have.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="primary"
              sx={{ borderColor: '#C25E30', color: '#C25E30' }}
            >
              CONTACT US
            </Button>
            <Button 
              variant="contained" 
              sx={{ backgroundColor: '#C25E30', color: 'white' }}
            >
              GO TO GLOSSARY
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// UnitSizeInfoDialog component for displaying unit size information
const UnitSizeInfoDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Unit Size</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 1 }}>
          <Typography variant="body1" paragraph>
            The quantifiable amount of product or good that is packaged. "750 mL" is a common unit
            size for spirits. You have the option to provide conversions between unit of measurement
            types (volumetric, mass, or count) so that a Product Format can be portioned out in a
            recipe or menu using either its volume or weight. This is common for products like sugar
            where different recipes will call for either a volume measurement or mass measurement.
          </Typography>
          <Typography variant="body1" paragraph>
            Keep in mind that a 750 mL bottle vodka should be an entirely separate Product Format
            from a 1 L bottle of that same vodka.
          </Typography>
          <Typography variant="body1" paragraph>
            This information is sent to your rep when ordering to ensure you get sent the exact
            amount of product you were needing.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={onClose}
              sx={{ 
                borderColor: '#C25E30', 
                color: '#C25E30',
                borderRadius: '4px',
                padding: '10px 30px'
              }}
            >
              SHOW ILLUSTRATION
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// UPCInfoDialog component for displaying UPC information
const UPCInfoDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">UPC</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 1 }}>
          <Typography variant="body1" paragraph>
            The universal product code, or barcode, found on the label of the product.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// UnitSizeDialog component for selecting unit size options
const UnitSizeDialog = ({ open, onClose, onSave, currentValue }) => {
  const [selectedOption, setSelectedOption] = useState('volume');
  const [volumeQuantity, setVolumeQuantity] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('liter');
  const [massQuantity, setMassQuantity] = useState('');
  const [massUnit, setMassUnit] = useState('');
  const [countQuantity, setCountQuantity] = useState('');
  
  useEffect(() => {
    // Reset form when dialog opens
    if (open) {
      // Parse current value if it exists
      if (currentValue) {
        const parts = currentValue.split(' ');
        if (parts.length >= 2) {
          const quantity = parts[0];
          const unit = parts[1].toLowerCase();
          
          if (['ml', 'l', 'liter'].includes(unit)) {
            setSelectedOption('volume');
            setVolumeQuantity(quantity);
            setVolumeUnit(unit === 'ml' ? 'milliliter' : 'liter');
          } else if (['g', 'kg'].includes(unit)) {
            setSelectedOption('mass');
            setMassQuantity(quantity);
            setMassUnit(unit === 'g' ? 'gram' : 'kilogram');
          } else {
            setSelectedOption('count');
            setCountQuantity(quantity);
          }
        }
      }
    }
  }, [open, currentValue]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSave = () => {
    let finalValue = '';
    
    if (selectedOption === 'volume' && volumeQuantity) {
      finalValue = `${volumeQuantity} ${volumeUnit === 'liter' ? 'L' : 'mL'}`;
    } else if (selectedOption === 'mass' && massQuantity) {
      finalValue = `${massQuantity} ${massUnit === 'kilogram' ? 'kg' : 'g'}`;
    } else if (selectedOption === 'count' && countQuantity) {
      finalValue = `${countQuantity} units`;
    }
    
    if (finalValue) {
      onSave(finalValue);
    }
    onClose();
  };

  const isFormValid = () => {
    if (selectedOption === 'volume') return !!volumeQuantity && !!volumeUnit;
    if (selectedOption === 'mass') return !!massQuantity && !!massUnit;
    if (selectedOption === 'count') return !!countQuantity;
    return false;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Add Unit Size</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="body1" color="textSecondary">
            Add different unit sizes depending on how your products are stored. Note that only different
            measurements of the same size should be stored in this location, multiple product sizes can
            be added seperately.
          </Typography>
        </Box>
        
        <Typography variant="h6" gutterBottom>Size Variations</Typography>
        
        <Box mb={3} p={2} border={1} borderColor="divider" borderRadius={1}>
          <Box display="flex" alignItems="center" mb={2}>
            <Radio
              checked={selectedOption === 'volume'}
              onChange={handleOptionChange}
              value="volume"
              name="size-option"
              color="primary"
            />
            <Typography variant="h6">Volume</Typography>
          </Box>
          
          {selectedOption === 'volume' && (
            <Box display="flex" alignItems="center" ml={4}>
              <Box mr={2} width="50%">
                <Typography variant="caption" color="textSecondary">
                  Quantity *
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={volumeQuantity}
                  onChange={(e) => setVolumeQuantity(e.target.value)}
                  placeholder="12"
                  size="small"
                  type="number"
                />
              </Box>
              <Box width="50%">
                <Typography variant="caption" color="textSecondary">
                  Unit of Measurement
                </Typography>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  value={volumeUnit}
                  onChange={(e) => setVolumeUnit(e.target.value)}
                  size="small"
                >
                  <MenuItem value="liter">liter</MenuItem>
                  <MenuItem value="milliliter">milliliter</MenuItem>
                </TextField>
              </Box>
            </Box>
          )}
        </Box>
        
        <Box mb={3} p={2} border={1} borderColor="divider" borderRadius={1}>
          <Box display="flex" alignItems="center" mb={2}>
            <Radio
              checked={selectedOption === 'mass'}
              onChange={handleOptionChange}
              value="mass"
              name="size-option"
              color="primary"
            />
            <Typography variant="h6">Mass</Typography>
          </Box>
          
          {selectedOption === 'mass' && (
            <Box display="flex" alignItems="center" ml={4}>
              <Box mr={2} width="50%">
                <Typography variant="caption" color="textSecondary">
                  Quantity *
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={massQuantity}
                  onChange={(e) => setMassQuantity(e.target.value)}
                  placeholder="Quantity"
                  size="small"
                  type="number"
                />
              </Box>
              <Box width="50%">
                <Typography variant="caption" color="textSecondary">
                  Unit of Measurement
                </Typography>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  value={massUnit}
                  onChange={(e) => setMassUnit(e.target.value)}
                  size="small"
                >
                  <MenuItem value="gram">gram</MenuItem>
                  <MenuItem value="kilogram">kilogram</MenuItem>
                </TextField>
              </Box>
            </Box>
          )}
        </Box>
        
        <Box mb={3} p={2} border={1} borderColor="divider" borderRadius={1}>
          <Box display="flex" alignItems="center" mb={2}>
            <Radio
              checked={selectedOption === 'count'}
              onChange={handleOptionChange}
              value="count"
              name="size-option"
              color="primary"
            />
            <Typography variant="h6">Count</Typography>
          </Box>
          
          {selectedOption === 'count' && (
            <Box display="flex" alignItems="center" ml={4}>
              <Box width="50%">
                <Typography variant="caption" color="textSecondary">
                  Quantity *
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={countQuantity}
                  onChange={(e) => setCountQuantity(e.target.value)}
                  placeholder="Quantity"
                  size="small"
                  type="number"
                />
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Box width="100%" display="flex" justifyContent="center" p={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!isFormValid()}
            style={{ 
              backgroundColor: '#C25E30', 
              color: 'white',
              borderRadius: '4px',
              padding: '10px 30px'
            }}
          >
            Submit
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

const Ingredients = () => {
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  const ingredientContext = useContext(IngredientContext);
  const alertContext = useContext(AlertContext);

  const { setAlert } = alertContext;
  const { 
    ingredients, 
    loading, 
    getIngredients, 
    deleteIngredient,
    updateIngredient,
    error,
    clearErrors
  } = ingredientContext;

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedProductFamily, setEditedProductFamily] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedSubcategory, setEditedSubcategory] = useState('');
  const [unitSizeDialogOpen, setUnitSizeDialogOpen] = useState(false);
  const [currentUnitSizeIngredient, setCurrentUnitSizeIngredient] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImageIngredient, setCurrentImageIngredient] = useState(null);
  const [packagingTypeInfoOpen, setPackagingTypeInfoOpen] = useState(false);
  const [unitSizeInfoOpen, setUnitSizeInfoOpen] = useState(false);
  const [upcInfoOpen, setUpcInfoOpen] = useState(false);

  // Load ingredients on component mount
  useEffect(() => {
    getIngredients();
    // eslint-disable-next-line
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(0);
  };

  // Handle supplier filter change
  const handleSupplierChange = (e) => {
    setSupplierFilter(e.target.value);
    setPage(0);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle delete confirmation dialog
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteIngredient(deleteId);
    setDeleteConfirmOpen(false);
    setDeleteId(null);
    setAlert('Ingredient deleted', 'success');
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDeleteId(null);
  };

  // Handle import dialog
  const handleImportOpen = () => {
    setImportOpen(true);
  };

  const handleImportClose = () => {
    setImportOpen(false);
    getIngredients();
  };

  // Handle export
  const handleExport = () => {
    // Export functionality would go here
    setAlert('Export feature coming soon', 'info');
  };

  // Handle selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredIngredients.map(i => i._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Handle bulk delete
  const handleConfirmBulkDelete = () => {
    selected.forEach(id => {
      deleteIngredient(id);
    });
    setBulkDeleteConfirmOpen(false);
    setSelected([]);
    setAlert(`${selected.length} ingredients deleted`, 'success');
  };

  const handleCancelBulkDelete = () => {
    setBulkDeleteConfirmOpen(false);
  };

  // Handle opening the edit product dialog
  const handleEditDialogOpen = (ingredient) => {
    setCurrentIngredient(ingredient);
    setEditedName(ingredient.name || '');
    setEditedProductFamily(ingredient.productFamily || '');
    setEditedCategory(ingredient.category || '');
    setEditedSubcategory(ingredient.subCategory || '');
    setEditDialogOpen(true);
  };

  // Handle closing the edit product dialog
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentIngredient(null);
  };

  // Handle saving the edited product
  const handleSaveProduct = () => {
    if (currentIngredient && editedName.trim()) {
      const updatedIngredient = {
        ...currentIngredient,
        name: editedName.trim(),
        productFamily: editedProductFamily.trim() || '',
        category: editedCategory.trim() || '',
        subCategory: editedSubcategory.trim() || ''
      };
      
      updateIngredient(updatedIngredient);
      setAlert('Product updated successfully', 'success');
      handleEditDialogClose();
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle field update
  const handleFieldUpdate = (ingredient, field, value) => {
    const updatedIngredient = {
      ...ingredient,
      [field]: value
    };
    
    updateIngredient(updatedIngredient);
    setAlert(`Updated ${field}`, 'success');
  };

  // Handle image file upload
  const handleImageUpload = (e, ingredient) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setCurrentImageIngredient(ingredient);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setImagePreview(imageData);
        
        // Update the ingredient with the new image
        handleFieldUpdate(ingredient, 'image', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle opening the packaging type info dialog
  const handlePackagingTypeInfoOpen = () => {
    setPackagingTypeInfoOpen(true);
  };
  
  // Handle closing the packaging type info dialog
  const handlePackagingTypeInfoClose = () => {
    setPackagingTypeInfoOpen(false);
  };

  // Handle opening the unit size info dialog
  const handleUnitSizeInfoOpen = () => {
    setUnitSizeInfoOpen(true);
  };
  
  // Handle closing the unit size info dialog
  const handleUnitSizeInfoClose = () => {
    setUnitSizeInfoOpen(false);
  };

  // Handle opening the UPC info dialog
  const handleUpcInfoOpen = () => {
    setUpcInfoOpen(true);
  };
  
  // Handle closing the UPC info dialog
  const handleUpcInfoClose = () => {
    setUpcInfoOpen(false);
  };

  // Filter ingredients based on search term and filters
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = searchTerm === '' || 
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || 
      ingredient.category === categoryFilter;
    
    const matchesSupplier = supplierFilter === '' || 
      (ingredient.supplier && ingredient.supplier.name === supplierFilter);
    
    return matchesSearch && matchesCategory && matchesSupplier;
  });

  // Get current ingredients for pagination
  const currentIngredients = filteredIngredients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Check if all items on the current page are selected
  const isAllSelected = 
    currentIngredients.length > 0 && 
    currentIngredients.every(i => selected.includes(i._id));

  // Define columns for each tab
  // Rearranged tab order to put Product Format next to All Products
  const tabColumns = {
    0: [ // All Products tab
      { id: 'product', label: 'Product Name', align: 'left' },
      { id: 'abvPercent', label: 'ABV', align: 'center' },
      { id: 'region', label: 'Region', align: 'center' },
      { id: 'producer', label: 'Producer', align: 'center' },
      { id: 'rawMaterial', label: 'Raw Material', align: 'center' },
      { id: 'vintage', label: 'Vintage', align: 'center' },
      { id: 'appellation', label: 'Appellation', align: 'center' },
      { id: 'status', label: 'Status', align: 'center' },
      { id: 'actions', label: 'Actions', align: 'center' },
    ],
    1: [ // Product Format tab
      { id: 'product', label: 'Product Name', align: 'left' },
      { id: 'unitSize', label: 'Unit Size', align: 'center' },
      { id: 'packagingType', label: 'Packaging Type', align: 'center' },
      { id: 'upc', label: 'UPC', align: 'center' },
      { id: 'image', label: 'Image', align: 'center' },
      { id: 'lowPar', label: 'Low Par', align: 'center' },
      { id: 'highPar', label: 'High Par', align: 'center' },
      { id: 'status', label: 'Status', align: 'center' },
      { id: 'actions', label: 'Actions', align: 'center' },
    ],
    2: [ // Wine Details tab
      { id: 'product', label: 'Product Name', align: 'left' },
      { id: 'wineStyle', label: 'Wine Style', align: 'center' },
      { id: 'grapeVariety', label: 'Grape Variety', align: 'center' },
      { id: 'color', label: 'Color', align: 'center' },
      { id: 'sweetness', label: 'Sweetness', align: 'center' },
      { id: 'body', label: 'Body', align: 'center' },
      { id: 'status', label: 'Status', align: 'center' },
      { id: 'actions', label: 'Actions', align: 'center' },
    ],
    3: [ // Additional Info tab
      { id: 'product', label: 'Product Name', align: 'left' },
      { id: 'supplier', label: 'Supplier', align: 'center' },
      { id: 'price', label: 'Price', align: 'center' },
      { id: 'stock', label: 'Stock', align: 'center' },
      { id: 'location', label: 'Location', align: 'center' },
      { id: 'status', label: 'Status', align: 'center' },
      { id: 'actions', label: 'Actions', align: 'center' },
    ],
  };

  // Render cell content based on column type
  const renderCell = (ingredient, column) => {
    const { id } = column;
    
    switch (id) {
      case 'product':
        return (
          <div>
            <Typography 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.main'
                }
              }}
              onClick={() => handleEditDialogOpen(ingredient)}
            >
              {ingredient.name}
            </Typography>
            <div>
              {ingredient.productFamily && (
                <Chip 
                  label={ingredient.productFamily}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {ingredient.category && (
                <Chip 
                  label={ingredient.category}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
              {ingredient.subCategory && (
                <Chip 
                  label={ingredient.subCategory}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}
              {!ingredient.productFamily && !ingredient.category && !ingredient.subCategory && (
                <Typography variant="caption" color="text.secondary">
                  No classification
                </Typography>
              )}
            </div>
          </div>
        );
        
      case 'abvPercent':
        return (
          <InlineEditField 
            value={ingredient.abvPercent ? `${ingredient.abvPercent}%` : '-'} 
            onSave={(value) => {
              // Remove % if present and convert to number
              const cleanValue = value.replace('%', '');
              const numericValue = cleanValue === '-' ? '' : parseFloat(cleanValue);
              handleFieldUpdate(ingredient, 'abvPercent', numericValue);
            }}
            type="text"
          />
        );
        
      case 'region':
        return (
          <InlineEditField 
            value={ingredient.region || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'region', value)}
          />
        );
        
      case 'producer':
        return (
          <InlineEditField 
            value={ingredient.producer || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'producer', value)}
          />
        );
        
      case 'rawMaterial':
        return (
          <InlineEditField 
            value={ingredient.rawMaterial || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'rawMaterial', value)}
          />
        );
        
      case 'vintage':
        return (
          <InlineEditField 
            value={ingredient.vintage || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'vintage', value)}
            type="number"
          />
        );
        
      case 'appellation':
        return (
          <InlineEditField 
            value={ingredient.appellation || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'appellation', value)}
          />
        );
        
      case 'wineStyle':
        return (
          <InlineEditField 
            value={ingredient.wineStyle || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'wineStyle', value)}
          />
        );
        
      case 'grapeVariety':
        return (
          <InlineEditField 
            value={ingredient.grapeVariety || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'grapeVariety', value)}
          />
        );
        
      case 'color':
        return (
          <InlineEditField 
            value={ingredient.color || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'color', value)}
          />
        );
        
      case 'sweetness':
        return (
          <InlineEditField 
            value={ingredient.sweetness || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'sweetness', value)}
          />
        );
        
      case 'body':
        return (
          <InlineEditField 
            value={ingredient.body || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'body', value)}
          />
        );
        
      case 'supplier':
        return ingredient.supplier ? ingredient.supplier.name : '-';
        
      case 'price':
        return (
          <InlineEditField 
            value={ingredient.price ? `$${ingredient.price.toFixed(2)}` : '-'} 
            onSave={(value) => {
              // Remove $ if present
              const cleanValue = value.replace('$', '');
              handleFieldUpdate(ingredient, 'price', cleanValue);
            }}
            type="number"
          />
        );
        
      case 'stock':
        return (
          <InlineEditField 
            value={ingredient.stock !== undefined ? ingredient.stock : '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'stock', value)}
            type="number"
          />
        );
        
      case 'location':
        return (
          <InlineEditField 
            value={ingredient.location || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'location', value)}
          />
        );
        
      case 'unitSize':
        return (
          <Box 
            sx={{ 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': { 
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
            onClick={() => {
              setCurrentUnitSizeIngredient(ingredient);
              setUnitSizeDialogOpen(true);
            }}
          >
            {ingredient.unitSize || '-'}
          </Box>
        );
        
      case 'packagingType':
        return (
          <InlineEditField 
            value={ingredient.packagingType || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'packagingType', value)}
          />
        );
        
      case 'upc':
        return (
          <InlineEditField 
            value={ingredient.upc || '-'} 
            onSave={(value) => handleFieldUpdate(ingredient, 'upc', value)}
          />
        );
        
      case 'image':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            {ingredient.image ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={ingredient.image} 
                  alt={ingredient.name} 
                  style={{ width: 50, height: 50, objectFit: 'contain' }} 
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No image
              </Typography>
            )}
            
            <Button
              variant="outlined"
              component="label"
              size="small"
              startIcon={<FileUploadIcon />}
              sx={{ 
                fontSize: '0.7rem', 
                py: 0.5, 
                px: 1,
                minWidth: 'auto'
              }}
            >
              Upload
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageUpload(e, ingredient)}
              />
            </Button>
          </Box>
        );
        
      case 'lowPar':
        return (
          <InlineEditField 
            value={ingredient.lowPar || '-'} 
            onSave={(value) => {
              const numericValue = value === '-' ? '' : parseFloat(value);
              handleFieldUpdate(ingredient, 'lowPar', numericValue);
            }}
            type="number"
          />
        );
        
      case 'highPar':
        return (
          <InlineEditField 
            value={ingredient.highPar || '-'} 
            onSave={(value) => {
              const numericValue = value === '-' ? '' : parseFloat(value);
              handleFieldUpdate(ingredient, 'highPar', numericValue);
            }}
            type="number"
          />
        );
        
      case 'status':
        return (
          <Box sx={{ position: 'relative' }}>
            <Select
              value={ingredient.isActive === false ? 'Inactive' : 'Active'}
              onChange={(e) => handleFieldUpdate(ingredient, 'isActive', e.target.value === 'Active')}
              size="small"
              sx={{
                minWidth: 100,
                '& .MuiSelect-select': {
                  padding: '4px 8px',
                  borderRadius: 1,
                  backgroundColor: ingredient.isActive === false ? '#ffebee' : '#e8f5e9',
                  color: ingredient.isActive === false ? '#d32f2f' : '#2e7d32',
                }
              }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </Box>
        );
        
      case 'actions':
        return (
          <div>
            <IconButton 
              component={Link} 
              to={`/inventory/${ingredient._id}`}
              size="small"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton 
              component={Link} 
              to={`/inventory/${ingredient._id}`}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              onClick={() => handleDeleteClick(ingredient._id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Container disablePaper>
      <Typography variant="h4">Inventory Management</Typography>
      <Typography variant="body1">
        Manage your inventory, track stock levels, and update product information
      </Typography>

      <div style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon />
          }}
          style={{ minWidth: '250px' }}
        />

        <FormControl style={{ minWidth: '150px' }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            <MenuItem value="">All Categories</MenuItem>
            {/* Add category options here */}
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: '150px' }}>
          <InputLabel>Supplier</InputLabel>
          <Select
            value={supplierFilter}
            onChange={handleSupplierChange}
          >
            <MenuItem value="">All Suppliers</MenuItem>
            {/* Add supplier options here */}
          </Select>
        </FormControl>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleImportOpen}
            startIcon={<FileUploadIcon />}
          >
            Import
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleExport}
            startIcon={<FileDownloadIcon />}
          >
            Export
          </Button>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/inventory/add"
            startIcon={<AddIcon />}
          >
            Add Product
          </Button>
        </div>
      </div>

      <Tabs value={tabValue} onChange={handleTabChange} style={{ marginBottom: '20px' }}>
        <Tab label="All Products" />
        <Tab label="Product Format" />
        <Tab label="Wine Details" />
        <Tab label="Additional Info" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  inputProps={{ 'aria-label': 'select all ingredients' }}
                />
              </TableCell>
              {tabColumns[tabValue].map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.id === 'abvPercent' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {column.label}
                      <Tooltip 
                        title={
                          <Typography variant="body2">
                            <strong>ABV</strong><br />
                            Stands for "alcohol by volume." If the product is non-alcoholic, enter 0. Remember that the ABV can be calculated by dividing the proof by 2.
                          </Typography>
                        }
                      >
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : column.id === 'region' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {column.label}
                      <Tooltip 
                        title={
                          <Typography variant="body2">
                            <strong>Region</strong><br />
                            The country that the product is produced in.
                          </Typography>
                        }
                      >
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : column.id === 'producer' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {column.label}
                      <Tooltip 
                        title={
                          <Typography variant="body2">
                            <strong>Producer</strong><br />
                            The official name of the producer.
                          </Typography>
                        }
                      >
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : column.id === 'rawMaterial' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {column.label}
                      <Tooltip 
                        title={
                          <Typography variant="body2">
                            <strong>Raw Material</strong><br />
                            The primary ingredient used to produce the product (e.g., grapes for wine).
                          </Typography>
                        }
                      >
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : column.id === 'vintage' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {column.label}
                      <Tooltip 
                        title={
                          <Typography variant="body2">
                            <strong>Vintage</strong><br />
                            The vintage date of the product. If the product has none, enter "NV."
                          </Typography>
                        }
                      >
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : column.id === 'appellation' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {column.label}
                      <Tooltip 
                        title={
                          <Typography variant="body2">
                            <strong>Appellation</strong><br />
                            The legally defined and protected geographical indication used to identify where the grapes for a wine were grown.
                          </Typography>
                        }
                      >
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : column.id === 'unitSize' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {column.label}
                      <Tooltip 
                        title={
                          <Typography variant="body2">
                            <strong>Unit Size</strong><br />
                            The quantifiable amount of product that is packaged (e.g., 750 mL, 1 L).
                            <Box sx={{ mt: 1, textAlign: 'center' }}>
                              <Link 
                                component="button"
                                variant="body2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnitSizeInfoOpen();
                                }}
                                sx={{ color: 'primary.main', textDecoration: 'underline' }}
                              >
                                View more information
                              </Link>
                            </Box>
                          </Typography>
                        }
                      >
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : column.id === 'upc' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {column.label}
                      <Tooltip 
                        title={
                          <Typography variant="body2">
                            <strong>UPC</strong><br />
                            The universal product code, or barcode, found on the label of the product.
                          </Typography>
                        }
                      >
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : column.id === 'packagingType' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {column.label}
                      <Tooltip 
                        title={
                          <Typography variant="body2">
                            <strong>Packaging Type</strong><br />
                            The type of container or packaging used for the product (e.g., bottle, can, box, etc.).
                            <Box sx={{ mt: 1, textAlign: 'center' }}>
                              <Link 
                                component="button"
                                variant="body2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePackagingTypeInfoOpen();
                                }}
                                sx={{ color: 'primary.main', textDecoration: 'underline' }}
                              >
                                View illustration
                              </Link>
                            </Box>
                          </Typography>
                        }
                      >
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : column.id === 'product' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {column.label}
                      <Tooltip 
                        title={
                          <Box sx={{ maxWidth: 350 }}>
                            <Typography variant="body2" color="primary" fontWeight="bold" gutterBottom>
                              Product Name
                            </Typography>
                            <Typography variant="body2" paragraph>
                              Product Name is the official and commonly used name of a product.
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                              Best practices:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                              <Box component="li" sx={{ mb: 1 }}>
                                <Typography variant="body2">
                                  Names should be specific: "Absolut Vodka" and "Absolut Citron" are distinct and have separate uses, so they should be divided into separate products with unique names.
                                </Typography>
                              </Box>
                              <Box component="li" sx={{ mb: 1 }}>
                                <Typography variant="body2">
                                  Names can contain the name of the producer, if that is how the product is colloquially referred to. "Makers Mark Bourbon" contains the name of the Producer, whereas "Elijah Craig Small Batch Bourbon" does not include the name of the producer, "Heaven Hill".
                                </Typography>
                              </Box>
                              <Box component="li" sx={{ mb: 1 }}>
                                <Typography variant="body2">
                                  Names should be free of reference to size, like "750 mL", as this is defined at the Product Format level. Names should also be free of reference to packaging type, like "bottle", as this is defined at the Product Format level.
                                </Typography>
                              </Box>
                              <Box component="li">
                                <Typography variant="body2">
                                  If the product is a wine, include the vintage.
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        }
                        placement="right-start"
                        arrow
                        sx={{ maxWidth: 500 }}
                      >
                        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentIngredients.map((ingredient) => {
              const isItemSelected = isSelected(ingredient._id);
              
              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={ingredient._id}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onClick={() => handleSelect(ingredient._id)}
                      inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${ingredient._id}` }}
                    />
                  </TableCell>
                  {tabColumns[tabValue].map((column) => (
                    <TableCell key={`${ingredient._id}-${column.id}`} align={column.align}>
                      {renderCell(ingredient, column)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredIngredients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Product Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Edit Product</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Product Name"
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Product Family</InputLabel>
                <Select
                  value={editedProductFamily}
                  onChange={(e) => setEditedProductFamily(e.target.value)}
                  label="Product Family"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Spirit">Spirit</MenuItem>
                  <MenuItem value="Wine">Wine</MenuItem>
                  <MenuItem value="Beer">Beer</MenuItem>
                  <MenuItem value="Mixer">Mixer</MenuItem>
                  <MenuItem value="Garnish">Garnish</MenuItem>
                </Select>
              </FormControl>
            
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Vodka">Vodka</MenuItem>
                  <MenuItem value="Gin">Gin</MenuItem>
                  <MenuItem value="Whiskey">Whiskey</MenuItem>
                  <MenuItem value="Rum">Rum</MenuItem>
                  <MenuItem value="Tequila">Tequila</MenuItem>
                  <MenuItem value="Red Wine">Red Wine</MenuItem>
                  <MenuItem value="White Wine">White Wine</MenuItem>
                  <MenuItem value="Sparkling Wine">Sparkling Wine</MenuItem>
                </Select>
              </FormControl>
            
              <FormControl fullWidth size="small">
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={editedSubcategory}
                  onChange={(e) => setEditedSubcategory(e.target.value)}
                  label="Subcategory"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Bourbon">Bourbon</MenuItem>
                  <MenuItem value="Scotch">Scotch</MenuItem>
                  <MenuItem value="Rye">Rye</MenuItem>
                  <MenuItem value="London Dry">London Dry</MenuItem>
                  <MenuItem value="Navy Strength">Navy Strength</MenuItem>
                  <MenuItem value="Cabernet Sauvignon">Cabernet Sauvignon</MenuItem>
                  <MenuItem value="Chardonnay">Chardonnay</MenuItem>
                  <MenuItem value="Champagne">Champagne</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="inherit">Cancel</Button>
          <Button 
            onClick={handleSaveProduct} 
            variant="contained" 
            color="primary"
            disabled={!editedName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unit Size Dialog */}
      <UnitSizeDialog
        open={unitSizeDialogOpen}
        onClose={() => setUnitSizeDialogOpen(false)}
        onSave={(value) => {
          if (currentUnitSizeIngredient) {
            handleFieldUpdate(currentUnitSizeIngredient, 'unitSize', value);
            setCurrentUnitSizeIngredient(null);
          }
        }}
        currentValue={currentUnitSizeIngredient?.unitSize || ''}
      />

      {/* Unit Size Info Dialog */}
      <UnitSizeInfoDialog
        open={unitSizeInfoOpen}
        onClose={handleUnitSizeInfoClose}
      />

      {/* UPC Info Dialog */}
      <UPCInfoDialog
        open={upcInfoOpen}
        onClose={handleUpcInfoClose}
      />

      {/* Packaging Type Info Dialog */}
      <PackagingTypeInfoDialog
        open={packagingTypeInfoOpen}
        onClose={handlePackagingTypeInfoClose}
      />

      {/* Import Dialog */}
      {importOpen && (
        <IngredientCSVUpload
          open={importOpen}
          onClose={handleImportClose}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this ingredient?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Ingredients;