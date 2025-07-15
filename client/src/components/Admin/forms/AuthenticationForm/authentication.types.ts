type FormLayout = 'login' | 'register';

interface FormState {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  registrationCode: string; // Add this
  isValidEmail: boolean;
  isValidPassword: boolean;
  isValidConfirmPassword: boolean;
  isValidRegistrationCode: boolean; // Add this
  formLayout: FormLayout;
}

type FormAction =
| { type: 'SET_EMAIL'; payload: string }
| { type: 'SET_NAME'; payload: string }
| { type: 'SET_PASSWORD'; payload: string }
| { type: 'SET_CONFIRM_PASSWORD'; payload: string }
| { type: 'SET_REGISTRATION_CODE'; payload: string } // Add this
| { type: 'SET_EMAIL_VALIDITY'; payload: boolean }
| { type: 'SET_PASSWORD_VALIDITY'; payload: boolean }
| { type: 'SET_CONFIRM_PASSWORD_VALIDITY'; payload: boolean }
| { type: 'SET_REGISTRATION_CODE_VALIDITY'; payload: boolean } // Add this
| { type: 'SET_FORM_LAYOUT'; payload: FormLayout }
| { type: 'RESET_FORM' };

export type {
  FormLayout,
  FormState,
  FormAction
}