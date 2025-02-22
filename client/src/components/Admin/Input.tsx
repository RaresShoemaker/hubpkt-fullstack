import { Description, Field, Input, Label } from '@headlessui/react'
import { useState, useCallback } from 'react'
import clsx from 'clsx'

interface ValidationProps {
  validator?: (value: string) => string | null
  customPattern?: RegExp 
  onValidationChange?: (isValid: boolean) => void
}

interface CustomInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>, ValidationProps {
  label?: string
  description?: string
  value: string
  onChange: (value: string) => void
}

const CustomInput: React.FC<CustomInputProps> = ({
  label = '',
  description = '',
  value,
  onChange,
  onValidationChange,
  required = false,
  minLength,
  maxLength,
  customPattern,
  pattern,
  validator,
  type = 'text',
  className,
  ...props
}) => {
  const [error, setError] = useState<string | null>(null)

  // Validation function that combines all validation rules
  const validateInput = useCallback((inputValue: string): string | null => {
    // Required field validation
    if (required && !inputValue) {
      return 'This field is required'
    }

    // Min length validation
    if (minLength && inputValue.length < minLength) {
      return `Must be at least ${minLength} characters`
    }

    // Max length validation
    if (maxLength && inputValue.length > maxLength) {
      return `Must not exceed ${maxLength} characters`
    }

    // Custom RegExp pattern validation
    if (customPattern && !customPattern.test(inputValue)) {
      return 'Invalid format'
    }

    // HTML pattern validation
    if (pattern && !new RegExp(pattern).test(inputValue)) {
      return 'Invalid format'
    }

    // Custom validator
    if (validator) {
      const customError = validator(inputValue)
      if (customError) {
        return customError
      }
    }

    return null
  }, [required, minLength, maxLength, customPattern, pattern, validator])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    onChange(newValue)
    
    const validationError = validateInput(newValue)
    setError(validationError)
    
    if (onValidationChange) {
      onValidationChange(!validationError)
    }
  }

  return (
    <div className="w-full max-w-md px-4">
      <Field>
        <Label className="text-sm/6 font-medium text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        <Description className="text-sm/6 text-white/50">
          {description}
        </Description>
        
        <Input
          {...props}
          type={type}
          value={value}
          onChange={handleChange}
          pattern={pattern}
          className={clsx(
            'mt-3 block w-full rounded-lg border-none py-1.5 px-3 text-sm/6',
            error 
              ? 'bg-red-950/20 text-red-400 focus:outline-red-500/25' 
              : 'bg-white/5 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
            className
          )}
        />
        
        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </Field>
    </div>
  )
}

export default CustomInput