"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, TSignInInput } from '@/validation/auth.validation'
import { useRouter } from 'next/navigation'
import { useEduPulse } from '@/lib/context/EduPulseContext'
import { profileToTeacher } from '@/lib/context/EduPulseContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { loginRequest } from '@/lib/api/auth.api'
import { ApiError } from '@/lib/api/client'

const SignInPage = () => {
    const router = useRouter();
    const { login } = useEduPulse();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<TSignInInput>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: TSignInInput) => {
        setApiError(null);
        setIsLoading(true);

        try {
            const result = await loginRequest({
                email:    data.email,
                password: data.password,
            });

            // Map backend teacher → local Teacher shape and save tokens
            const teacher = profileToTeacher(result.teacher);
            
            if (teacher.approval_status === 'pending') {
                setApiError('Your account is pending approval by an administrator.');
                setIsLoading(false);
                return;
            }

            login(teacher, result.tokens);

            router.push('/');
        } catch (err) {
            if (err instanceof ApiError) {
                // Backend sends non_field_errors as the key for general login failures
                const errData = err.data as Record<string, string[]> | null;
                if (errData?.non_field_errors) {
                    setApiError(errData.non_field_errors[0]);
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
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-heading text-primary-text mb-1">
                    Welcome Back
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                    Sign in to your account
                </p>
            </div>

            {/* Global API error */}
            {apiError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
                    {apiError}
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600">Email</Label>
                    <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        className="bg-white border-slate-200/80 rounded-xl h-11"
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2 relative">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-slate-600">Password</Label>
                    </div>
                    <div className="relative">
                        <Input
                            id="signin-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="bg-white border-slate-200/80 rounded-xl h-11 pr-10"
                            {...register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
                    )}
                </div>

                <div className="flex justify-end mt-1">
                    <Link
                        href="/auth/forgot-password"
                        className="text-xs font-bold text-accent-orange hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button
                    id="signin-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold cursor-pointer transition shadow-lg shadow-orange-500/10 disabled:opacity-70"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Signing in…
                        </span>
                    ) : 'Login'}
                </Button>
            </form>

            {/* Link to Register */}
            <div className="text-center mt-6">
                <p className="text-xs text-slate-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/sign-up" className="text-accent-orange font-bold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignInPage