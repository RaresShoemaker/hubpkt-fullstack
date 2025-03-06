import React from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  error,
  required = false,
  helperText,
  className = '',
  ...props
}) => {
  const { isDark } = useTheme();
  
  const labelColor = isDark ? 'text-dark-text-primary' : 'text-light-text-primary';
  const textareaStyles = `w-full p-2 rounded border ${
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
      
      <textarea
        id={name}
        name={name}
        className={`${textareaStyles} ${className}`}
        {...props}
      />
      
      {error ? (
        <p className="mt-1 text-red-500 text-sm">{error}</p>
      ) : helperText ? (
        <p className={`mt-1 text-sm ${helperTextColor}`}>{helperText}</p>
      ) : null}
    </div>
  );
};
