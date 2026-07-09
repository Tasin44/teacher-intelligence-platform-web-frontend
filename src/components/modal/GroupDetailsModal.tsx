"use client";

import React from 'react';
import { X, Users } from 'lucide-react';
import { ApiGroup } from '@/lib/api/grouping.api';
import { Student } from '@/types';

interface GroupDetailsModalProps {
    isOpen: boolean;
    group: ApiGroup | null;
    students: Student[];
    onClose: () => void;
    onSelectStudent: (id: string) => void;
    onNavigate: (screen: 'dashboard' | 'students' | 'grouping' | 'assignments' | 'interventions' | 'lessons' | 'progress' | 'parent-comms' | 'pacing' | 'settings', subtab?: 'input' | 'ilp') => void;
}

const GroupDetailsModal = ({ isOpen, group, students, onClose, onSelectStudent, onNavigate }: GroupDetailsModalProps) => {
    if (!isOpen || !group) return null;

    const groupStudents = students.filter((s) => group.students.some(gs => gs.student_id.toString() === s.id));

    const getColor = (classification: string) => {
        switch(classification) {
            case 'advance': return '#3B82F6';
            case 'on_track': return '#10B981';
            case 'developing': return '#F59E0B';
            case 'risk': return '#EF4444';
            default: return '#94A3B8';
        }
    };
    const color = getColor(group.classification);

    const handleStudentClick = (studentId: string) => {
        onSelectStudent(studentId);
        onNavigate('students', 'ilp');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#0F1117]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleIn text-slate-200">
                {/* Modal Header */}
                <div className="flex justify-between items-start border-b border-[#2A2D3A] pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Users size={18} style={{ color }} />
                            <h3 className="text-xl font-bold font-heading text-slate-100 leading-snug">
                                {group.group_name}
                            </h3>
                            <span
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                                style={{ backgroundColor: `${color}15`, color: color }}
                            >
                                {group.classification.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Group ID: {group.group_id} • Average Score: <span className="font-bold text-slate-200">{parseFloat(group.avg_score).toFixed(1)}%</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer bg-transparent border-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Enrolled Students ({groupStudents.length})</h4>
                        <div className="space-y-2">
                            {groupStudents.map(student => (
                                <div 
                                    key={student.id} 
                                    className="flex items-center justify-between p-3 rounded-xl bg-[#0F1117] border border-[#2A2D3A] hover:border-[#3A3D4A] transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-[#2A2D3A]" />
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-200">{student.name}</h5>
                                            <p className="text-xs text-slate-500 font-medium">Roll: {student.roll} • Grade: {student.grade}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleStudentClick(student.id)}
                                        className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
                                    >
                                        View ILP
                                    </button>
                                </div>
                            ))}
                            {groupStudents.length === 0 && (
                                <p className="text-sm text-slate-500 italic text-center py-4">No students are currently enrolled in this group.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A]">
                        <h4 className="font-bold text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                            Tactical Focus Tag
                        </h4>
                        <span
                            className="px-3 py-1 rounded text-xs font-bold capitalize inline-block"
                            style={{ backgroundColor: `${color}15`, color: color }}
                        >
                            {group.tag.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupDetailsModal;
