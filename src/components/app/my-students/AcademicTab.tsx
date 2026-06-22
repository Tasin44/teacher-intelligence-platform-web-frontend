"use client";

import React, { useState } from 'react';
import { UserCheck, Edit2, Trash2 } from 'lucide-react';
import { Student, AcademicRecord } from '@/types';
import { Button } from '@/components/ui/button';
import Card from '@/components/shared/Card';

interface AcademicTabProps {
    currentStudent: Student;
    academicRecords: AcademicRecord[];
    onAddAcademicRecord: (record: Omit<AcademicRecord, 'id'>) => void;
    onUpdateAcademicRecord?: (record: AcademicRecord) => void;
    onDeleteAcademicRecord: (id: string) => void;
    onSuccess: (message: string) => void;
}

export default function AcademicTab({
    currentStudent,
    academicRecords,
    onAddAcademicRecord,
    onUpdateAcademicRecord,
    onDeleteAcademicRecord,
    onSuccess
}: AcademicTabProps) {
    // Academic Form States
    const [editingAcademicId, setEditingAcademicId] = useState<string | null>(null);
    const [subject, setSubject] = useState<'Math' | 'Reading' | 'Science' | 'Social Studies' | 'Writing'>('Math');
    const [testName, setTestName] = useState('');
    const [score, setScore] = useState<number>(80);
    const [academicDate, setAcademicDate] = useState('2026-06-15');
    const [readingLevel, setReadingLevel] = useState('4A');
    const [standards, setStandards] = useState('CCSS.Math.3.NF.A.1');

    const handleTriggerEditAcademic = (record: AcademicRecord) => {
        setSubject(record.subject);
        setTestName(record.testName);
        setScore(record.score);
        setAcademicDate(record.date);
        setReadingLevel(record.readingLevel || '4A');
        setStandards(record.standards.join(', '));
        setEditingAcademicId(record.id);

        // Scroll to form smoothly
        const element = document.getElementById('academic-form-heading');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    const handleCancelAcademicEdit = () => {
        setEditingAcademicId(null);
        setTestName('');
        setScore(80);
        setAcademicDate('2026-06-15');
        setReadingLevel('4A');
        setStandards('CCSS.Math.3.NF.A.1');
    };

    const handleSaveAcademic = () => {
        if (!testName) return;
        if (editingAcademicId) {
            if (onUpdateAcademicRecord) {
                onUpdateAcademicRecord({
                    id: editingAcademicId,
                    studentId: currentStudent.id,
                    subject,
                    testName,
                    score,
                    date: academicDate,
                    readingLevel: subject === 'Reading' ? readingLevel : undefined,
                    standards: standards.split(',').map((s) => s.trim()).filter(Boolean)
                });
            }
            setEditingAcademicId(null);
            onSuccess(`Academic assessment record updated for ${currentStudent.name}!`);
        } else {
            onAddAcademicRecord({
                studentId: currentStudent.id,
                subject,
                testName,
                score,
                date: academicDate,
                readingLevel: subject === 'Reading' ? readingLevel : undefined,
                standards: [standards]
            });
            onSuccess(`Successfully saved test score of ${score}% for ${currentStudent.name}!`);
        }
        setTestName('');
        setScore(80);
        setAcademicDate('2026-06-15');
        setReadingLevel('4A');
        setStandards('CCSS.Math.3.NF.A.1');
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Form */}
            <Card title={`${editingAcademicId ? "Edit Academic Assessment Record" : "Post New Test or Assignment Grade"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Subject dropdown */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Subject</label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value as any)}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                        >
                            <option value="Math">Math</option>
                            <option value="Reading">Reading</option>
                            <option value="Science">Science</option>
                            <option value="Social Studies">Social Studies</option>
                            <option value="Writing">Writing</option>
                        </select>
                    </div>

                    {/* Test Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Test / Assignment Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Multiplication Fact Check 4"
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                        />
                    </div>

                    {/* Score */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Score / 100</label>
                        <input
                            type="number"
                            max="100"
                            min="0"
                            value={score}
                            onChange={(e) => setScore(Number(e.target.value))}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                        />
                    </div>

                    {/* Date */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Assessment Date</label>
                        <input
                            type="date"
                            value={academicDate}
                            onChange={(e) => setAcademicDate(e.target.value)}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                        />
                    </div>

                    {/* Reading Level (Conditional) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Reading Level (Standardized)</label>
                        <select
                            disabled={subject !== 'Reading'}
                            value={readingLevel}
                            onChange={(e) => setReadingLevel(e.target.value)}
                            className={`bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition ${subject !== 'Reading' ? 'opacity-40 cursor-not-allowed' : ''
                                }`}
                        >
                            {['2Y', '2Z', '3A', '3B', '3C', '3D', '4A', '4K', '4L', '4M', '4N', '4O', '4P', '4Q', '4R', '4S', '4Z', '5A', '5B'].map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    {/* Standards Linked */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">CCSS Standard Code</label>
                        <input
                            type="text"
                            placeholder="e.g. CCSS.Math.3.OA.A.1"
                            value={standards}
                            onChange={(e) => setStandards(e.target.value)}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                        />
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    {editingAcademicId && (
                        <button
                            type="button"
                            onClick={handleCancelAcademicEdit}
                            className="bg-[#2A2D3A] text-slate-300 font-semibold px-4 py-2 rounded-lg text-xs hover:bg-[#323647] inline-flex items-center gap-1.5 cursor-pointer border-0"
                        >
                            Cancel Edit
                        </button>
                    )}
                    <Button
                        type="button"
                        onClick={handleSaveAcademic}
                    >
                        <UserCheck size={14} />
                        {editingAcademicId ? 'Save Assessment Changes' : 'Record Assessment'}
                    </Button>
                </div>
            </Card>

            {/* Assessment History Table */}
            <Card title={`Recorded Assessments ${currentStudent.name}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                            <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                                <th className="pb-2">Subject</th>
                                <th className="pb-2">Test / Milestone</th>
                                <th className="pb-2">Score</th>
                                <th className="pb-2">Standard</th>
                                <th className="pb-2">Date</th>
                                <th className="pb-2 text-center">Status</th>
                                <th className="pb-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2D3A]/65">
                            {academicRecords.length > 0 ? (
                                academicRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-800/15 transition">
                                        <td className="py-3 font-semibold text-orange-400">{record.subject}</td>
                                        <td className="py-3 font-semibold text-slate-200">{record.testName}</td>
                                        <td className="py-3 font-bold text-slate-100">{record.score}%</td>
                                        <td className="py-3 text-slate-400 font-mono text-[11px]">{record.standards.join(', ')}</td>
                                        <td className="py-3 text-slate-400">{record.date}</td>
                                        <td className="py-3 text-center">
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
                                        <td className="py-3 text-right">
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
}