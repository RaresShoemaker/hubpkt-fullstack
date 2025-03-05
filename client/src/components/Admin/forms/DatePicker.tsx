import React from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
  label: string;
  dateId: string;
  timeId: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  helperText?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  dateId,
  timeId,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  error,
  required = false,
  helperText
}) => {
  const { isDark } = useTheme();
  
  const labelColor = isDark ? 'text-dark-text-primary' : 'text-light-text-primary';
  const inputStyles = `w-full pl-10 p-2 rounded border ${
    isDark 
      ? 'bg-dark-surface border-dark-border/50 text-dark-text-primary' 
      : 'bg-light-surface border-light-border/50 text-light-text-primary'
  } ${error ? 'border-red-500' : ''}`;
  const iconColor = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary';
  const helperTextColor = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary';
  
  return (
    <div>
      <label 
        className={`block mb-2 ${labelColor}`}
        htmlFor={dateId}
      >
        {label}{required && '*'}
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date picker */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar size={16} className={iconColor} />
          </div>
          <input
            id={dateId}
            name={dateId}
            type="date"
            value={dateValue}
            onChange={onDateChange}
            className={inputStyles}
          />
        </div>
        
        {/* Time picker */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock size={16} className={iconColor} />
          </div>
          <input
            id={timeId}
            name={timeId}
            type="time"
            value={timeValue}
            onChange={onTimeChange}
            className={inputStyles}
          />
        </div>
      </div>
      
      {error ? (
        <p className="mt-1 text-red-500 text-sm">{error}</p>
      ) : helperText ? (
        <p className={`mt-1 text-sm ${helperTextColor}`}>{helperText}</p>
      ) : null}
    </div>
  );
};
