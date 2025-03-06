import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address').min(1, 'Email is required');

const nameSchema = z.string().min(2, 'Name is required');

const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 6 characters')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/[0-7]/, 'Password must contain at least one number')
	.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');


  const emailValidator = (value: string) => {
    const result = emailSchema.safeParse(value);
    return result.success ? null : result.error.errors[0].message;
  };
  
  const nameValidator = (value: string) => {
    const result = nameSchema.safeParse(value);
    return result.success ? null : result.error.errors[0].message;
  }
  
  const passwordValidator = (value: string) => {
    const result = passwordSchema.safeParse(value);
    return result.success ? null : result.error.errors[0].message;
  };

  export {
    emailValidator,
    nameValidator,
    passwordValidator
  }