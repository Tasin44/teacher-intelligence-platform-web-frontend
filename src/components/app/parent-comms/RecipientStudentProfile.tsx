import React from 'react';
import { Search } from 'lucide-react';
import { Student } from '@/types';

interface RecipientStudentProfileProps {
    students: Student[];
    selectedStudentId: string;
    onSelectStudent: (id: string) => void;
    currentStudent: Student;
}

const RecipientStudentProfile = ({ students, selectedStudentId, onSelectStudent, currentStudent }: RecipientStudentProfileProps) => {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 items-center" id="recipient-student-profile-card">
            {/* Left side: Student select */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400 block" htmlFor="student-profile-select">
                    Student
                </label>
                <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                        id="student-profile-select"
                        value={selectedStudentId}
                        onChange={(e) => onSelectStudent(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#F4F6F9]/40 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer appearance-none shadow-sm"
                    >
                        {students.map((st) => (
                            <option key={st.id} value={st.id}>
                                {st.name} — {st.grade}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Right side: Destination Target Contact */}
            <div className="flex flex-col gap-1 md:items-end text-left md:text-right">
                <span className="text-[10px] text-slate-500 uppercase font-mono leading-none">Destination Target Contact</span>
                <strong className="text-xs font-bold text-slate-900 mt-1 block">{currentStudent.parentEmail}</strong>
            </div>
        </div>
    );
};

export default RecipientStudentProfile;