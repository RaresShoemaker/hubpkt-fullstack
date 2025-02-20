import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, AppDispatch } from '../../store';
import { initializeTheme, toggleTheme } from './ui.thunk';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDark, isLoading, error } = useSelector((state: AppState) => state.ui.theme);

  // Initialize theme on mount
  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Only update if there's no saved preference
      if (!localStorage.getItem('theme')) {
        dispatch(initializeTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return { isDark, isLoading, error, toggleTheme: handleToggleTheme };
};