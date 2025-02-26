import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
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
    fontSize: 11,
    h6: {
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '4px 8px'
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
    }
  },
  spacing: 4,
});

export default theme;