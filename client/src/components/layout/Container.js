import React from 'react';
import { Container as MuiContainer, Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.only('sm')]: {
    padding: theme.spacing(3),
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '-0.01em',
  marginBottom: theme.spacing(0.5),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '40%',
    height: 4,
    borderRadius: 2,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  }
}));

const PageSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  maxWidth: '750px',
  lineHeight: 1.6,
  color: theme.palette.text.secondary,
}));

/**
 * Container component for consistent page layout
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle/description
 * @param {string} props.maxWidth - MUI Container maxWidth ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {boolean} props.disablePaper - Whether to disable the Paper wrapper
 * @param {Object} props.sx - Additional styles to apply to the container
 * @param {Object} props.paperSx - Additional styles to apply to the paper
 * @param {Object} props.titleSx - Additional styles to apply to the title
 */
const Container = ({ 
  children, 
  title, 
  subtitle, 
  maxWidth = 'xl', 
  disablePaper = false,
  sx = {},
  paperSx = {},
  titleSx = {}
}) => {
  return (
    <MuiContainer 
      maxWidth={maxWidth} 
      sx={{ 
        py: { xs: 4, md: 6 },
        ...sx
      }}
    >
      {title && (
        <Box sx={{ mb: subtitle ? 1 : 4 }}>
          <PageTitle 
            variant="h4" 
            component="h1" 
            sx={{ 
              ...titleSx
            }}
          >
            {title}
          </PageTitle>
          
          {subtitle && (
            <PageSubtitle 
              variant="subtitle1"
            >
              {subtitle}
            </PageSubtitle>
          )}
        </Box>
      )}
      
      {disablePaper ? (
        <Box>{children}</Box>
      ) : (
        <StyledPaper 
          elevation={0} 
          sx={{ 
            ...paperSx
          }}
        >
          {children}
        </StyledPaper>
      )}
    </MuiContainer>
  );
};

export default Container; 