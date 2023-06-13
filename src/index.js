import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from "./theme"
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
 // </React.StrictMode>
);

reportWebVitals();

