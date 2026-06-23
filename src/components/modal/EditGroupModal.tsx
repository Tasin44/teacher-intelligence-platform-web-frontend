"use client";

import React, { useState } from 'react';
import { Sliders, X, Check } from 'lucide-react';
import { Student, Group } from '@/types';
import { Button } from '../ui/button';

interface EditGroupModalProps {
    group: Group;
    students: Student[];
    onClose: () => void;
    onSave: (updatedGroup: Group) => void;
}

const EditGroupModal = ({ group, students, onClose, onSave }: EditGroupModalProps) => {
    // Group Edit States
    const [editName, setEditName] = useState(group.name);
    const [editTag, setEditTag] = useState(group.tag);
    const [editType, setEditType] = useState<'Advanced' | 'On Track' | 'Developing' | 'At Risk'>(group.type);
    const [editColor, setEditColor] = useState(group.color);
    const [editStudentIds, setEditStudentIds] = useState<string[]>(group.studentIds);

    const handleToggleStudentInEdit = (studentId: string) => {
        if (editStudentIds.includes(studentId)) {
            setEditStudentIds(editStudentIds.filter((id) => id !== studentId));
        } else {
            setEditStudentIds([...editStudentIds, studentId]);
        }
    };

    const handleSaveGroup = () => {
        if (!editName.trim()) return;

        const updatedGroup: Group = {
            ...group,
            name: editName,
            tag: editTag,
            type: editType,
            color: editColor,
            borderColor: editColor,
            studentIds: editStudentIds,
            avgScore: editStudentIds.length > 0
                ? Math.round(
                    students
                        .filter((s) => editStudentIds.includes(s.id))
                        .reduce((acc, curr) => acc + curr.avgScore, 0) / editStudentIds.length
                )
                : group.avgScore
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
                <div className="space-y-4 text-xs font-sans">
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
                            <input
                                type="text"
                                value={editTag}
                                onChange={(e) => setEditTag(e.target.value)}
                                placeholder="e.g. Multi-step equations"
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Cohort Classification</label>
                            <select
                                value={editType}
                                onChange={(e) => setEditType(e.target.value as any)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                            >
                                <option value="Advanced">Advanced Mastery</option>
                                <option value="On Track">On Track / High Performance</option>
                                <option value="Developing">Developing Core Mechanics</option>
                                <option value="At Risk">At Risk / Intensive Target</option>
                            </select>
                        </div>
                    </div>

                    {/* Theme Color selector */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-400">Aesthetic Accent Theme</label>
                        <div className="flex items-center gap-2.5">
                            {[
                                { value: '#10B981', name: 'Emerald Green' },
                                { value: '#3B82F6', name: 'Blue Sky' },
                                { value: '#F59E0B', name: 'Zesty Amber' },
                                { value: '#EF4444', name: 'Rose Red' },
                                { value: '#8B5CF6', name: 'Royal Purple' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setEditColor(option.value)}
                                    className="w-7 h-7 rounded-full border-2 cursor-pointer transition p-0 flex items-center justify-center"
                                    style={{
                                        backgroundColor: option.value,
                                        borderColor: editColor === option.value ? '#FFFFFF' : 'transparent'
                                    }}
                                    title={option.name}
                                >
                                    {editColor === option.value && <Check size={12} className="text-white drop-shadow-md" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Student Enrollment Checklist */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <label className="font-bold text-slate-400">Enrolled Student Cohort Checklist</label>
                            <span className="text-[10px] text-slate-500 font-mono font-bold">
                                {editStudentIds.length} selectees
                            </span>
                        </div>

                        <div className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 max-h-40 overflow-y-auto space-y-1.5 custom-scrollbar">
                            {students.map((student) => {
                                const isChecked = editStudentIds.includes(student.id);
                                return (
                                    <div
                                        key={student.id}
                                        onClick={() => handleToggleStudentInEdit(student.id)}
                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition ${isChecked ? 'bg-slate-800/40 text-slate-100' : 'hover:bg-slate-800/20 text-slate-400'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                referrerPolicy="no-referrer"
                                                className="w-5 h-5 rounded-full object-cover"
                                            />
                                            <span className="font-semibold">{student.name}</span>
                                        </div>
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${isChecked ? 'bg-orange-500 border-orange-500 text-slate-900' : 'border-slate-600'
                                            }`}>
                                            {isChecked && <Check size={10} strokeWidth={3} />}
                                        </div>
                                    </div>
                                );
                            })}
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