import React from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  name: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  className = '',
  ...props
}) => {
  const { isDark } = useTheme();
  
  const labelColor = isDark ? 'text-dark-text-primary' : 'text-light-text-primary';
  
  return (
    <div className="flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        className={`mr-2 ${className}`}
        {...props}
      />
      <label 
        className={labelColor}
        htmlFor={name}
      >
        {label}
      </label>
    </div>
  );
};