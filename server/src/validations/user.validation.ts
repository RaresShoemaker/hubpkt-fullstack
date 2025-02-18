import z from "zod";
import { baseEntitySchema } from "./base.validation";

export const userSchema = z.object({
  ...baseEntitySchema,
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const createUserSchema = userSchema.omit({ 
  id: true, 
  createdAt: true, 
  deletedAt: true 
});

export const updateUserProfileSchema = userSchema
  .omit({ 
    id: true, 
    password: true, 
    createdAt: true, 
    deletedAt: true 
  })
  .partial();

  export const updateUserPasswordSchema = z.object({
    currentPassword: z.string().min(8).max(100),
    newPassword: z.string()
      .min(8)
      .max(100)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    confirmPassword: z.string().min(8).max(100)
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  export const registerUserSchema = z.object({
    name: z.string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: z.string()
      .email("Invalid email address")
      .toLowerCase(),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  export const loginUserSchema = z.object({
    email: z.string()
      .email("Invalid email address")
      .toLowerCase(),
    password: z.string()
      .min(1, "Password is required"),
  });