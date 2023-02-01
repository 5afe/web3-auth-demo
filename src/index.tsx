import React from 'react';
import ReactDOM from 'react-dom/client';
import { SafeThemeProvider } from '@safe-global/safe-react-components';
import { ThemeProvider, CssBaseline } from '@mui/material';

import App from './App';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SafeThemeProvider mode="dark">
      {(safeTheme) => (
        <ThemeProvider theme={safeTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      )}
    </SafeThemeProvider>
  </React.StrictMode>
);
