/**
 * Auth API functions — one per backend endpoint.
 * All types mirror the Django serializers exactly.
 */

import { apiClient } from './client';

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface TeacherProfile {
  teacher_id: number;
  first_name: string;
  last_name: string;
  school: number;           // school_id FK
  grade: string;
  room: string;
  email: string;
  profile_picture?: string;
  is_verified: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
export interface SignupPayload {
  first_name: string;
  last_name: string;
  school_id: number;        // PK of the School model
  grade: string;
  room?: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  identifier: string;
}

export function signupRequest(payload: SignupPayload) {
  return apiClient.post<SignupResponse>('/api/auth/signup', payload);
}

// ─── POST /api/auth/signup/verify ────────────────────────────────────────────
export interface VerifySignupPayload {
  email: string;
  otp_code: string;         // 6-digit string
}

export interface VerifySignupResponse {
  teacher: TeacherProfile;
  tokens: AuthTokens;
}

export function verifySignupOtp(payload: VerifySignupPayload) {
  return apiClient.post<VerifySignupResponse>('/api/auth/signup/verify', payload);
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  teacher: TeacherProfile;
  tokens: AuthTokens;
}

export function loginRequest(payload: LoginPayload) {
  return apiClient.post<LoginResponse>('/api/auth/login', payload);
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export function getMeRequest() {
  return apiClient.get<TeacherProfile>('/api/auth/me');
}

export function updateProfileRequest(formData: FormData) {
  return apiClient.patch<TeacherProfile>('/api/auth/me', formData);
}

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
export interface ForgotPasswordPayload {
  email: string;
}

export function forgotPasswordRequest(payload: ForgotPasswordPayload) {
  return apiClient.post<Record<string, never>>('/api/auth/forgot-password', payload);
}

// ─── POST /api/auth/forgot-password/verify ───────────────────────────────────
export interface VerifyForgotPasswordPayload {
  email: string;
  otp_code: string;         // 6-digit string
}

export interface VerifyForgotPasswordResponse {
  reset_token: number;      // otp.id — sent back in step 3
}

export function verifyForgotPasswordOtp(payload: VerifyForgotPasswordPayload) {
  return apiClient.post<VerifyForgotPasswordResponse>(
    '/api/auth/forgot-password/verify',
    payload,
  );
}

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
export interface ResetPasswordPayload {
  reset_token: number;      // otp.id from verify step
  new_password: string;
  confirm_password: string;
}

export function resetPasswordRequest(payload: ResetPasswordPayload) {
  return apiClient.post<Record<string, never>>('/api/auth/reset-password', payload);
}
