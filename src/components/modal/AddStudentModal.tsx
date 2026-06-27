"use client";

import React, { useEffect } from 'react';
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

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<TStudentInput>({
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
        }
    }, [isAddStudentOpen, reset]);

    if (!isAddStudentOpen) return null;

    const onSubmit = (data: TStudentInput) => {
        addStudent({
            name: data.name,
            grade: data.grade,
            riskLevel: data.riskLevel,
            readingLevel: data.readingLevel,
            parentName: data.parentName || '',
            parentEmail: data.parentEmail || ''
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