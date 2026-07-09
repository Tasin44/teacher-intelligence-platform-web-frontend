"use client";
import React, { useState } from 'react';
import { Student } from '@/types';
import { ApiGroup } from '@/lib/api/grouping.api';

interface GroupCardProps {
    group: ApiGroup;
    students: Student[];
    onEdit: (group: ApiGroup) => void;
    onViewDetails: (group: ApiGroup) => void;
    onSelectStudent: (id: string) => void;
    onNavigate: (screen: 'dashboard' | 'students' | 'grouping' | 'assignments' | 'interventions' | 'lessons' | 'progress' | 'parent-comms' | 'pacing' | 'settings', subtab?: 'input' | 'ilp') => void;
}

const GroupCard = ({ group, students, onEdit, onViewDetails, onSelectStudent, onNavigate }: GroupCardProps) => {
    const [isEditHovered, setIsEditHovered] = useState(false);
    const [isDetailsHovered, setIsDetailsHovered] = useState(false);

    const groupStudents = students.filter((s) => group.students.some(gs => gs.student_id.toString() === s.id));
    const showingStudents = groupStudents.slice(0, 5);
    const hiddenCount = groupStudents.length - showingStudents.length;

    const handleStudentAvatarClick = (studentId: string) => {
        onSelectStudent(studentId);
        onNavigate('students', 'ilp');
    };

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

    return (
        <div
            className="bg-[#1E2130] p-6 rounded-2xl border transition flex flex-col justify-between hover:shadow-md"
            style={{ borderColor: color, borderWidth: '2px', borderLeftWidth: '6px' }}
        >
            <div>
                {/* Header Row */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold font-heading" style={{ color: color }}>
                                {group.group_name}
                            </span>
                            <span
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
                                style={{ backgroundColor: `${color}15`, color: color }}
                            >
                                {group.classification.replace('_', ' ')}
                            </span>
                        </div>
                        <p className='text-xs font-semibold bg-gray-300 inline px-2 py-1 rounded-xl'>Group ID: {group.group_id}</p>
                    </div>
                    <strong className="text-2xl font-black font-mono" style={{ color: color }}>
                        {parseFloat(group.avg_score).toFixed(1)}%
                    </strong>
                </div>

                {/* Info Labels Row */}
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
                    <span>Enrolled Students ({groupStudents.length})</span>
                    <span>Avg Score Coefficient</span>
                </div>

                {/* Avatars & Student Count Row */}
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="flex items-center -space-x-2.5 overflow-hidden">
                        {showingStudents.map((stud) => (
                            <button
                                key={stud.id}
                                onClick={() => handleStudentAvatarClick(stud.id)}
                                className="relative z-10 w-9 h-9 rounded-full border-2 border-white object-cover hover:-translate-y-1 transition duration-150 inline-block p-0 cursor-pointer"
                                title={stud.name}
                            >
                                <img src={stud.avatar} alt={stud.name} referrerPolicy="no-referrer" className="w-full h-full rounded-full object-cover" />
                            </button>
                        ))}
                        {hiddenCount > 0 && (
                            <div className="relative z-0 w-9 h-9 rounded-full border-2 border-white bg-slate-100 text-[10px] font-mono font-bold text-slate-600 flex items-center justify-center">
                                +{hiddenCount}
                            </div>
                        )}
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">
                        {hiddenCount > 0 ? `${groupStudents.length} students` : `${groupStudents.length} students`}
                    </span>
                </div>

                {/* Focus Tag Pill */}
                <div className="mb-4">
                    <span
                        className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize"
                        style={{ backgroundColor: '#F1F5F9', color: color }}
                    >
                        {group.tag.replace(/_/g, ' ')}
                    </span>
                </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-slate-450 font-semibold">
                    At Grade Level
                </span>
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => onEdit(group)}
                        onMouseEnter={() => setIsEditHovered(true)}
                        onMouseLeave={() => setIsEditHovered(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer bg-transparent"
                        style={{
                            borderColor: color,
                            color: color,
                            backgroundColor: isEditHovered ? `${color}15` : 'transparent'
                        }}
                    >
                        Edit Group
                    </button>
                    <button
                        onClick={() => onViewDetails(group)}
                        onMouseEnter={() => setIsDetailsHovered(true)}
                        onMouseLeave={() => setIsDetailsHovered(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border-0"
                        style={{
                            backgroundColor: isDetailsHovered ? `${color}22` : `${color}12`,
                            color: color
                        }}
                    >
                        View Details
                        <span className="text-sm font-black">&rarr;</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupCard;