"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, TResetPasswordInput } from '@/validation/auth.validation'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

const ResetPasswordPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = (data: TResetPasswordInput) => {
        // Password update simulated successfully, return user to sign-in page
        alert('Password has been reset successfully!');
        router.push('/auth/sign-in');
    };

    return (
        <div className="flex flex-col w-full text-primary-text font-sans">
            {/* Header Title inside card */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-heading text-primary-text mb-1">
                    Reset Password
                </h2>
            </div>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2 relative">
                    <Label className="text-xs font-bold text-slate-600">New Password</Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create new password"
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

                <div className="space-y-2 relative">
                    <Label className="text-xs font-bold text-slate-600">Re-enter new password</Label>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-enter new password"
                            className="bg-white border-slate-200/80 rounded-xl h-11 pr-10"
                            {...register('confirmPassword')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold mt-2 cursor-pointer transition shadow-lg shadow-orange-500/10"
                >
                    Confirm
                </Button>
            </form>
        </div>
    )
}

export default ResetPasswordPage