import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e2023',
      text: '#fafafa',
      title: '#b9babb',
      hotColor: '#18191c',
      hoverColor: '#22272c',
      outline: '#363636',
      dark: '#151617',
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
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);