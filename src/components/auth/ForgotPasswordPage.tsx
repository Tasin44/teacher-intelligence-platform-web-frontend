"use client"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, TForgotPasswordInput } from '@/validation/auth.validation'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { forgotPasswordRequest } from '@/lib/api/auth.api'
import { ApiError } from '@/lib/api/client'
import { saveForgotPasswordEmail } from '@/lib/auth/session'

const ForgotPasswordPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = async (data: TForgotPasswordInput) => {
        setApiError(null);
        setIsLoading(true);

        try {
            // Backend always returns 200 even if the email doesn't exist
            // (prevents account enumeration) — we still proceed to verify step
            await forgotPasswordRequest({ email: data.email });

            // Save email in sessionStorage for the verify-otp and reset-password pages
            saveForgotPasswordEmail(data.email);

            router.push('/auth/verify-otp?mode=forgot-password');
        } catch (err) {
            if (err instanceof ApiError) {
                setApiError(err.message);
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
                    Forgot Password
                </h2>
                <p className="text-sm text-slate-500">
                    Enter your email and we&apos;ll send you a 6-digit OTP
                </p>
            </div>

            {/* Global API error */}
            {apiError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
                    {apiError}
                </div>
            )}

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600">Email</Label>
                    <Input
                        id="forgot-password-email"
                        type="email"
                        placeholder="Enter your registered email"
                        className="bg-white border-slate-200/80 rounded-xl h-11"
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
                    )}
                </div>

                <Button
                    id="forgot-password-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold mt-2 cursor-pointer transition shadow-lg shadow-orange-500/10 disabled:opacity-70"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Sending OTP…
                        </span>
                    ) : 'Send OTP'}
                </Button>
            </form>

            {/* Back to Sign In */}
            <div className="text-center mt-6">
                <Link
                    href="/auth/sign-in"
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 hover:underline"
                >
                    Back to Sign In
                </Link>
            </div>
        </div>
    )
}

export default ForgotPasswordPage