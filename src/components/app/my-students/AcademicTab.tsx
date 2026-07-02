"use client";
import React, { useState } from 'react';
import { UserCheck, Edit2, Trash2 } from 'lucide-react';
import { Student, AcademicRecord } from '@/types';
import { Button } from '@/components/ui/button';
import Card from '@/components/shared/Card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const academicRecordSchema = z.object({
    subject: z.string().min(1, 'Subject is required'),
    testName: z.string().min(1, 'Test name is required'),
    score: z.number().min(0, 'Score must be at least 0').max(100, 'Score cannot exceed 100'),
    academicDate: z.string().min(1, 'Date is required'),
    standards: z.string().min(1, 'At least one standard is required'),
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
    academicRecords,
    onAddAcademicRecord,
    onUpdateAcademicRecord,
    onDeleteAcademicRecord,
    onSuccess
}: AcademicTabProps) => {
    const [editingAcademicId, setEditingAcademicId] = useState<string | null>(null);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TAcademicRecordInput>({
        resolver: zodResolver(academicRecordSchema),
        defaultValues: {
            subject: 'Math',
            testName: '',
            score: 80,
            academicDate: '2026-06-15',
            standards: 'CCSS.Math.3.NF.A.1'
        }
    });

    const subjectValue = watch('subject');
    const isReading = subjectValue?.trim().toLowerCase() === 'reading';

    const handleTriggerEditAcademic = (record: AcademicRecord) => {
        setEditingAcademicId(record.id);
        reset({
            subject: record.subject,
            testName: record.testName,
            score: record.score,
            academicDate: record.date,
            standards: record.standards.join(', ')
        });

        // Scroll to form smoothly
        const element = document.getElementById('academic-form-heading');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    const handleCancelAcademicEdit = () => {
        setEditingAcademicId(null);
        reset({
            subject: 'Math',
            testName: '',
            score: 80,
            academicDate: '2026-06-15',
            standards: 'CCSS.Math.3.NF.A.1'
        });
    };

    const onSubmit = (data: TAcademicRecordInput) => {
        const isReadingSub = data.subject.trim().toLowerCase() === 'reading';
        if (editingAcademicId) {
            if (onUpdateAcademicRecord) {
                onUpdateAcademicRecord({
                    id: editingAcademicId,
                    studentId: currentStudent.id,
                    subject: data.subject,
                    testName: data.testName,
                    score: data.score,
                    date: data.academicDate,
                    standards: data.standards.split(',').map((s) => s.trim()).filter(Boolean)
                });
            }
            setEditingAcademicId(null);
            onSuccess(`Academic assessment record updated for ${currentStudent.name}!`);
        } else {
            onAddAcademicRecord({
                studentId: currentStudent.id,
                subject: data.subject,
                testName: data.testName,
                score: data.score,
                date: data.academicDate,
                standards: data.standards.split(',').map((s) => s.trim()).filter(Boolean)
            });
            onSuccess(`Successfully saved test score of ${data.score}% for ${currentStudent.name}!`);
        }

        // Reset fields
        reset({
            subject: 'Math',
            testName: '',
            score: 80,
            academicDate: '2026-06-15',
            standards: 'CCSS.Math.3.NF.A.1'
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn w-full max-w-full overflow-hidden">
            {/* Form */}
            <Card title={`${editingAcademicId ? "Edit Academic Assessment Record" : "Post New Test or Assignment Grade"}`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">Subject</label>
                            <input
                                type="text"
                                placeholder="e.g. Math"
                                {...register('subject')}
                                className={`bg-[#0F1117] border ${errors.subject ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition`}
                            />
                            {errors.subject && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.subject.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">Test / Assignment Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Multiplication Fact Check 4"
                                {...register('testName')}
                                className={`bg-[#0F1117] border ${errors.testName ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition`}
                            />
                            {errors.testName && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.testName.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">Score / 100</label>
                            <input
                                type="number"
                                max="100"
                                min="0"
                                {...register('score', { valueAsNumber: true })}
                                className={`bg-[#0F1117] border ${errors.score ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition`}
                            />
                            {errors.score && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.score.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">Assessment Date</label>
                            <input
                                type="date"
                                {...register('academicDate')}
                                className={`bg-[#0F1117] border ${errors.academicDate ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none transition`}
                            />
                            {errors.academicDate && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.academicDate.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400">CCSS Standard Code</label>
                            <input
                                type="text"
                                placeholder="e.g. CCSS.Math.3.OA.A.1"
                                {...register('standards')}
                                className={`bg-[#0F1117] border ${errors.standards ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#2A2D3A] focus:border-orange-500'} rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition`}
                            />
                            {errors.standards && (
                                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.standards.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row justify-end gap-3">
                        {editingAcademicId && (
                            <button
                                type="button"
                                onClick={handleCancelAcademicEdit}
                                className="w-full sm:w-auto bg-[#2A2D3A] text-slate-300 font-semibold px-4 py-2 rounded-lg text-xs hover:bg-[#323647] inline-flex items-center justify-center gap-1.5 cursor-pointer border-0"
                            >
                                Cancel Edit
                            </button>
                        )}
                        <Button type="submit" className="w-full sm:w-auto">
                            <UserCheck size={14} />
                            {editingAcademicId ? 'Save Assessment Changes' : 'Record Assessment'}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Assessment History Table */}
            <Card title={`Recorded Assessments ${currentStudent.name}`}>
                <div className="overflow-x-auto w-full max-w-full">
                    <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
                        <thead>
                            <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                                <th className="pb-2 pr-4 whitespace-nowrap">Subject</th>
                                <th className="pb-2 px-4 whitespace-nowrap">Test / Milestone</th>
                                <th className="pb-2 px-4 whitespace-nowrap">Score</th>
                                <th className="pb-2 px-4 whitespace-nowrap">Standard</th>
                                <th className="pb-2 px-4 whitespace-nowrap">Date</th>
                                <th className="pb-2 px-4 text-center whitespace-nowrap">Status</th>
                                <th className="pb-2 pl-4 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2D3A]/65">
                            {academicRecords.length > 0 ? (
                                academicRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-800/15 transition">
                                        <td className="py-3 pr-4 font-semibold text-orange-400 whitespace-nowrap">{record.subject}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap">{record.testName}</td>
                                        <td className="py-3 px-4 font-bold text-slate-100 whitespace-nowrap">{record.score}%</td>
                                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">{record.standards.join(', ')}</td>
                                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{record.date}</td>
                                        <td className="py-3 px-4 text-center whitespace-nowrap">
                                            {record.score >= 60 ? (
                                                <span className="bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                                    Pass
                                                </span>
                                            ) : (
                                                <span className="bg-rose-500/15 text-rose-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                                                    Fail
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 pl-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2.5 text-slate-400">
                                                <button
                                                    onClick={() => handleTriggerEditAcademic(record)}
                                                    className="hover:text-orange-500 cursor-pointer bg-transparent border-0 p-0"
                                                    title="Edit Assessment Record"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteAcademicRecord(record.id)}
                                                    className="hover:text-rose-500 cursor-pointer bg-transparent border-0 p-0"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center text-slate-500 py-6">
                                        No customized academic records filed for {currentStudent.name}. Post one above!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AcademicTab;