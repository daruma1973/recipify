import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ 
  children, 
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  href,
  to,
  component,
  sx = {},
  ...props
}) => {
  // Default style based on variant
  const getDefaultSx = () => {
    const base = {
      borderRadius: 2,
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.01em',
      transition: 'all 0.2s ease-in-out',
    };
    
    switch (variant) {
      case 'contained':
        return {
          ...base,
          px: size === 'small' ? 2 : size === 'large' ? 4 : 3,
          py: size === 'small' ? 0.5 : size === 'large' ? 1.5 : 1,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        };
      case 'outlined':
        return {
          ...base,
          px: size === 'small' ? 1.5 : size === 'large' ? 3.5 : 2.5,
          py: size === 'small' ? 0.5 : size === 'large' ? 1.5 : 1,
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        };
      case 'text':
        return {
          ...base,
          px: size === 'small' ? 1 : size === 'large' ? 2 : 1.5,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        };
      default:
        return base;
    }
  };

  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      href={href}
      to={to}
      component={component}
      sx={{ ...getDefaultSx(), ...sx }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button; 