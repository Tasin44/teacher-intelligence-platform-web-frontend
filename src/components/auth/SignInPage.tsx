"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, TSignInInput } from '@/validation/auth.validation'
import { useRouter } from 'next/navigation'
import { useEduPulse } from '@/lib/context/EduPulseContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import TeacherLoginCard from './TeacherLoginCard'

const SignInPage = () => {
    const router = useRouter();
    const { login } = useEduPulse();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<TSignInInput>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = (data: TSignInInput) => {
        // Fallback login
        login({
            name: 'Ms. Johnson',
            email: data.email,
            school: 'Oakwood Elementary School',
            grade: 'Grade 4',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        });
        router.push('/');
    };

    const handleInstantLogin = (grade: string) => {
        login({
            name: 'Ms. Johnson',
            email: `johnson.${grade.toLowerCase().replace(' ', '')}@oakwood.edu`,
            school: 'Oakwood Elementary School',
            grade: grade,
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
                    Sign in on your account
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600">Email</Label>
                    <Input
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
                    type="submit"
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold cursor-pointer transition shadow-lg shadow-orange-500/10"
                >
                    Login
                </Button>
            </form>

            {/* Instant Login Options */}
            <div className="mt-8 flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-4">
                    Instant Active Classrooms
                </span>

                <div className="grid grid-cols-2 gap-4 w-full">
                    {/* Option 1: Grade 4 */}
                    <TeacherLoginCard
                        name="Ms. Johnson"
                        grade="Grade 4"
                        school="Oakwood"
                        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                        onClick={() => handleInstantLogin('Grade 4')}
                    />

                    {/* Option 2: Grade 5 */}
                    <TeacherLoginCard
                        name="Ms. Johnson"
                        grade="Grade 5"
                        school="Oakwood"
                        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                        onClick={() => handleInstantLogin('Grade 5')}
                    />
                </div>
            </div>

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