import React, { useContext } from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import RecipeSourceContext from '../../context/recipeSource/recipeSourceContext';
import AlertContext from '../../context/alert/alertContext';

const RecipeSourceItem = ({ recipeSource, onEdit }) => {
  const recipeSourceContext = useContext(RecipeSourceContext);
  const alertContext = useContext(AlertContext);

  const { deleteRecipeSource } = recipeSourceContext;
  const { setAlert } = alertContext;

  const { _id, name, url, isActive, isDefault } = recipeSource;

  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe source?')) {
      deleteRecipeSource(_id);
      setAlert('Recipe source deleted', 'success');
    }
  };

  return (
    <ListItem divider>
      <ListItemText
        primary={
          <>
            {name} {isDefault && (
              <Tooltip title="Default Source">
                <StarIcon color="primary" fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
              </Tooltip>
            )}
          </>
        }
        secondary={url}
      />
      <Chip
        icon={isActive ? <CheckCircleIcon /> : <CancelIcon />}
        label={isActive ? 'Active' : 'Inactive'}
        color={isActive ? 'success' : 'default'}
        size="small"
        sx={{ mr: 2 }}
      />
      <ListItemSecondaryAction>
        <Tooltip title="Edit">
          <IconButton edge="end" onClick={() => onEdit(recipeSource)} size="small" sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton edge="end" onClick={onDelete} size="small">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default RecipeSourceItem; 