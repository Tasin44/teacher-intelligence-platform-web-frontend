/**
 * Session storage helpers for temporary, flow-scoped state.
 * sessionStorage is cleared when the tab closes — safer than localStorage
 * for sensitive in-progress data like email-in-flight and reset tokens.
 */

// ── Signup flow ──────────────────────────────────────────────────────────────
const SIGNUP_EMAIL_KEY = 'edupulse_signup_email';

export function saveSignupEmail(email: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SIGNUP_EMAIL_KEY, email);
}

export function getSignupEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(SIGNUP_EMAIL_KEY);
}

export function clearSignupEmail(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SIGNUP_EMAIL_KEY);
}

// ── Forgot-password flow ─────────────────────────────────────────────────────
const FORGOT_STATE_KEY = 'edupulse_forgot_state';

interface ForgotPasswordState {
  email: string;
  reset_token?: number; // set after OTP is verified
}

export function saveForgotPasswordEmail(email: string): void {
  if (typeof window === 'undefined') return;
  const existing = getForgotPasswordState();
  const next: ForgotPasswordState = { ...(existing ?? {}), email };
  sessionStorage.setItem(FORGOT_STATE_KEY, JSON.stringify(next));
}

export function saveForgotPasswordResetToken(reset_token: number): void {
  if (typeof window === 'undefined') return;
  const existing = getForgotPasswordState();
  if (!existing) return;
  sessionStorage.setItem(FORGOT_STATE_KEY, JSON.stringify({ ...existing, reset_token }));
}

export function getForgotPasswordState(): ForgotPasswordState | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(FORGOT_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ForgotPasswordState;
  } catch {
    return null;
  }
}

export function clearForgotPasswordState(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(FORGOT_STATE_KEY);
}
