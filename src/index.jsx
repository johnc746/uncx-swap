import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { MetaMaskProvider } from "metamask-react";
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#122155',
      text: '#fafafa',
      title: '#b9babb',
      hotColor: '#0d173a',
      hoverColor: '#07317e6f',
      outline: '#07317e',
      dark: '#0d173a',
      green: '#68d67c',
    }
  },
  typography: {
    "fontFamily": `"Poppins", "Roboto", "Helvetica", "Arial", sans-serif`
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MetaMaskProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </MetaMaskProvider>
  </React.StrictMode>
);