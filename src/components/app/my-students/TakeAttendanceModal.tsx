"use client";
import { useState, useEffect } from 'react';
import { X, UserCheck } from 'lucide-react';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';

interface TakeAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student;
    dateStr: string; // e.g. "June 1, 2026"
    initialStatus: 'Present' | 'Absent' | 'Late' | 'Weekend';
    onSave: (status: 'Present' | 'Absent' | 'Late' | 'Weekend', remarks: string) => void;
}

const TakeAttendanceModal = ({ isOpen, onClose, student, dateStr, initialStatus, onSave }: TakeAttendanceModalProps) => {
    const [status, setStatus] = useState<'Present' | 'Absent' | 'Late' | 'Weekend'>(initialStatus);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStatus(initialStatus);
            setRemarks('');
        }
    }, [isOpen, initialStatus]);

    if (!isOpen) return null;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const handleSaveClick = () => {
        onSave(status, remarks);
    };

    const statuses: Array<{
        id: 'Present' | 'Absent' | 'Late' | 'Weekend';
        label: string;
        description: string;
        activeClass: string;
    }> = [
            {
                id: 'Present',
                label: 'Present',
                description: 'Attended session',
                activeClass: 'border-emerald-500 text-emerald-400'
            },
            {
                id: 'Absent',
                label: 'Absent',
                description: 'Excused/Unexcused',
                activeClass: 'border-rose-500 text-rose-400'
            },
            {
                id: 'Late',
                label: 'Late',
                description: 'Tardy arrival',
                activeClass: 'border-amber-500 text-amber-400'
            },
            {
                id: 'Weekend',
                label: 'Weekend',
                description: 'Recess day',
                activeClass: 'border-slate-500 text-slate-350'
            }
        ];

    return (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-xl w-full max-w-lg shadow-2xl p-6 relative flex flex-col justify-between animate-slideUp text-slate-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer bg-transparent border-0"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#2A2D3A]/60">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                        <UserCheck size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-heading text-slate-100 leading-snug">
                            Take Attendance
                        </h3>
                        <span className="text-xs text-slate-400 font-semibold">{dateStr}</span>
                    </div>
                </div>

                {/* Student Info Box */}
                <div className="bg-[#151722] border border-[#2A2D3A]/60 rounded-xl p-4 mb-5 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-sm text-orange-500 font-extrabold font-heading">
                        {getInitials(student.name)}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-100 leading-snug">
                            {student.name}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium block mt-0.5">
                            Classroom Optimization ID: {student.id}
                        </span>
                    </div>
                </div>

                {/* Attendance Status Grid */}
                <div className="mb-5">
                    <span className="text-[10px] uppercase font-extrabold text-orange-500 tracking-widest block mb-3">
                        Select Attendance Status
                    </span>
                    <div className="grid grid-cols-2 gap-3.5">
                        {statuses.map((item) => {
                            const isSelected = status === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setStatus(item.id)}
                                    className={`border rounded-xl p-3 text-left transition duration-150 cursor-pointer bg-[#0F1117] flex flex-col justify-between ${isSelected
                                            ? item.activeClass
                                            : 'border-[#2A2D3A] text-slate-450 hover:border-slate-600'
                                        }`}
                                >
                                    <span className={`text-xs font-bold mb-2 ${isSelected ? item.activeClass : 'text-slate-300'}`}>
                                        {item.label}
                                    </span>
                                    <span className={`text-[10px] font-medium ${isSelected ? '' : 'text-slate-500'}`}>
                                        {item.description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Remarks / Notes */}
                <div className="mb-6">
                    <span className="text-[10px] uppercase font-extrabold text-orange-500 tracking-widest block mb-3">
                        Remarks / Notes
                    </span>
                    <textarea
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Specify notes (e.g. Guardian excused due to medical reason...)"
                        className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                    ></textarea>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#2A2D3A]/60 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-lg transition bg-transparent border-0 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleSaveClick}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5"
                    >
                        Save Attendance
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TakeAttendanceModal;