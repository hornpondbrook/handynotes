import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Bright blue
      light: '#64b5f6',
      dark: '#1976d2'
    },
    secondary: {
      main: '#ff4081', // Pink
      light: '#ff79b0',
      dark: '#c60055'
    },
    error: {
      main: '#f44336' // Red
    },
    warning: {
      main: '#ffa726' // Orange
    },
    success: {
      main: '#66bb6a' // Green
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    grey: {
      100: '#f5f5f5',
      200: '#e3f2fd', // Light blue background
      300: '#bbdefb', // Hover state
    }
  },
  typography: {
    fontFamily: [
      'JetBrains Mono',
      'Fira Code',
      'Source Code Pro',
      'Consolas',
      'Monaco',
      'monospace'
    ].join(','),
    fontSize: 10,
    h6: {
      fontSize: '0.8rem',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '4px 8px',
          '&.MuiIconButton-colorPrimary:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.08)'
          },
          '&.MuiIconButton-colorError:hover': {
            backgroundColor: 'rgba(244, 67, 54, 0.08)'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 6
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          border: 'none',
          '& > *': {
            padding: '4px 2px'
          },
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.04)' // Light blue hover
          },
          transition: 'background-color 0.2s ease'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '4px 8px',
          borderBottom: 'none'
        },
        sizeSmall: {
          padding: '2px 4px'
        }
      }
    }
  },
  spacing: 3,
});

export default theme;