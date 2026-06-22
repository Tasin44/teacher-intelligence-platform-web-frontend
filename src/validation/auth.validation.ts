import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  school: z.string().min(1, 'School/Campus is required'),
  grade: z.string().min(1, 'Grade assignment is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(5, 'Verification code must be exactly 5 digits'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type TSignInInput = z.infer<typeof signInSchema>;
export type TSignUpInput = z.infer<typeof signUpSchema>;
export type TForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type TVerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type TResetPasswordInput = z.infer<typeof resetPasswordSchema>;
