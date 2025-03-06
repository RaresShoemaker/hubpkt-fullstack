import { useReducer, useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

interface FormState<T> {
  formData: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  touched: Record<string, boolean>;
}

type FormAction<T> =
  | { type: 'INITIALIZE_FORM'; payload: Partial<T> }
  | { type: 'SET_FIELD'; payload: { name: string; value: unknown } }
  | { type: 'SET_MULTIPLE_FIELDS'; payload: Partial<T> }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'CLEAR_ALL_ERRORS' }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_TOUCHED'; payload: string }
  | { type: 'RESET_FORM' };

// Create a function to initialize the form state
function createInitialState<T>(initialData: T): FormState<T> {
  return {
    formData: initialData,
    errors: {},
    isSubmitting: false,
    isDirty: false,
    touched: {}
  };
}

// Create a generic reducer function
function formReducer<T>(state: FormState<T>, action: FormAction<T>): FormState<T> {
  switch (action.type) {
    case 'INITIALIZE_FORM':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload
        },
        isDirty: false,
        touched: {}
      };
    
    case 'SET_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value
        },
        isDirty: true
      };
    
    case 'SET_MULTIPLE_FIELDS':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload
        },
        isDirty: true
      };
    
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload
      };
    
    case 'CLEAR_ERROR':
      { const updatedErrors = { ...state.errors };
      delete updatedErrors[action.payload];
      return {
        ...state,
        errors: updatedErrors
      }; }
    
    case 'CLEAR_ALL_ERRORS':
      return {
        ...state,
        errors: {}
      };
    
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload
      };
      
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.payload]: true
        }
      };
    
    case 'RESET_FORM':
      return createInitialState(state.formData);
    
    default:
      return state;
  }
}

// Hook props 
interface UseFormProps<T, S extends z.ZodType<T>> {
  initialData: T;
  schema: S;
  onSubmit: (data: T) => void | Promise<void>;
  clearErrors?: () => void; // Function to clear external errors
  // Optional additional validation
  customValidation?: (data: T) => Record<string, string> | null;
  // Option to disable automatic validation on submit
  validateOnSubmit?: boolean;
}

// The generic form hook
export function useForm<T extends Record<string, unknown>, S extends z.ZodType<T>>({
  initialData,
  schema,
  onSubmit,
  clearErrors,
  customValidation,
  validateOnSubmit = true
}: UseFormProps<T, S>) {
  const [state, dispatch] = useReducer(
    formReducer<T>,
    createInitialState(initialData)
  );
  
  const { formData, errors, isSubmitting, isDirty, touched } = state;
  
  // Track if the form has been submitted at least once
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Clear external errors when form mounts and unmounts
  useEffect(() => {
    if (clearErrors) {
      clearErrors();
    }
    
    return () => {
      if (clearErrors) {
        clearErrors();
      }
    };
  }, [clearErrors]);
  
  // Initialize or reset form data
  const initializeForm = useCallback((data: Partial<T>) => {
    dispatch({
      type: 'INITIALIZE_FORM',
      payload: data
    });
    
    // Clear external errors when form is initialized
    if (clearErrors) {
      clearErrors();
    }
  }, [clearErrors]);
  
  // Update form with new initialData when it changes
  useEffect(() => {
    if (!isDirty) {
      initializeForm(initialData);
    }
  }, [initialData, isDirty, initializeForm]);
  
  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === 'checkbox' ? checked : value;

    dispatch({
      type: 'SET_FIELD',
      payload: { name, value: newValue }
    });
    
    dispatch({
      type: 'SET_TOUCHED',
      payload: name
    });
    
    // Clear local error when user types
    if (errors[name]) {
      dispatch({
        type: 'CLEAR_ERROR',
        payload: name
      });
    }
    
    // Clear external errors if function provided
    if (clearErrors) {
      clearErrors();
    }
  }, [errors, clearErrors]);
  
  const setField = useCallback((name: string, value: unknown) => {
    dispatch({
      type: 'SET_FIELD',
      payload: { name, value }
    });
    
    dispatch({
      type: 'SET_TOUCHED',
      payload: name
    });
    
    // Clear local error when field is updated
    if (errors[name]) {
      dispatch({
        type: 'CLEAR_ERROR',
        payload: name
      });
    }
    
    // Clear external errors if function provided
    if (clearErrors) {
      clearErrors();
    }
  }, [errors, clearErrors]);
  
  // Set multiple fields at once
  const setFields = useCallback((data: Partial<T>) => {
    dispatch({
      type: 'SET_MULTIPLE_FIELDS',
      payload: data
    });
    
    // Mark fields as touched
    Object.keys(data).forEach(key => {
      dispatch({
        type: 'SET_TOUCHED',
        payload: key
      });
      
      // Clear errors for updated fields
      if (errors[key]) {
        dispatch({
          type: 'CLEAR_ERROR',
          payload: key
        });
      }
    });
    
    // Clear external errors if function provided
    if (clearErrors) {
      clearErrors();
    }
  }, [errors, clearErrors]);
  
  // Clear all form errors (both local and external)
  const clearAllErrors = useCallback(() => {
    // Clear local form errors
    dispatch({
      type: 'CLEAR_ALL_ERRORS'
    });
    
    // Clear external errors if function provided
    if (clearErrors) {
      clearErrors();
    }
  }, [clearErrors]);
  
  // Validate the form
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    let validationErrors: Record<string, string> = {};
    
    // Schema validation
    try {
      schema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        isValid = false;
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          validationErrors[path] = err.message;
        });
      }
    }
    
    // Custom validation if provided
    if (customValidation) {
      const customErrors = customValidation(formData);
      if (customErrors) {
        isValid = false;
        validationErrors = { ...validationErrors, ...customErrors };
      }
    }
    
    // Update errors state
    dispatch({
      type: 'SET_ERRORS',
      payload: validationErrors
    });
    
    return isValid;
  }, [formData, schema, customValidation]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    // Clear external errors before validation
    if (clearErrors) {
      clearErrors();
    }
    
    // Validate if enabled
    if (validateOnSubmit && !validateForm()) {
      return;
    }
    
    dispatch({
      type: 'SET_SUBMITTING',
      payload: true
    });
    
    try {
      await onSubmit(formData);
    } finally {
      dispatch({
        type: 'SET_SUBMITTING',
        payload: false
      });
    }
  }, [formData, validateForm, onSubmit, clearErrors, validateOnSubmit]);
  
  // Reset the form
  const resetForm = useCallback(() => {
    dispatch({
      type: 'RESET_FORM'
    });
    setHasSubmitted(false);
    
    // Clear external errors if function provided
    if (clearErrors) {
      clearErrors();
    }
  }, [clearErrors]);
  
  // Reset to initial data
  const resetToInitial = useCallback(() => {
    initializeForm(initialData);
    setHasSubmitted(false);
  }, [initialData, initializeForm]);
  
  return {
    formData,
    errors,
    touched,
    isSubmitting,
    isDirty,
    hasSubmitted,
    handleChange,
    setField,
    setFields,
    handleSubmit,
    validateForm,
    resetForm,
    resetToInitial,
    initializeForm,
    clearAllErrors
  };
}