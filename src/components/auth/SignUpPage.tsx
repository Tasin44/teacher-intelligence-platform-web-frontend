"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, TSignUpInput } from '@/validation/auth.validation'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { signupRequest } from '@/lib/api/auth.api'
import { ApiError } from '@/lib/api/client'
import { saveSignupEmail } from '@/lib/auth/session'

const SignUpPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<TSignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName:       '',
            lastName:        '',
            grade:           '',
            classroom:       '',
            email:           '',
            password:        '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: TSignUpInput) => {
        setApiError(null);
        setIsLoading(true);

        try {
            await signupRequest({
                first_name: data.firstName,
                last_name:  data.lastName,
                // TODO: replace with a real school selector once the API
                // endpoint for listing schools is available.
                school_id:  1,
                grade:      data.grade,
                room:       data.classroom,
                email:      data.email,
                password:   data.password,
            });

            // Save email in sessionStorage so verify-otp page can use it
            saveSignupEmail(data.email);

            // Navigate to OTP verification in signup mode
            router.push('/auth/verify-otp?mode=signup');
        } catch (err) {
            if (err instanceof ApiError) {
                const errData = err.data as Record<string, string[]> | null;
                if (errData?.email) {
                    setApiError(errData.email[0]);
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
                    Create Account
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                    Sign up as a teacher
                </p>
            </div>

            {/* Global API error */}
            {apiError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
                    {apiError}
                </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">First Name</Label>
                        <Input
                            id="signup-first-name"
                            type="text"
                            placeholder="John"
                            className="bg-white border-slate-200/80 rounded-xl h-11"
                            {...register('firstName')}
                        />
                        {errors.firstName && (
                            <p className="text-[10px] text-rose-500 font-medium">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Last Name</Label>
                        <Input
                            id="signup-last-name"
                            type="text"
                            placeholder="Doe"
                            className="bg-white border-slate-200/80 rounded-xl h-11"
                            {...register('lastName')}
                        />
                        {errors.lastName && (
                            <p className="text-[10px] text-rose-500 font-medium">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Row 2: Grade Assignment & Classroom */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Grade Assignment</Label>
                        <Input
                            id="signup-grade"
                            type="text"
                            placeholder="10th Grade"
                            className="bg-white border-slate-200/80 rounded-xl h-11"
                            {...register('grade')}
                        />
                        {errors.grade && (
                            <p className="text-[10px] text-rose-500 font-medium">{errors.grade.message}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Classroom Room#</Label>
                        <Input
                            id="signup-classroom"
                            type="text"
                            placeholder="Room 101"
                            className="bg-white border-slate-200/80 rounded-xl h-11"
                            {...register('classroom')}
                        />
                        {errors.classroom && (
                            <p className="text-[10px] text-rose-500 font-medium">{errors.classroom.message}</p>
                        )}
                    </div>
                </div>

                {/* Row 3: Professional Email */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Professional Email Address</Label>
                    <Input
                        id="signup-email"
                        type="email"
                        placeholder="teacher@school.edu"
                        className="bg-white border-slate-200/80 rounded-xl h-11"
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-[10px] text-rose-500 font-medium">{errors.email.message}</p>
                    )}
                </div>

                {/* Row 4: Password & Confirm Password */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 relative">
                        <Label className="text-xs font-bold text-slate-600">Password</Label>
                        <div className="relative">
                            <Input
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min 8 chars, letter + number"
                                className="bg-white border-slate-200/80 rounded-xl h-11 pr-9"
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 top-3.5 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0"
                            >
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-[10px] text-rose-500 font-medium">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="space-y-1.5 relative">
                        <Label className="text-xs font-bold text-slate-600">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="signup-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Re-enter password"
                                className="bg-white border-slate-200/80 rounded-xl h-11 pr-9"
                                {...register('confirmPassword')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2.5 top-3.5 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0"
                            >
                                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-[10px] text-rose-500 font-medium">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <Button
                    id="signup-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold mt-2 cursor-pointer transition shadow-lg shadow-orange-500/10 disabled:opacity-70"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Sending OTP…
                        </span>
                    ) : 'Register'}
                </Button>
            </form>

            {/* Link to Login */}
            <div className="text-center mt-6">
                <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <Link href="/auth/sign-in" className="text-accent-orange font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignUpPage