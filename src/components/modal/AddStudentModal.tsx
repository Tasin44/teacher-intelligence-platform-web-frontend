"use client";

import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, TStudentInput } from '@/validation/student.validation';

export default function AddStudentModal() {
    const { isAddStudentOpen, setIsAddStudentOpen, addStudent } = useEduPulse();
    const router = useRouter();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TStudentInput>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: '',
            rollNo: '',
            grade: 'Grade 4',
            riskLevel: 'On Track',
            readingLevel: '4A',
            parentName: '',
            parentEmail: ''
        }
    });

    // Reset form when modal state changes to open
    useEffect(() => {
        if (isAddStudentOpen) {
            reset({
                name: '',
                rollNo: '',
                grade: 'Grade 4',
                riskLevel: 'On Track',
                readingLevel: '4A',
                parentName: '',
                parentEmail: ''
            });
            setAvatarPreview(null);
        }
    }, [isAddStudentOpen, reset]);

    if (!isAddStudentOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setAvatarPreview(null);
    };

    const onSubmit = (data: TStudentInput) => {
        addStudent({
            name: data.name,
            grade: data.grade,
            riskLevel: data.riskLevel,
            readingLevel: data.readingLevel,
            parentName: data.parentName || '',
            parentEmail: data.parentEmail || '',
            avatar: avatarPreview || undefined
        });

        setIsAddStudentOpen(false);

        // Route to input view to verify
        router.push('/students?subtab=input');
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-[#1E2130] border border-[#2A2D3A] rounded-xl w-full max-w-md shadow-2xl p-6 relative animate-slideUp"
            >
                {/* Modal X button */}
                <button
                    type="button"
                    onClick={() => setIsAddStudentOpen(false)}
                    className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-100 transition cursor-pointer bg-transparent border-0"
                >
                    <X size={18} />
                </button>

                <h3 className="text-base font-bold font-heading text-slate-200 mb-4 flex items-center gap-2">
                    <Plus size={18} strokeWidth={2.5} className="text-orange-500" />
                    Enroll New Student Profile
                </h3>

                <div className="space-y-4 text-xs">
                    {/* Avatar Upload Area */}
                    <div className="flex items-center gap-4 bg-[#0F1117]/40 p-3.5 rounded-xl border border-[#2A2D3A]/60 mb-2">
                        <div className="relative group shrink-0">
                            <div className="w-14 h-14 rounded-full overflow-hidden border border-[#2A2D3A] bg-[#0F1117] flex items-center justify-center transition-all duration-300 group-hover:border-orange-500 shadow-inner">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover animate-fadeIn" />
                                ) : (
                                    <div className="text-slate-500 group-hover:text-slate-400 transition-colors flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            {/* Upload overlay on hover */}
                            <label className="absolute inset-0 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-slate-200 font-bold transition-opacity duration-200 cursor-pointer">
                                <span>Choose</span>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageChange} 
                                />
                            </label>
                        </div>
                        
                        <div className="flex flex-col gap-1.5 text-left">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Profile Photo</span>
                            <div className="flex gap-2">
                                <label className="bg-[#1E2130] hover:bg-slate-800 text-slate-300 hover:text-slate-100 px-3 py-1.5 rounded-md text-[10px] font-bold border border-[#2A2D3A] transition cursor-pointer flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                    Upload Photo
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageChange} 
                                    />
                                </label>
                                
                                {avatarPreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-md text-[10px] font-bold border border-rose-500/20 transition cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Student Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Alisha Patel"
                                {...register('name')}
                                className={`bg-[#0F1117] border ${errors.name ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none`}
                            />
                            {errors.name && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Student Roll No</label>
                            <input
                                type="text"
                                placeholder="e.g. 12345"
                                {...register('rollNo')}
                                className={`bg-[#0F1117] border ${errors.rollNo ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none`}
                            />
                            {errors.rollNo && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.rollNo.message}</p>
                            )}
                        </div>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Target Grade</label>
                            <input
                                type="text"
                                placeholder="e.g. Grade 4"
                                {...register('grade')}
                                className={`bg-[#0F1117] border ${errors.grade ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none font-semibold`}
                            />
                            {errors.grade && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.grade.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Diagnostic Risk Tier</label>
                            <select
                                {...register('riskLevel')}
                                className={`bg-[#0F1117] border ${errors.riskLevel ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none font-semibold`}
                            >
                                <option value="On Track">On Track (Standard)</option>
                                <option value="At Risk">At Risk (Tier 2 Scaffolds)</option>
                                <option value="Advanced">Advanced (Enrichment)</option>
                                <option value="Developing">Developing (Approaching)</option>
                            </select>
                            {errors.riskLevel && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.riskLevel.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-400">Initial Reading Placement Code</label>
                        <input
                            type="text"
                            placeholder="e.g. 4M or 5A"
                            {...register('readingLevel')}
                            className={`bg-[#0F1117] border ${errors.readingLevel ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none font-mono`}
                        />
                        {errors.readingLevel && (
                            <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.readingLevel.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Parent Guardian Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Sandra Jenkins"
                                {...register('parentName')}
                                className={`bg-[#0F1117] border ${errors.parentName ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none`}
                            />
                            {errors.parentName && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.parentName.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Guardian Contact Email</label>
                            <input
                                type="text"
                                placeholder="guardian@example.com"
                                {...register('parentEmail')}
                                className={`bg-[#0F1117] border ${errors.parentEmail ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none`}
                            />
                            {errors.parentEmail && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.parentEmail.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-5 pt-4.5 border-t border-[#2A2D3A]/60 flex justify-end gap-3.5">
                    <button
                        type="button"
                        onClick={() => setIsAddStudentOpen(false)}
                        className="px-4 py-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-lg transition bg-transparent border-0 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <Button
                        type="submit"
                    >
                        Create Profile Record
                    </Button>
                </div>
            </form>
        </div>
    );
}