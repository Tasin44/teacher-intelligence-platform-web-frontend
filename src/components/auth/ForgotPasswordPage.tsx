"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, TForgotPasswordInput } from '@/validation/auth.validation'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const ForgotPasswordPage = () => {
    const router = useRouter();

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

    const onSubmit = (data: TForgotPasswordInput) => {
        // Send OTP call simulated, push to Verify OTP screen
        router.push('/auth/verify-otp');
    };

    return (
        <div className="flex flex-col w-full text-primary-text">
            {/* Header Title inside card */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-heading text-primary-text mb-1">
                    Forgot Password
                </h2>
            </div>

            {/* Forgot Password Form */}
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

                <Button
                    type="submit"
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold mt-2 cursor-pointer transition shadow-lg shadow-orange-500/10"
                >
                    Send OTP
                </Button>
            </form>

            {/* Back to Sign In Link */}
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