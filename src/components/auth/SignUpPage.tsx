"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, TSignUpInput } from '@/validation/auth.validation'
import { useRouter } from 'next/navigation'
import { useEduPulse } from '@/lib/context/EduPulseContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const SignUpPage = () => {
    const router = useRouter();
    const { login } = useEduPulse();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TSignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            school: '',
            grade: '',
            classroom: 'Room 304-B',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = (data: TSignUpInput) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('edupulse_settings_classroom_no', data.classroom);
        }
        // Register & Log in the new teacher account
        login({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            school: data.school,
            grade: data.grade,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        });
        router.push('/');
    };

    return (
        <div className="flex flex-col w-full text-primary-text">
            {/* Header Title inside card */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-heading text-primary-text mb-1">
                    Welcome Back Ms. Johnson
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                    Sign up on your account
                </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Frist Name</Label>
                        <Input
                            type="text"
                            placeholder="Shipon"
                            className="bg-white border-slate-200/80 rounded-xl h-11"
                            {...register('firstName')}
                        />
                        {errors.firstName && (
                            <p className="text-[10px] text-rose-500 font-medium">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Last name</Label>
                        <Input
                            type="text"
                            placeholder="Shipon"
                            className="bg-white border-slate-200/80 rounded-xl h-11"
                            {...register('lastName')}
                        />
                        {errors.lastName && (
                            <p className="text-[10px] text-rose-500 font-medium">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Row 2: School/Campus */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">School/Campus</Label>
                    <Input
                        type="text"
                        placeholder="Oakwood Elementary School"
                        className="bg-white border-slate-200/80 rounded-xl h-11"
                        {...register('school')}
                    />
                    {errors.school && (
                        <p className="text-[10px] text-rose-500 font-medium">{errors.school.message}</p>
                    )}
                </div>

                {/* Row 3: Grade Assignment & Classroom Room# */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Grade Assignment</Label>
                        <Input
                            type="text"
                            placeholder="Grade 3/Grade 4/Grade 5..."
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
                            type="text"
                            placeholder="Room 304-B"
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
                        type="email"
                        placeholder="Enter your email"
                        className="bg-white border-slate-200/80 rounded-xl h-11"
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-[10px] text-rose-500 font-medium">{errors.email.message}</p>
                    )}
                </div>

                {/* Row 4: Password & Confirm Password */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 relative">
                        <Label className="text-xs font-bold text-slate-600">Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
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
                        <Label className="text-xs font-bold text-slate-600">Confirm Passwords</Label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
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

                {/* Submit button: text matches "Login" inside signup card screenshot */}
                <Button
                    type="submit"
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold mt-2 cursor-pointer transition shadow-lg shadow-orange-500/10"
                >
                    Register
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