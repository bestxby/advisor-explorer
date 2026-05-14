import { useEffect, useState } from 'react';
import { ThemeContext } from './useTheme';

function getInitialTheme() {
  try {
    const stored = localStorage.getItem('advisor-explorer-theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // Ignore
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem('advisor-explorer-theme', theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  // Follow system changes only when user has never set a preference
  useEffect(() => {
    let hasStored = false;
    try {
      hasStored = !!localStorage.getItem('advisor-explorer-theme');
    } catch {
      // Ignore
    }
    if (hasStored) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      const next = e.matches ? 'dark' : 'light';
      setTheme(next);
      applyTheme(next);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
