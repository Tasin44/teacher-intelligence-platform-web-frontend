"use client";

import React, { useState } from 'react';
import { Sliders, X, Check } from 'lucide-react';
import { Student } from '@/types';
import { Button } from '../ui/button';
import { ApiGroup } from '@/lib/api/grouping.api';

interface EditGroupModalProps {
    group: ApiGroup;
    students: Student[];
    onClose: () => void;
    onSave: (updatedGroup: ApiGroup) => void;
}

const EditGroupModal = ({ group, students, onClose, onSave }: EditGroupModalProps) => {
    // Group Edit States
    const [editName, setEditName] = useState(group.group_name);
    const [editTag, setEditTag] = useState<ApiGroup['tag']>(group.tag);
    const [editClassification, setEditClassification] = useState<ApiGroup['classification']>(group.classification);

    const handleSaveGroup = () => {
        if (!editName.trim()) return;

        const updatedGroup: ApiGroup = {
            ...group,
            group_name: editName,
            tag: editTag,
            classification: editClassification,
        };

        onSave(updatedGroup);
    };

    return (
        <div className="fixed inset-0 bg-[#0F1117]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleIn text-slate-200">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-[#2A2D3A] pb-3">
                    <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
                        <Sliders size={16} className="text-orange-500" />
                        Modify Study Cohort Specifications
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-100 bg-transparent border-0 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body Form */}
                <div className="space-y-4 text-xs">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-400">Cohort / Group Name</label>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="e.g. Group A - Algebra Mastery"
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Tactical Focus Tag</label>
                            <select
                                value={editTag}
                                onChange={(e) => setEditTag(e.target.value as ApiGroup['tag'])}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                            >
                                <option value="above_grade_level">Above Grade Level</option>
                                <option value="at_grade_level">At Grade Level</option>
                                <option value="approaching_grade_level">Approaching Grade Level</option>
                                <option value="below_grade_level">Below Grade Level</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Cohort Classification</label>
                            <select
                                value={editClassification}
                                onChange={(e) => setEditClassification(e.target.value as ApiGroup['classification'])}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                            >
                                <option value="advance">Advanced Mastery</option>
                                <option value="on_track">On Track / High Performance</option>
                                <option value="developing">Developing Core Mechanics</option>
                                <option value="risk">At Risk / Intensive Target</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-3 border-t border-[#2A2D3A]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-[#2A2D3A] text-slate-300 hover:bg-[#323647] font-bold px-4 py-2 rounded-lg text-xs border-0 cursor-pointer transition"
                    >
                        Discard Changes
                    </button>
                    <Button
                        type="button"
                        onClick={handleSaveGroup}
                    >
                        Apply Group Settings
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default EditGroupModal;