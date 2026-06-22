"use client";

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { Button } from '../ui/button';

export default function AddStudentModal() {
    const { isAddStudentOpen, setIsAddStudentOpen, addStudent } = useEduPulse();
    const router = useRouter();

    // Add Student Form Local States
    const [newName, setNewName] = useState('');
    const [newGrade, setNewGrade] = useState('Grade 4');
    const [newLevel, setNewLevel] = useState<'At Risk' | 'On Track' | 'Advanced' | 'Developing'>('On Track');
    const [newReading, setNewReading] = useState('4A');
    const [newParentName, setNewParentName] = useState('');
    const [newParentEmail, setNewParentEmail] = useState('');

    if (!isAddStudentOpen) return null;

    const handleAddStudentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName) return;

        addStudent({
            name: newName,
            grade: newGrade,
            riskLevel: newLevel,
            readingLevel: newReading,
            parentName: newParentName,
            parentEmail: newParentEmail
        });

        setIsAddStudentOpen(false);

        // reset fields
        setNewName('');
        setNewParentName('');
        setNewParentEmail('');

        // Route to input view to verify
        router.push('/students?subtab=input');
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <form
                onSubmit={handleAddStudentSubmit}
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

                <div className="space-y-4 text-xs font-sans">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-400">Student Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Alisha Patel"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Target Grade</label>
                            <select
                                value={newGrade}
                                onChange={(e) => setNewGrade(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                            >
                                <option value="Grade 4">Grade 4 (Primary)</option>
                                <option value="Grade 3">Grade 3</option>
                                <option value="Grade 5">Grade 5</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Diagnostic Risk Tier</label>
                            <select
                                value={newLevel}
                                onChange={(e) => setNewLevel(e.target.value as any)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                            >
                                <option value="On Track font-bold">On Track (Standard)</option>
                                <option value="At Risk">At Risk (Tier 2 Scaffolds)</option>
                                <option value="Advanced">Advanced (Enrichment)</option>
                                <option value="Developing">Developing (Approaching)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-400">Initial Reading Placement Code</label>
                        <input
                            type="text"
                            placeholder="e.g. 4M or 5A"
                            value={newReading}
                            onChange={(e) => setNewReading(e.target.value)}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Parent Guardian Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Sandra Jenkins"
                                value={newParentName}
                                onChange={(e) => setNewParentName(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Guardian Contact Email</label>
                            <input
                                type="email"
                                placeholder="guardian@example.com"
                                value={newParentEmail}
                                onChange={(e) => setNewParentEmail(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                            />
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