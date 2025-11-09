import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { getTheme } from './theme';

// Create a context for theme mode
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  setColorMode: (mode: PaletteMode | 'system') => {},
  mode: 'system' as PaletteMode | 'system',
});

function AegisApp() {
  const [mode, setMode] = useState<PaletteMode | 'system'>(() => {
    // Get saved preference or default to 'system'
    const saved = localStorage.getItem('themeMode');
    return (saved as PaletteMode | 'system') || 'system';
  });

  const [systemPreference, setSystemPreference] = useState<PaletteMode>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine the effective theme mode
  const effectiveMode: PaletteMode = mode === 'system' ? systemPreference : mode;

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : prevMode === 'dark' ? 'system' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
      setColorMode: (newMode: PaletteMode | 'system') => {
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => getTheme(effectiveMode), [effectiveMode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AegisApp />
  </React.StrictMode>
);