import { useReducer, useCallback } from 'react';
import type { FormState, FormAction } from './authentication.types';
import { useAuth } from '../../../../store/features/auth/useAuth';
import { useRedirect } from '../../../../hooks/useRedirect';

const useAuthenticationForm = () => {
  const { login, register, isLoading, errors } = useAuth();
  
  const { redirectAfterAuth } = useRedirect();

  const initialState: FormState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isValidEmail: false,
    isValidPassword: false,
    isValidConfirmPassword: false,
    formLayout: 'login',
    registrationCode: '',
    isValidRegistrationCode: false
  };

  const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
      case 'SET_NAME':
        return { ...state, name: action.payload };
      case 'SET_EMAIL':
        return { ...state, email: action.payload };
      case 'SET_PASSWORD':
        return { ...state, password: action.payload };
      case 'SET_CONFIRM_PASSWORD':
        return { ...state, confirmPassword: action.payload };
      case 'SET_REGISTRATION_CODE': // Add this
        return { ...state, registrationCode: action.payload };
      case 'SET_EMAIL_VALIDITY':
        return { ...state, isValidEmail: action.payload };
      case 'SET_PASSWORD_VALIDITY':
        return { ...state, isValidPassword: action.payload };
      case 'SET_CONFIRM_PASSWORD_VALIDITY':
        return { ...state, isValidConfirmPassword: action.payload };
      case 'SET_REGISTRATION_CODE_VALIDITY': // Add this
        return { ...state, isValidRegistrationCode: action.payload };
      case 'SET_FORM_LAYOUT':
        return { 
          ...initialState, 
          formLayout: action.payload 
        };
      case 'RESET_FORM':
        return { 
          ...initialState, 
          formLayout: state.formLayout 
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const isLoginValid = state.isValidEmail && state.isValidPassword;
    const isRegisterValid = 
      isLoginValid && 
      state.isValidConfirmPassword &&
      (import.meta.env.DEV || state.isValidRegistrationCode) && // Skip registration code check in dev
      state.password === state.confirmPassword;

    try {
      let success = false;

      if (state.formLayout === 'login' && isLoginValid) {
        success = await login({
          email: state.email,
          password: state.password
        });
      } else if (state.formLayout === 'register' && isRegisterValid) {
        success = await register({
          name: state.name,
          email: state.email,
          password: state.password,
          registrationCode: state.registrationCode // Add this
        });
      }

      if (success) {
        dispatch({ type: 'RESET_FORM' });
        redirectAfterAuth();
      }
      
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }, [state, login, register, redirectAfterAuth]);

  const confirmPasswordValidator = useCallback((value: string) => {
    if (value !== state.password) {
      return 'Passwords do not match';
    }
    return null;
  }, [state.password]);

  // Add registration code validator
  const registrationCodeValidator = useCallback((value: string) => {
    // Skip validation in development mode
    if (import.meta.env.DEV) {
      return null;
    }
    if (!value || value.trim().length === 0) {
      return 'Registration code is required';
    }
    return null;
  }, []);

  return {
    state,
    dispatch,
    handleSubmit,
    confirmPasswordValidator,
    registrationCodeValidator, // Add this
    isLoading,
    errors,
    isSubmittable: state.formLayout === 'login' 
      ? state.isValidEmail && state.isValidPassword
      : state.isValidEmail && 
        state.isValidPassword && 
        state.isValidConfirmPassword &&
        (import.meta.env.DEV || state.isValidRegistrationCode) && // Skip registration code check in dev
        state.password === state.confirmPassword
  };
};

export default useAuthenticationForm;