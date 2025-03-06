import React, { useState } from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  onChange: (file: File | null) => void;
  preview?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  error,
  required = false,
  helperText,
  onChange,
  preview,
  accept = "image/*",
  className = '',
  ...props
}) => {
  const { isDark } = useTheme();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);
  
  const labelColor = isDark ? 'text-dark-text-primary' : 'text-light-text-primary';
  const inputStyles = `w-full p-2 rounded border ${
    isDark 
      ? 'bg-dark-surface border-dark-border/50 text-dark-text-primary' 
      : 'bg-light-surface border-light-border/50 text-light-text-primary'
  } ${error ? 'border-red-500' : ''}`;
  const helperTextColor = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary';
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (preview) {
        setPreviewUrl(URL.createObjectURL(file));
      }
      
      onChange(file);
    } else {
      onChange(null);
    }
  };
  
  return (
    <div>
      <label 
        className={`block mb-2 ${labelColor}`}
        htmlFor={name}
      >
        {label}{required && '*'}
      </label>
      
      <div className="flex items-center gap-4">
        {/* Image preview */}
        {previewUrl && (
          <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-300">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* File input */}
        <div className="flex-1">
          <input
            id={name}
            name={name}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className={`${inputStyles} ${className}`}
            {...props}
          />
          
          {error ? (
            <p className="mt-1 text-red-500 text-sm">{error}</p>
          ) : helperText ? (
            <p className={`mt-1 text-sm ${helperTextColor}`}>{helperText}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};