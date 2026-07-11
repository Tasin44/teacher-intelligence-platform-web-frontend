"use client";

import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { Student, Intervention } from '@/types';
import { Button } from '../ui/button';

interface AddInterventionModalProps {
    isOpen: boolean;
    students: Student[];
    defaultStudentId: string;
    onClose: () => void;
    onSave: (plan: Omit<Intervention, 'id'>) => void;
}

const AddInterventionModal = ({ isOpen, students, defaultStudentId, onClose, onSave }: AddInterventionModalProps) => {
    const [type, setType] = useState<'individual student' | 'individual group'>('individual student');
    const [studentName, setStudentName] = useState('');
    const [studentRoll, setStudentRoll] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupId, setGroupId] = useState('');
    const [interventionType, setInterventionType] = useState('extra tutoring');
    const [reason, setReason] = useState('low reading score');
    const [startDate, setStartDate] = useState('2026-06-16');
    const [frequency, setFrequency] = useState('twice a week');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            const currentStudent = students.find(s => s.id === defaultStudentId) || students[0];
            setType('individual student');
            setStudentName(currentStudent?.name || '');
            setStudentRoll('');
            setGroupName('');
            setGroupId('');
            setInterventionType('extra tutoring');
            setReason('low reading score');
            setStartDate('2026-06-16');
            setFrequency('twice a week');
            setNotes('');
        }
    }, [isOpen, defaultStudentId, students]);

    if (!isOpen) return null;

    const handleSaveClick = () => {
        if (type === 'individual student') {
            const matchedStudent = students.find(s => s.name.toLowerCase() === studentName.toLowerCase());
            const matchedStudentId = matchedStudent ? matchedStudent.id : (students[0]?.id || 's1');

            onSave({
                studentId: matchedStudentId,
                strategy: (interventionType || '1:1 Support') as any,
                activities: notes ? [notes] : ['Daily Support'],
                startDate: startDate || '2026-06-16',
                endDate: startDate || '2026-06-30',
                progress: 0,
                status: 'Active',
                targetType: 'student',
                targetName: studentName,
                studentRoll: studentRoll
            });
        } else {
            onSave({
                studentId: students[0]?.id || 's1', // schema fallback
                strategy: (interventionType || 'Small Group') as any,
                activities: notes ? [notes] : ['Daily Support'],
                startDate: startDate || '2026-06-16',
                endDate: startDate || '2026-06-30',
                progress: 0,
                status: 'Active',
                targetType: 'group',
                targetName: groupName,
                groupId: groupId
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-xl w-full max-w-lg shadow-2xl p-6 relative animate-slideUp text-slate-200">
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-100 transition cursor-pointer bg-transparent border-0"
                >
                    <X size={18} />
                </button>

                <h3 className="text-base font-bold font-heading text-slate-100 mb-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-orange-500" />
                    Configure Custom Remedial Pipeline
                </h3>

                <div className="space-y-4 text-xs">
                    {/* Row 0: Intervention Target Type Dropdown */}
                    <div className="flex flex-col gap-1.5 text-left">
                        <label className="font-bold text-slate-400">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold cursor-pointer w-full"
                        >
                            <option value="individual student">Individual Student</option>
                            <option value="individual group">Individual Group</option>
                        </select>
                    </div>

                    {/* Conditional rendering based on Type */}
                    {type === 'individual student' ? (
                        /* Row 1 for Student: Student Name & Roll */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="font-bold text-slate-400">Target Student Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Alisha Patel"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="font-bold text-slate-400">Target Student Roll</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 12345"
                                    value={studentRoll}
                                    onChange={(e) => setStudentRoll(e.target.value)}
                                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
                                />
                            </div>
                        </div>
                    ) : (
                        /* Row 1 for Group: Group Name & ID */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="font-bold text-slate-400">Target Group Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Group A or Reading Falcons"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="font-bold text-slate-400">Target Group ID</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 101"
                                    value={groupId}
                                    onChange={(e) => setGroupId(e.target.value)}
                                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
                                />
                            </div>
                        </div>
                    )}

                    {/* Row 2: Intervention Type & Reason */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="font-bold text-slate-400">Intervention type</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., extra tutoring, small-group support"
                                value={interventionType}
                                onChange={(e) => setInterventionType(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="font-bold text-slate-400">Reason for intervention</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., low reading score"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
                            />
                        </div>
                    </div>

                    {/* Row 3: Start Date & Frequency */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="font-bold text-slate-400">Start date</label>
                            <input
                                type="text"
                                required
                                placeholder="YYYY-MM-DD"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="font-bold text-slate-400">Frequency</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., twice a week"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
                            />
                        </div>
                    </div>

                    {/* Notes/Observations Textarea */}
                    <div className="flex flex-col gap-1.5 text-left">
                        <label className="font-bold text-slate-400">Notes / Observations</label>
                        <textarea
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter notes or observations..."
                            className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                        />
                    </div>
                </div>

                <div className="mt-5 pt-4.5 border-t border-[#2A2D3A]/60 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-lg transition bg-transparent border-0 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleSaveClick}
                    >
                        <CheckCircle size={14} strokeWidth={2.5} />
                        Generate Intervention plan
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddInterventionModal;