import React from 'react';
import { Container as MuiContainer, Box, Typography, Paper } from '@mui/material';

const Container = ({ children, title, subtitle, maxWidth = 'lg', disablePaper = false }) => {
  return (
    <MuiContainer maxWidth={maxWidth} sx={{ py: 6 }}>
      {title && (
        <Box sx={{ mb: subtitle ? 1 : 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              letterSpacing: '-0.01em',
              mb: 0.5
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ 
                mb: 4,
                maxWidth: '650px'
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      
      {disablePaper ? (
        <Box>{children}</Box>
      ) : (
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          {children}
        </Paper>
      )}
    </MuiContainer>
  );
};

export default Container; 