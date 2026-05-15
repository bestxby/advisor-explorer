import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { validateData } from './data/validate';
import ThemeProvider from './context/ThemeContext';
import App from './App.jsx';

validateData();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
