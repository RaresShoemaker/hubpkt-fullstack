import React, { useState } from 'react';

type Option = {
  value: string;
  label: string;
};

type CustomDropdownProps = {
  label: string;
  id: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  label, 
  id, 
  value, 
  options, 
  onChange,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        name={id}
        className="peer w-full h-12 rounded-full border-2 border-white bg-transparent text-white px-6 pt-1
                   focus:outline-none focus:border-white transition-all outline-none appearance-none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={onChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-blue-700">
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`absolute left-6 transition-all duration-200 pointer-events-none
                   ${(isFocused || hasValue) 
                     ? '-top-3 text-sm text-white'
                     : 'top-3 text-white/70'
                   }
                   before:content-[''] before:absolute before:left-0 before:top-[9px] 
                   before:w-full before:h-[2px]
                   ${(isFocused || hasValue) ? 'before:block' : 'before:hidden'}`}
      >
        <span className="bg-blue-700 px-1">{label}</span>
      </label>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg 
          className="w-4 h-4 text-white"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </div>
    </div>
  );
};

export default CustomDropdown;