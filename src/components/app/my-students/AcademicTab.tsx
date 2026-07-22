"use client";
import React, { useState, useEffect } from 'react';
import { UserCheck, Edit2, Loader2, AlertCircle } from 'lucide-react';
import { Student, AcademicRecord } from '@/types';
import { Button } from '@/components/ui/button';
import Card from '@/components/shared/Card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createFeedback, getFeedback, ApiFeedback } from '@/lib/api/feedback.api';

const academicRecordSchema = z.object({
    subject: z.string().min(1, 'Subject is required'),
    testName: z.string().min(1, 'Test name is required'),
    score: z.number().min(0).max(100),
    academicDate: z.string().min(1, 'Date is required'),
    standards: z.string().min(1, 'CCSS code is required'),
    teacherNotes: z.string().optional(),
});

type TAcademicRecordInput = z.infer<typeof academicRecordSchema>;

interface AcademicTabProps {
    currentStudent: Student;
    academicRecords: AcademicRecord[];
    onAddAcademicRecord: (record: Omit<AcademicRecord, 'id'>) => void;
    onUpdateAcademicRecord?: (record: AcademicRecord) => void;
    onDeleteAcademicRecord: (id: string) => void;
    onSuccess: (message: string) => void;
}

const AcademicTab = ({
    currentStudent,
    onSuccess
}: AcademicTabProps) => {
    const [apiFeedback, setApiFeedback] = useState<ApiFeedback[]>([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TAcademicRecordInput>({
        resolver: zodResolver(academicRecordSchema),
        defaultValues: {
            subject: 'Math',
            testName: '',
            score: 80,
            academicDate: new Date().toISOString().split('T')[0],
            standards: 'CCSS.Math.3.NF.A.1',
            teacherNotes: ''
        }
    });

    const loadFeedback = async () => {
        setIsLoadingRecords(true);
        try {
            const data = await getFeedback(currentStudent.student_roll);
            setApiFeedback(data.results);
        } catch {
            // silently fail — may not have records yet
        } finally {
            setIsLoadingRecords(false);
        }
    };

    useEffect(() => {
        loadFeedback();
    }, [currentStudent.id]);

    const onSubmit = async (data: TAcademicRecordInput) => {
        if (!currentStudent.student_roll) {
            setApiError('Student roll number is required. Please re-select the student.');
            return;
        }
        setIsSubmitting(true);
        setApiError(null);
        try {
            await createFeedback({
                student_roll: currentStudent.student_roll,
                subject: data.subject,
                title: data.testName,
                score: data.score,
                assessment_date: data.academicDate,
                teacher_notes: data.teacherNotes || '',
                areas_for_improvement: data.standards,
            });
            await loadFeedback();
            reset({ subject: 'Math', testName: '', score: 80, academicDate: new Date().toISOString().split('T')[0], standards: 'CCSS.Math.3.NF.A.1', teacherNotes: '' });
            onSuccess(`Successfully saved test score of ${data.score}% for ${currentStudent.name}!`);
        } catch (err: any) {
            setApiError(err.message || 'Failed to record assessment.');
            setTimeout(() => setApiError(null), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn w-full max-w-full overflow-hidden">
            {/* Error Toast */}
            {apiError && (
                <div className="fixed top-20 right-5 bg-rose-500 border border-rose-400 text-white font-extrabold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-[100] animate-bounce">
                    <AlertCircle size={18} strokeWidth={3} />
                    <span>{apiError}</span>
                </div>
            )}

            {/* Form */}
            <Card title="Post New Test or Assignment Grade">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">Subject</label>
                            <input
                                type="text"
                                placeholder="e.g. Math"
                                {...register('subject')}
                                className={`bg-[#0F1117] border ${errors.subject ? 'border-rose-500/80' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition`}
                            />
                            {errors.subject && <p className="text-[10px] text-rose-500 font-medium">{errors.subject.message}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">Test / Assignment Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Multiplication Fact Check 4"
                                {...register('testName')}
                                className={`bg-[#0F1117] border ${errors.testName ? 'border-rose-500/80' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition`}
                            />
                            {errors.testName && <p className="text-[10px] text-rose-500 font-medium">{errors.testName.message}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">Score / 100</label>
                            <input
                                type="number" max="100" min="0"
                                {...register('score', { valueAsNumber: true })}
                                className={`bg-[#0F1117] border ${errors.score ? 'border-rose-500/80' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition`}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">Assessment Date</label>
                            <input
                                type="date"
                                {...register('academicDate')}
                                className={`bg-[#0F1117] border ${errors.academicDate ? 'border-rose-500/80' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none transition`}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">CCSS Standard Code</label>
                            <input
                                type="text"
                                placeholder="e.g. CCSS.Math.3.OA.A.1"
                                {...register('standards')}
                                className={`bg-[#0F1117] border ${errors.standards ? 'border-rose-500/80' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition`}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">Teacher Notes (optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Struggled with time"
                                {...register('teacherNotes')}
                                className="bg-[#0F1117] border border-[#2A2D3A] focus:border-orange-500 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                            {isSubmitting ? 'Recording...' : 'Record Assessment'}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Assessment History Table */}
            <Card title={`Recorded Assessments — ${currentStudent.name}`}>
                {isLoadingRecords ? (
                    <div className="flex items-center justify-center py-8 text-slate-400 text-xs gap-2">
                        <Loader2 size={16} className="animate-spin" /> Loading records...
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full max-w-full">
                        <table className="w-full text-left text-xs text-slate-300 min-w-[600px]">
                            <thead>
                                <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                                    <th className="pb-2 pr-4">Subject</th>
                                    <th className="pb-2 px-4">Title</th>
                                    <th className="pb-2 px-4">Score</th>
                                    <th className="pb-2 px-4">Date</th>
                                    <th className="pb-2 px-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2D3A]/65">
                                {apiFeedback.length > 0 ? (
                                    apiFeedback.map((record) => (
                                        <tr key={record.feedback_id} className="hover:bg-slate-800/15 transition">
                                            <td className="py-3 pr-4 font-semibold text-orange-400 whitespace-nowrap">{record.subject}</td>
                                            <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap">{record.title}</td>
                                            <td className="py-3 px-4 font-bold text-slate-100 whitespace-nowrap">{parseFloat(record.score).toFixed(1)}%</td>
                                            <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{record.assessment_date}</td>
                                            <td className="py-3 px-4 text-center whitespace-nowrap">
                                                {parseFloat(record.score) >= 60 ? (
                                                    <span className="bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Pass</span>
                                                ) : (
                                                    <span className="bg-rose-500/15 text-rose-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse">Fail</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center text-slate-500 py-6">
                                            No academic records filed for {currentStudent.name}. Post one above!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AcademicTab;