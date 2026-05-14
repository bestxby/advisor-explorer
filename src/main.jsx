import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { validateData } from './data/validate';
import ThemeProvider from './context/ThemeContext';
import App from './App.jsx';

validateData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
