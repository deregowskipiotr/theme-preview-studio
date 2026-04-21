import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'default' | 'light' | 'dark';

export function useThemeMode(initialMode?: ThemeMode) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved === 'default' || saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (initialMode) return initialMode;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const toggleMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('theme-mode');
      if (!saved) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { mode, setMode: toggleMode };
}