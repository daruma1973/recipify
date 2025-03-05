import { createTheme } from '@mui/material/styles';

// Honk-inspired theme with playful colors, rounded shapes, and modern typography
const honkTheme = createTheme({
  palette: {
    primary: {
      main: '#7F5AF7', // Vibrant purple
      light: '#A78DF9',
      dark: '#5A3EC8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF7E5F', // Coral orange
      light: '#FFA58C',
      dark: '#D35A3D',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#26C6F9', // Bright blue
      light: '#7CD6FA',
      dark: '#0099CC',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#25D06C', // Fresh green
      light: '#5FE996',
      dark: '#17A956',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFB648', // Bright yellow
      light: '#FFCD7D',
      dark: '#EB9522',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF5A5A', // Soft red
      light: '#FF8080',
      dark: '#E03A3A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9F8F3', // Soft cream
      paper: '#FFFFFF',
      card1: '#FFEFE0', // Pastel orange
      card2: '#E6F9FF', // Pastel blue
      card3: '#E9F9E9', // Pastel green
      card4: '#F9E6FF', // Pastel purple
      card5: '#FFF5E6', // Pastel yellow
    },
    text: {
      primary: '#222222',
      secondary: '#5C5C5C',
      disabled: '#9E9E9E',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 800,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.9375rem',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(0, 0, 0, 0.04)',
    '0px 4px 16px rgba(0, 0, 0, 0.08)',
    '0px 8px 24px rgba(0, 0, 0, 0.12)',
    '0px 12px 32px rgba(0, 0, 0, 0.16)',
    '0px 16px 40px rgba(0, 0, 0, 0.2)',
    // Fill remaining shadow levels with MUI defaults
    ...Array(19).fill('none')
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.12)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7F5AF7, #6A48D7)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FF7E5F, #FF5A5A)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
        },
        elevation2: {
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
          background: '#FFFFFF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 4px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: '8px 8px 0 0',
          minHeight: 48,
        },
      },
    },
  },
});

export default honkTheme; 