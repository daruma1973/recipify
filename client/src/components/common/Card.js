import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions, Typography, Box } from '@mui/material';

const Card = ({ 
  children, 
  title, 
  subheader, 
  action, 
  footer, 
  sx = {}, 
  headerSx = {},
  contentSx = {},
  footerSx = {},
  elevation = 0
}) => {
  return (
    <MuiCard 
      elevation={elevation} 
      sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: elevation === 0 ? '0 4px 20px rgba(0,0,0,0.08)' : undefined,
        },
        ...sx
      }}
    >
      {(title || subheader || action) && (
        <CardHeader
          title={
            title && (
              <Typography 
                variant="h6" 
                component="h2"
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  lineHeight: 1.4
                }}
              >
                {title}
              </Typography>
            )
          }
          subheader={
            subheader && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {subheader}
              </Typography>
            )
          }
          action={action && <Box>{action}</Box>}
          sx={{ 
            px: 3, 
            pt: 2.5, 
            pb: children ? 1 : 2.5,
            borderBottom: children ? '1px solid' : 'none',
            borderColor: 'divider',
            ...headerSx
          }}
        />
      )}
      
      {children && (
        <CardContent sx={{ px: 3, py: 2.5, '&:last-child': { pb: 2.5 }, ...contentSx }}>
          {children}
        </CardContent>
      )}
      
      {footer && (
        <CardActions 
          sx={{ 
            px: 3, 
            py: 2, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            ...footerSx
          }}
        >
          {footer}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card; 