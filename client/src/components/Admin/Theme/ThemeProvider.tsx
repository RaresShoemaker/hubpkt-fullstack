import React from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'dark' : 'light'}`}>
      <div className={`
        min-h-screen transition-colors duration-300
        ${isDark ? 'bg-dark-background text-dark-text-primary' : 'bg-light-background text-light-text-primary'}
      `}>
        {children}
      </div>
    </div>
  );
};