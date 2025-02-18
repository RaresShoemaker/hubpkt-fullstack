import React, { useState } from 'react';

type CustomInputProps = {
  label: string;
  type?: string;
  id: string;
  value: string;
  infoText?: string | React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomInput: React.FC<CustomInputProps> = ({ 
  label, 
  type = "text", 
  id, 
  value, 
  infoText,
  onChange, 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <input
          id={id}
          type={type}
          value={value}
          name={id}
          className="peer w-full h-12 rounded-full border-2 border-white bg-transparent text-white px-6 pt-2 
                   focus:outline-none focus:border-white transition-all placeholder-transparent outline-none
                   pr-12"
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={onChange}
          {...props}
        />
      </div>
      {
          infoText && (
            <div className='flex justify-center text-center mt-2 '>
              <span className='text-white text-xs ml-1'>{infoText}</span>
            </div>
          )
        }
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
    </div>
  );
};

export default CustomInput;