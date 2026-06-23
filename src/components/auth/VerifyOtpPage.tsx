"use client"
import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const VerifyOtpPage = () => {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(['1', '', '', '', '']); // Matches screenshot (first input has 1, others empty)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Only keep the last character
        setOtp(newOtp);
        setError(null);

        // Move focus to next input if character entered
        if (value && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move focus to previous input on Backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 5) {
            setError('Please enter all 5 digits');
            return;
        }
        
        // Simulating verification success and pushing to Reset Password
        router.push('/auth/reset-password');
    };

    return (
        <div className="flex flex-col w-full text-primary-text font-sans">
            {/* Header Title inside card */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-heading text-primary-text mb-1">
                    Verify Email
                </h2>
            </div>

            {/* OTP Input Fields Form */}
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
                <div className="flex justify-center gap-3 w-full max-w-xs my-2">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => {
                                inputRefs.current[idx] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className="w-12 h-12 text-center text-lg font-bold border border-slate-250 bg-white rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-all"
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-xs text-rose-500 font-medium text-center">{error}</p>
                )}

                <Button
                    type="submit"
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold cursor-pointer transition shadow-lg shadow-orange-500/10"
                >
                    Verify
                </Button>
            </form>

            {/* Resend Link Section */}
            <div className="text-center mt-6 text-xs text-slate-500">
                Don&apos;t get the code?{' '}
                <button
                    onClick={() => alert('OTP code has been resent!')}
                    className="text-[#3B82F6] font-bold hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                    Resend
                </button>
            </div>
        </div>
    )
}

export default VerifyOtpPage