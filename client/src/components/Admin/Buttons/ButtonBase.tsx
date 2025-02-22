import React from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isSelected?: boolean;
}

export const ButtonBase: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  isSelected,
  ...props
}) => {
  const { isDark } = useTheme();

  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-200';
  
  const sizeStyles = {
    sm: children ? 'px-3 py-1.5 text-sm' : 'p-2',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantStyles = {
    primary: isDark
      ? 'bg-dark-accent text-white hover:bg-dark-accent/90 disabled:bg-dark-accent/50'
      : 'bg-light-accent text-white hover:bg-light-accent/90 disabled:bg-light-accent/50',
    secondary: isDark
      ? 'bg-dark-surface text-dark-text-primary border border-dark-border hover:bg-dark-border/20 disabled:bg-dark-surface/50'
      : 'bg-light-surface text-light-text-primary border border-light-border hover:bg-light-border/20 disabled:bg-light-surface/50',
    ghost: isDark
      ? 'bg-dark-surface text-dark-text-primary hover:bg-dark-accent/10 disabled:text-dark-text-secondary'
      : 'bg-light-surface text-light-text-primary hover:bg-light-accent/10 disabled:text-light-text-secondary',
  };

  const selectedStyles = {
    primary: isDark
      ? 'bg-dark-accent/90 text-white'
      : 'bg-light-accent/90 text-white',
    secondary: isDark
      ? 'bg-dark-border/20 text-dark-text-primary'
      : 'bg-light-border/20 text-light-text-primary',
    ghost: isDark
      ? 'bg-dark-accent/10 text-dark-text-primary'
      : 'bg-light-accent/10 text-light-text-primary',
  }

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${isSelected && selectedStyles[variant]}
        ${variantStyles[variant]}
        ${isLoading || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2">⚪</span>
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className={children ? "mr-2" : ""}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default ButtonBase;