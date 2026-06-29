"use client";
import React, { useState } from 'react';
import { Student, Group } from '@/types';

interface GroupCardProps {
    group: Group;
    students: Student[];
    onEdit: (group: Group) => void;
    onSelectStudent: (id: string) => void;
    onNavigate: (screen: 'dashboard' | 'students' | 'grouping' | 'assignments' | 'interventions' | 'lessons' | 'progress' | 'parent-comms' | 'pacing' | 'settings', subtab?: 'input' | 'ilp') => void;
}

const GroupCard = ({ group, students, onEdit, onSelectStudent, onNavigate }: GroupCardProps) => {
    const [isEditHovered, setIsEditHovered] = useState(false);
    const [isDetailsHovered, setIsDetailsHovered] = useState(false);

    const groupStudents = students.filter((s) => group.studentIds.includes(s.id));
    const showingStudents = groupStudents.slice(0, 5);
    const hiddenCount = groupStudents.length - showingStudents.length;

    const handleStudentAvatarClick = (studentId: string) => {
        onSelectStudent(studentId);
        onNavigate('students', 'ilp');
    };

    return (
        <div
            className="bg-[#1E2130] p-6 rounded-2xl border transition flex flex-col justify-between hover:shadow-md"
            style={{ borderColor: group.color, borderWidth: '2px', borderLeftWidth: '6px' }}
        >
            <div>
                {/* Header Row */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold font-heading" style={{ color: group.color }}>
                                {group.name}
                            </span>
                            <span
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                                style={{ backgroundColor: `${group.color}15`, color: group.color }}
                            >
                                {group.type}
                            </span>
                        </div>
                        <p className='text-xs font-semibold bg-gray-300 inline px-2 py-1 rounded-xl'>Group ID: 1</p>
                    </div>
                    <strong className="text-2xl font-black font-mono" style={{ color: group.color }}>
                        {group.avgScore}%
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
                        className="px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ backgroundColor: '#F1F5F9', color: group.color }}
                    >
                        {group.tag}
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
                            borderColor: group.color,
                            color: group.color,
                            backgroundColor: isEditHovered ? `${group.color}15` : 'transparent'
                        }}
                    >
                        Edit Group
                    </button>
                    <button
                        onClick={() => {
                            if (groupStudents[0]) {
                                onSelectStudent(groupStudents[0].id);
                                onNavigate('students', 'ilp');
                            }
                        }}
                        onMouseEnter={() => setIsDetailsHovered(true)}
                        onMouseLeave={() => setIsDetailsHovered(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border-0"
                        style={{
                            backgroundColor: isDetailsHovered ? `${group.color}22` : `${group.color}12`,
                            color: group.color
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