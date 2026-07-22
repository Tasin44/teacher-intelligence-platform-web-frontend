"use client"
import React, { useRef, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { verifySignupOtp, verifyForgotPasswordOtp, signupRequest, forgotPasswordRequest } from '@/lib/api/auth.api'
import { ApiError } from '@/lib/api/client'
import {
    getSignupEmail,
    clearSignupEmail,
    getForgotPasswordState,
    saveForgotPasswordResetToken,
    clearForgotPasswordState,
} from '@/lib/auth/session'
import { profileToTeacher } from '@/lib/context/EduPulseContext'
import { useEduPulse } from '@/lib/context/EduPulseContext'

const OTP_LENGTH = 6;

const VerifyOtpPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useEduPulse();

    // mode: 'signup' | 'forgot-password'
    const mode = searchParams.get('mode') ?? 'signup';

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    // Redirect if required session state is missing
    useEffect(() => {
        if (mode === 'signup' && !getSignupEmail()) {
            router.replace('/auth/sign-up');
        }
        if (mode === 'forgot-password' && !getForgotPasswordState()?.email) {
            router.replace('/auth/forgot-password');
        }
    }, [mode, router]);

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        setError(null);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!pasted) return;
        const newOtp = Array(OTP_LENGTH).fill('');
        pasted.split('').forEach((ch, i) => { newOtp[i] = ch; });
        setOtp(newOtp);
        // Focus the last filled input
        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[focusIdx]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');

        if (code.length < OTP_LENGTH) {
            setError(`Please enter all ${OTP_LENGTH} digits`);
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            if (mode === 'signup') {
                const email = getSignupEmail()!;
                const result = await verifySignupOtp({ email, otp_code: code });

                clearSignupEmail();

                // Log the teacher in with their tokens
                const teacher = profileToTeacher(result.teacher);
                
                if (teacher.approval_status === 'pending') {
                    setError('Your account is pending approval by an administrator. You cannot log in yet.');
                    setIsLoading(false);
                    return;
                }

                login(teacher, result.tokens);

                router.push('/');

            } else {
                // forgot-password mode
                const state = getForgotPasswordState()!;
                const result = await verifyForgotPasswordOtp({
                    email:    state.email,
                    otp_code: code,
                });

                // Store the reset_token for the reset-password page
                saveForgotPasswordResetToken(result.reset_token);

                router.push('/auth/reset-password');
            }
        } catch (err) {
            if (err instanceof ApiError) {
                const errData = err.data as Record<string, string[]> | null;
                if (errData?.otp_code) {
                    setError(errData.otp_code[0]);
                } else {
                    setError(err.message);
                }
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setResendMessage(null);
        setIsResending(true);

        try {
            if (mode === 'signup') {
                // We don't have the original signup payload, so just inform user
                setResendMessage('Please go back and re-submit your sign-up form to get a new OTP.');
            } else {
                const state = getForgotPasswordState();
                if (!state?.email) {
                    router.replace('/auth/forgot-password');
                    return;
                }
                await forgotPasswordRequest({ email: state.email });
                setResendMessage('A new OTP has been sent to your email.');
                setOtp(Array(OTP_LENGTH).fill(''));
                inputRefs.current[0]?.focus();
            }
        } catch {
            setResendMessage('Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const modeLabel = mode === 'signup' ? 'Sign Up' : 'Password Reset';
    const emailHint =
        mode === 'signup'
            ? getSignupEmail()
            : getForgotPasswordState()?.email;

    return (
        <div className="flex flex-col w-full text-primary-text">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-heading text-primary-text mb-1">
                    Verify Email
                </h2>
                <p className="text-sm text-slate-500">
                    {modeLabel} — enter the {OTP_LENGTH}-digit code sent to
                </p>
                {emailHint && (
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">
                        {emailHint}
                    </p>
                )}
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
                <div className="flex justify-center gap-2 w-full my-2">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            id={`otp-digit-${idx}`}
                            ref={(el) => { inputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            onPaste={idx === 0 ? handlePaste : undefined}
                            className="w-11 h-12 text-center text-lg font-bold border border-slate-250 bg-white rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-all"
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-xs text-rose-500 font-medium text-center -mt-2">{error}</p>
                )}

                {resendMessage && (
                    <p className="text-xs text-emerald-600 font-medium text-center -mt-2">{resendMessage}</p>
                )}

                <Button
                    id="otp-verify-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold cursor-pointer transition shadow-lg shadow-orange-500/10 disabled:opacity-70"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Verifying…
                        </span>
                    ) : 'Verify'}
                </Button>
            </form>

            {/* Resend */}
            <div className="text-center mt-6 text-xs text-slate-500">
                Didn&apos;t get the code?{' '}
                <button
                    id="otp-resend"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-[#3B82F6] font-bold hover:underline bg-transparent border-0 cursor-pointer p-0 disabled:opacity-60"
                >
                    {isResending ? 'Sending…' : 'Resend'}
                </button>
            </div>
        </div>
    )
}

export default VerifyOtpPage