import { createTheme, alpha, PaletteMode } from '@mui/material/styles';

// Material Design 3 (Material You) Theme
// Inspired by https://m3.material.io/ with vibrant, bright colors

export const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#6750A4',      // M3 Primary - vibrant purple
      light: '#9A82DB',
      dark: '#4F378B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#625B71',      // M3 Secondary - muted purple
      light: '#8A828E',
      dark: '#4A4458',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#7D5260',      // M3 Tertiary - rose
      light: '#A37F8F',
      dark: '#633B48',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#B3261E',      // M3 Error - vibrant red
      light: '#DC362E',
      dark: '#8C1D18',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F9A825',      // Vibrant amber
      light: '#FBC02D',
      dark: '#C67100',
      contrastText: mode === 'light' ? '#000000' : '#FFFFFF',
    },
    info: {
      main: '#0B57D0',      // M3 Info - vibrant blue
      light: '#4285F4',
      dark: '#0842A0',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#188038',      // M3 Success - vibrant green
      light: '#34A853',
      dark: '#0D652D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#FEF7FF' : '#1C1B1F',   // M3 Surface
      paper: mode === 'light' ? '#FFFFFF' : '#2B2930',
    },
    surface: {
      main: mode === 'light' ? '#FFFFFF' : '#2B2930',
      variant: mode === 'light' ? '#E7E0EC' : '#49454F',   // M3 Surface variant
    },
    outline: {
      main: mode === 'light' ? '#79747E' : '#938F99',      // M3 Outline
      variant: mode === 'light' ? '#C4C7C5' : '#49454F',
    },
    text: {
      primary: mode === 'light' ? '#1D1B20' : '#E6E1E5',   // M3 On Surface
      secondary: mode === 'light' ? '#49454F' : '#CAC4D0', // M3 On Surface Variant
      disabled: mode === 'light' ? '#79747E' : '#938F99',
    },
  },
  shape: {
    borderRadius: 16,       // M3 uses larger, more rounded corners
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Material Design 3 Typography Scale
    h1: {
      fontSize: '3.5rem',   // Display Large
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '-0.25px',
    },
    h2: {
      fontSize: '2.8rem',   // Display Medium
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0px',
    },
    h3: {
      fontSize: '2.25rem',  // Display Small
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0px',
    },
    h4: {
      fontSize: '2rem',     // Headline Large
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0px',
    },
    h5: {
      fontSize: '1.5rem',   // Headline Medium
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0px',
    },
    h6: {
      fontSize: '1.25rem',  // Headline Small
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0px',
    },
    subtitle1: {
      fontSize: '1rem',     // Title Large
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.15px',
    },
    subtitle2: {
      fontSize: '0.875rem', // Title Medium
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.1px',
    },
    body1: {
      fontSize: '1rem',     // Body Large
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
    },
    body2: {
      fontSize: '0.875rem', // Body Medium
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.25px',
    },
    button: {
      fontSize: '0.875rem', // Label Large
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.1px',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',  // Body Small
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.4px',
    },
    overline: {
      fontSize: '0.6875rem', // Label Small
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
  },
  shadows: [
    'none',
    // Elevation 1 - M3 Shadow
    mode === 'light'
      ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
      : '0px 1px 3px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.4)',
    // Elevation 2
    mode === 'light'
      ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)'
      : '0px 2px 6px 2px rgba(0, 0, 0, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.4)',
    // Elevation 3
    mode === 'light'
      ? '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)'
      : '0px 4px 8px 3px rgba(0, 0, 0, 0.5), 0px 1px 3px rgba(0, 0, 0, 0.4)',
    // Elevation 4
    mode === 'light'
      ? '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)'
      : '0px 6px 10px 4px rgba(0, 0, 0, 0.5), 0px 2px 3px rgba(0, 0, 0, 0.4)',
    // Elevation 5
    mode === 'light'
      ? '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)'
      : '0px 8px 12px 6px rgba(0, 0, 0, 0.5), 0px 4px 4px rgba(0, 0, 0, 0.4)',
    // Keep the rest of the default shadows
    ...Array(19).fill(
      mode === 'light'
        ? '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)'
        : '0px 8px 12px 6px rgba(0, 0, 0, 0.5), 0px 4px 4px rgba(0, 0, 0, 0.4)'
    ),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#FEF7FF' : '#1C1B1F',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 100,        // M3 Buttons are fully rounded
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: '0.875rem',
          fontWeight: 500,
          letterSpacing: '0.1px',
          transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
        },
        contained: {
          boxShadow: mode === 'light'
            ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
            : '0px 1px 3px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.4)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)'
              : '0px 2px 6px 2px rgba(0, 0, 0, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.4)',
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          boxShadow: mode === 'light'
            ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
            : '0px 1px 3px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)'
              : '0px 2px 6px 2px rgba(0, 0, 0, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingBottom: 8,
        },
        title: {
          fontSize: '1.25rem',
          fontWeight: 500,
          letterSpacing: '0px',
        },
        subheader: {
          fontSize: '0.875rem',
          fontWeight: 400,
          letterSpacing: '0.25px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: mode === 'light' ? '#F7F2FA' : '#1C1B1F',
          borderRight: 'none',
          boxShadow: mode === 'light'
            ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
            : '0px 1px 3px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          marginLeft: 8,
          marginRight: 8,
          marginBottom: 4,
          transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
          '&.Mui-selected': {
            backgroundColor: alpha('#6750A4', mode === 'light' ? 0.12 : 0.2),
            '&:hover': {
              backgroundColor: alpha('#6750A4', mode === 'light' ? 0.16 : 0.24),
            },
          },
          '&:hover': {
            backgroundColor: alpha('#6750A4', mode === 'light' ? 0.08 : 0.12),
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' ? '#79747E' : '#938F99',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: '#6750A4',
              },
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        standardSuccess: {
          backgroundColor: alpha('#188038', mode === 'light' ? 0.1 : 0.2),
          color: mode === 'light' ? '#0D652D' : '#34A853',
        },
        standardError: {
          backgroundColor: alpha('#B3261E', mode === 'light' ? 0.1 : 0.2),
          color: mode === 'light' ? '#8C1D18' : '#DC362E',
        },
        standardWarning: {
          backgroundColor: alpha('#F9A825', mode === 'light' ? 0.1 : 0.2),
          color: mode === 'light' ? '#C67100' : '#FBC02D',
        },
        standardInfo: {
          backgroundColor: alpha('#0B57D0', mode === 'light' ? 0.1 : 0.2),
          color: mode === 'light' ? '#0842A0' : '#4285F4',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

// Add custom type augmentation for palette extensions
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    surface: {
      main: string;
      variant: string;
    };
    outline: {
      main: string;
      variant: string;
    };
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    surface?: {
      main?: string;
      variant?: string;
    };
    outline?: {
      main?: string;
      variant?: string;
    };
  }
}

// Export default light theme for backward compatibility
export default getTheme('light');
