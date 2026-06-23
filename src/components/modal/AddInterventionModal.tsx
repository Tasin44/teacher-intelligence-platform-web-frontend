"use client";

import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { Student } from '@/types';
import { Button } from '../ui/button';

interface AddInterventionModalProps {
    isOpen: boolean;
    students: Student[];
    defaultStudentId: string;
    onClose: () => void;
    onSave: (plan: {
        studentId: string;
        strategy: '1:1 Support' | 'Small Group' | 'Peer Support';
        activities: string[];
        startDate: string;
        endDate: string;
        progress: number;
        status: 'Active' | 'Completed';
    }) => void;
}

const AddInterventionModal = ({ isOpen, students, defaultStudentId, onClose, onSave }: AddInterventionModalProps) => {
    const [studentId, setStudentId] = useState(defaultStudentId);
    const [strategy, setStrategy] = useState<'1:1 Support' | 'Small Group' | 'Peer Support'>('1:1 Support');
    const [duration, setDuration] = useState('June 16 → June 30, 2026');
    const [status, setStatus] = useState<'Active' | 'Completed'>('Active');
    const [progress, setProgress] = useState<number>(10);
    const [activities, setActivities] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStudentId(defaultStudentId || students[0]?.id || 's1');
            setStrategy('1:1 Support');
            setDuration('June 16 → June 30, 2026');
            setStatus('Active');
            setProgress(10);
            setActivities('Daily 10-minute visual fractions mapping sessions\nWeekly partner division tracking checklists\nReflex response multiplication reviews');
        }
    }, [isOpen, defaultStudentId, students]);

    if (!isOpen) return null;

    const handleSaveClick = () => {
        const dates = duration.split('→').map((d) => d.trim());
        onSave({
            studentId,
            strategy,
            activities: activities.split('\n').filter((x) => x.trim() !== ''),
            startDate: dates[0] || '2026-06-16',
            endDate: dates[1] || '2026-06-30',
            progress,
            status
        });
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="font-bold text-slate-400">Target Student Name</label>
                            <select
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                            >
                                {students.map((st) => (
                                    <option key={st.id} value={st.id}>
                                        {st.name} ({st.riskLevel})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="font-bold text-slate-400">Clinical Tier Method</label>
                            <select
                                value={strategy}
                                onChange={(e) => setStrategy(e.target.value as any)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                            >
                                <option value="1:1 Support">1:1 Clinical Guidance</option>
                                <option value="Small Group">Small Group Sync (Tier 2)</option>
                                <option value="Peer Support">Structured Peer Mentorship</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="font-bold text-slate-400">Active Duration Timelines</label>
                            <input
                                type="text"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="font-bold text-slate-400">Intervention Status Setting</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                            >
                                <option value="Active">Active Intervention Plan</option>
                                <option value="Completed">Completed / Resolved Plan</option>
                            </select>
                        </div>
                    </div>

                    {/* Progress Slider */}
                    <div className="bg-[#0F1117]/50 rounded-xl p-3 border border-[#2A2D3A] space-y-2 text-left">
                        <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="text-slate-400">Tactical Progress Checked Goal</span>
                            <strong className="text-orange-400 font-mono text-xs">{progress}% Score</strong>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                            className="w-full accent-orange-500 cursor-pointer"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                        <label className="font-bold text-slate-400">Required Tactical Exercises (one per line)</label>
                        <textarea
                            rows={5}
                            value={activities}
                            onChange={(e) => setActivities(e.target.value)}
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
                        Publish Intervention Plan
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddInterventionModal;