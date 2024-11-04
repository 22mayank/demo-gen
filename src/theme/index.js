import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6D7BFB',
    },
    background: {
      default: '#07080A',
      paper: '#1B1C20',
    },
    grey: {
      700: '#303136',
      800: '#1B1C20',
      900: '#07080A',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#303136',
          color: '#fff',
        },
      },
    },
  },
});