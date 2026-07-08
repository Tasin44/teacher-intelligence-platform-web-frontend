"use client"
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, TResetPasswordInput } from '@/validation/auth.validation'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { resetPasswordRequest } from '@/lib/api/auth.api'
import { ApiError } from '@/lib/api/client'
import { getForgotPasswordState, clearForgotPasswordState } from '@/lib/auth/session'

const ResetPasswordPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [resetToken, setResetToken] = useState<number | null>(null);

    // On mount: verify required session state exists
    useEffect(() => {
        const state = getForgotPasswordState();
        if (!state?.reset_token) {
            // reset_token is not set — redirect back to forgot-password
            router.replace('/auth/forgot-password');
            return;
        }
        setResetToken(state.reset_token);
    }, [router]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            new_password:     '',
            confirm_password: ''
        }
    });

    const onSubmit = async (data: TResetPasswordInput) => {
        if (!resetToken) return;

        setApiError(null);
        setIsLoading(true);

        try {
            await resetPasswordRequest({
                reset_token:      resetToken,
                new_password:     data.new_password,
                confirm_password: data.confirm_password,
            });

            // Clear the forgot-password session state — flow complete
            clearForgotPasswordState();

            // Redirect to sign-in
            router.push('/auth/sign-in');
        } catch (err) {
            if (err instanceof ApiError) {
                const errData = err.data as Record<string, string[]> | null;
                if (errData?.reset_token) {
                    // Token expired — send user back through the full forgot-password flow
                    setApiError('Your reset link has expired. Please start the forgot-password process again.');
                } else if (errData?.confirm_password) {
                    setApiError(errData.confirm_password[0]);
                } else {
                    setApiError(err.message);
                }
            } else {
                setApiError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full text-primary-text">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-heading text-primary-text mb-1">
                    Reset Password
                </h2>
                <p className="text-sm text-slate-500">
                    Choose a new password for your account
                </p>
            </div>

            {/* Global API error */}
            {apiError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
                    {apiError}
                    {apiError.includes('expired') && (
                        <button
                            onClick={() => {
                                clearForgotPasswordState();
                                router.push('/auth/forgot-password');
                            }}
                            className="block mt-1 underline text-rose-600 bg-transparent border-0 cursor-pointer p-0 text-sm"
                        >
                            Start again →
                        </button>
                    )}
                </div>
            )}

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2 relative">
                    <Label className="text-xs font-bold text-slate-600">New Password</Label>
                    <div className="relative">
                        <Input
                            id="reset-new-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min 8 chars, letter + number"
                            className="bg-white border-slate-200/80 rounded-xl h-11 pr-10"
                            {...register('new_password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.new_password && (
                        <p className="text-xs text-rose-500 font-medium">{errors.new_password.message}</p>
                    )}
                </div>

                <div className="space-y-2 relative">
                    <Label className="text-xs font-bold text-slate-600">Confirm New Password</Label>
                    <div className="relative">
                        <Input
                            id="reset-confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-enter new password"
                            className="bg-white border-slate-200/80 rounded-xl h-11 pr-10"
                            {...register('confirm_password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.confirm_password && (
                        <p className="text-xs text-rose-500 font-medium">{errors.confirm_password.message}</p>
                    )}
                </div>

                <Button
                    id="reset-password-submit"
                    type="submit"
                    disabled={isLoading || !resetToken}
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold mt-2 cursor-pointer transition shadow-lg shadow-orange-500/10 disabled:opacity-70"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Resetting…
                        </span>
                    ) : 'Confirm'}
                </Button>
            </form>
        </div>
    )
}

export default ResetPasswordPage