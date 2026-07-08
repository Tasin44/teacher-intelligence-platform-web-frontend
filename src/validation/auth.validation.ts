import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  firstName:  z.string().min(1, 'First name is required'),
  lastName:   z.string().min(1, 'Last name is required'),
  grade:      z.string().min(1, 'Grade assignment is required'),
  classroom:  z.string().min(1, 'Classroom Room# is required'),
  email:      z.string().min(1, 'Email is required').email('Invalid email address'),
  password:   z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

// Backend OTP is always 6 digits
export const verifyOtpSchema = z.object({
  otp: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export const resetPasswordSchema = z.object({
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export type TSignInInput          = z.infer<typeof signInSchema>;
export type TSignUpInput          = z.infer<typeof signUpSchema>;
export type TForgotPasswordInput  = z.infer<typeof forgotPasswordSchema>;
export type TVerifyOtpInput       = z.infer<typeof verifyOtpSchema>;
export type TResetPasswordInput   = z.infer<typeof resetPasswordSchema>;
