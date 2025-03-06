import React from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  error,
  required = false,
  helperText,
  icon,
  className = '',
  ...props
}) => {
  const { isDark } = useTheme();
  
  const labelColor = isDark ? 'text-dark-text-primary' : 'text-light-text-primary';
  const inputStyles = `w-full p-2 rounded border ${
    isDark 
      ? 'bg-dark-surface border-dark-border/50 text-dark-text-primary' 
      : 'bg-light-surface border-light-border/50 text-light-text-primary'
  } ${error ? 'border-red-500' : ''}`;
  const helperTextColor = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary';
  
  return (
    <div className="w-full">
      <label 
        className={`block mb-2 ${labelColor}`}
        htmlFor={name}
      >
        {label}{required && '*'}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={name}
          name={name}
          className={`${inputStyles} ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      
      {error ? (
        <p className="mt-1 text-red-500 text-sm">{error}</p>
      ) : helperText ? (
        <p className={`mt-1 text-sm ${helperTextColor}`}>{helperText}</p>
      ) : null}
    </div>
  );
};