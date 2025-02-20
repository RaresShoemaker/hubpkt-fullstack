import React from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { Sun, Moon } from 'lucide-react';
import ButtonBase from '../Buttons/ButtonBase';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, isLoading } = useTheme();

  const icon = isDark ? (
    <Sun className="w-5 h-5 text-dark-text-accent" />
  ) : (
    <Moon className="w-5 h-5 text-light-text-accent" />
  );

  return (
    <ButtonBase
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      disabled={isLoading}
      isLoading={isLoading}
      leftIcon={icon}
      className="p-2"
      aria-label="Toggle theme"
    />
  );
};