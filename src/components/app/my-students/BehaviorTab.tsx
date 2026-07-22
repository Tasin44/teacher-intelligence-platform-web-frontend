"use client";

import React, { useState, useEffect } from 'react';
import { Star, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import { Student } from '@/types';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { createBehaviorFeedback, getBehaviorFeedback, ApiBehaviorFeedback } from '@/lib/api/behavior.api';

interface BehaviorTabProps {
    currentStudent: Student;
    onSuccess: (message: string) => void;
}

export default function BehaviorTab({ currentStudent, onSuccess }: BehaviorTabProps) {
    const [behaviorDate, setBehaviorDate] = useState(new Date().toISOString().split('T')[0]);
    const [behaviorType, setBehaviorType] = useState<'positive' | 'neutral' | 'concern'>('positive');
    const [behaviorNotes, setBehaviorNotes] = useState('');
    const [rating, setRating] = useState(4);

    const [apiBehavior, setApiBehavior] = useState<ApiBehaviorFeedback[]>([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const loadBehavior = async () => {
        setIsLoadingRecords(true);
        try {
            const data = await getBehaviorFeedback(currentStudent.student_roll);
            setApiBehavior(data.results);
        } catch { /* silently fail */ }
        finally { setIsLoadingRecords(false); }
    };

    useEffect(() => { loadBehavior(); }, [currentStudent.id]);

    const handleSaveBehavior = async () => {
        if (!currentStudent.student_roll) {
            setApiError('Student roll number is required.');
            return;
        }
        setIsSubmitting(true);
        setApiError(null);
        try {
            await createBehaviorFeedback({
                student_roll: currentStudent.student_roll,
                event_date: behaviorDate,
                incident_classification: behaviorType,
                engagement_rating: rating,
                observation_note: behaviorNotes || undefined,
            });
            await loadBehavior();
            setBehaviorNotes('');
            setRating(4);
            setBehaviorDate(new Date().toISOString().split('T')[0]);
            setBehaviorType('positive');
            onSuccess(`Behavior observation logged for ${currentStudent.name}!`);
        } catch (err: any) {
            setApiError(err.message || 'Failed to record behavior event.');
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

            <Card title='Register Behavioral Event'>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Date */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Event Date</label>
                        <input
                            type="date"
                            value={behaviorDate}
                            onChange={(e) => setBehaviorDate(e.target.value)}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                        />
                    </div>

                    {/* Incident Type */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Incident Classification</label>
                        <select
                            value={behaviorType}
                            onChange={(e) => setBehaviorType(e.target.value as any)}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                        >
                            <option value="positive">Positive (Exceptional Participation)</option>
                            <option value="neutral">Neutral (Standard Attendance)</option>
                            <option value="concern">Concern (Instruction Blockage)</option>
                        </select>
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Engagement Rating (1-5)</label>
                        <div className="flex items-center gap-1.5 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`hover:scale-125 duration-100 cursor-pointer bg-transparent border-0 p-0 ${star <= rating ? 'text-amber-500' : 'text-slate-600'}`}
                                >
                                    <Star size={18} fill={star <= rating ? '#EAB308' : 'none'} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                    <label className="text-xs font-bold text-slate-400">Observation Context Notes</label>
                    <textarea
                        rows={4}
                        placeholder="Record what preceded, the specific behavior, and any interventions deployed..."
                        value={behaviorNotes}
                        onChange={(e) => setBehaviorNotes(e.target.value)}
                        className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition resize-none"
                    />
                </div>

                <div className="mt-5 flex justify-end">
                    <Button type="button" onClick={handleSaveBehavior} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                        {isSubmitting ? 'Saving...' : 'Record Behavior Event'}
                    </Button>
                </div>
            </Card>

            <Card title={`Behavior Diagnostics (${currentStudent.name})`}>
                {isLoadingRecords ? (
                    <div className="flex items-center justify-center py-8 text-slate-400 text-xs gap-2">
                        <Loader2 size={16} className="animate-spin" /> Loading records...
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full max-w-full">
                        <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
                            <thead className="text-slate-400 font-semibold">
                                <tr className="border-b border-[#2A2D3A]">
                                    <th className="pb-2 whitespace-nowrap">Date</th>
                                    <th className="pb-2 whitespace-nowrap">Classification</th>
                                    <th className="pb-2 whitespace-nowrap">Notes</th>
                                    <th className="pb-2 text-center whitespace-nowrap">Engagement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2D3A]/60">
                                {apiBehavior.length > 0 ? (
                                    apiBehavior.map((log) => {
                                        const bgRowColor = log.incident_classification === 'concern'
                                            ? 'bg-rose-500/5 hover:bg-rose-500/10'
                                            : log.incident_classification === 'positive'
                                                ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                                                : 'hover:bg-slate-800/10';
                                        return (
                                            <tr key={log.behavior_id} className={`${bgRowColor} transition`}>
                                                <td className="py-4 font-medium text-slate-300 align-top pr-3 whitespace-nowrap">{log.event_date}</td>
                                                <td className="py-4 align-top pr-3 whitespace-nowrap">
                                                    {log.incident_classification === 'concern' ? (
                                                        <span className="bg-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-rose-500/20">Concern</span>
                                                    ) : log.incident_classification === 'positive' ? (
                                                        <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/20">Positive</span>
                                                    ) : (
                                                        <span className="bg-slate-500/20 text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-500/20">Neutral</span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-slate-200 text-xs leading-relaxed max-w-xs align-top pr-3">{log.observation_note || '—'}</td>
                                                <td className="py-4 text-center align-top">
                                                    <div className="flex items-center justify-center gap-0.5 text-amber-500">
                                                        {Array.from({ length: 5 }).map((_, idx) => (
                                                            <Star key={idx} size={12} fill={idx < log.engagement_rating ? '#EAB308' : 'none'} className={idx < log.engagement_rating ? 'text-amber-500' : 'text-slate-600'} />
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-slate-500 py-6">No behavior incidents recorded for {currentStudent.name}.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}