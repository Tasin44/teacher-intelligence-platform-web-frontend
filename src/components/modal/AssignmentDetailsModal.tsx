"use client";
import { X, Calendar, Edit } from 'lucide-react';
import { Assignment, Student } from '@/types';
import { Button } from '../ui/button';

interface AssignmentDetailsModalProps {
    isOpen: boolean;
    viewingAssignment: Assignment | null;
    students: Student[];
    onClose: () => void;
    onEditClick: (assignment: Assignment) => void;
}

const AssignmentDetailsModal = ({ isOpen, viewingAssignment, students, onClose, onEditClick }: AssignmentDetailsModalProps) => {
    if (!isOpen || !viewingAssignment) return null;

    // Compute assigned students dynamically
    const assignedStudents = students.filter((student) => {
        const type = viewingAssignment.targetType;
        const val = viewingAssignment.targetValue;
        if (type === 'Student') {
            return student.name.toLowerCase().includes(val.toLowerCase()) || val.toLowerCase().includes(student.name.toLowerCase());
        } else if (type === 'Group') {
            const matchGroupId = val.replace('Group ', '').trim();
            return student.group === matchGroupId || student.group === val;
        } else if (type === 'Level') {
            const level = viewingAssignment.levelBadge;
            if (level === 'Below') {
                return student.riskLevel === 'At Risk' || student.riskLevel === 'Developing';
            } else if (level === 'Advanced') {
                return student.riskLevel === 'Advanced';
            } else {
                return student.riskLevel === 'On Track';
            }
        }
        return false;
    });

    return (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/85 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative flex flex-col justify-between animate-scaleIn text-slate-200">
                {/* Modal Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer bg-transparent border-0"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="mb-6 pb-4 border-b border-[#2A2D3A]/60">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500 block mb-1">
                        {viewingAssignment.type === 'Assignment' ? '🎒 CLASSROOM LEARNING TASK' : '🏠 HOMEWORK DISCOVERY TASK'}
                    </span>
                    <h3 className="text-xl font-bold font-heading text-slate-100 leading-snug">
                        {viewingAssignment.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Level badge */}
                        {viewingAssignment.levelBadge === 'Below' ? (
                            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                                scaffolding recommended
                            </span>
                        ) : viewingAssignment.levelBadge === 'Advanced' ? (
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                                enrichment focus
                            </span>
                        ) : (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                                on track progression
                            </span>
                        )}

                        <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
                            DIFFICULTY: {viewingAssignment.difficulty}
                        </span>

                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold ml-auto">
                            <Calendar size={12} className="text-orange-500" />
                            Due date: {viewingAssignment.dueDate}
                        </span>
                    </div>
                </div>

                {/* Main Content Sections */}
                <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar text-xs">

                    {/* Linked Standards */}
                    <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A]">
                        <h4 className="font-bold text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                            📌 Curricular Target & Linked CCSS Standards
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {viewingAssignment.standards.map((stan, idx) => (
                                <span key={idx} className="bg-[#1E2130] text-slate-200 border border-[#2A2D3A] px-2.5 py-1 rounded font-mono text-xs font-bold shadow-sm">
                                    {stan}
                                </span>
                            ))}
                            {viewingAssignment.standards.length === 0 && (
                                <span className="text-slate-500 italic">No exact standards linked to this homework module.</span>
                            )}
                        </div>
                    </div>

                    {/* Task Instructions */}
                    <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A] space-y-2">
                        <h4 className="font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                            📝 Homework & Lesson Instructions
                        </h4>
                        <p className="text-slate-300 leading-relaxed text-xs font-medium whitespace-pre-wrap">
                            {viewingAssignment.instructions || "No specific instructions provided for this lesson module."}
                        </p>
                    </div>

                    {/* Targeted cohort submission status */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                                👥 Enrolled Cohort Growth Progression ({assignedStudents.length} Students)
                            </h4>
                            <div className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full font-semibold">
                                Target: {viewingAssignment.targetType} ({viewingAssignment.targetValue})
                            </div>
                        </div>

                        <div className="bg-[#151722] rounded-xl border border-[#2A2D3A] divide-y divide-[#2A2D3A]/50 overflow-hidden text-xs">
                            {assignedStudents.length > 0 ? (
                                assignedStudents.map((student) => {
                                    const scoreHash = student.avgScore;
                                    let status: 'Completed' | 'In Progress' | 'Not Started' = 'Completed';
                                    let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                                    let detailText = `Graded: ${Math.round(student.avgScore)}% | Submitted 2 days ago`;

                                    if (scoreHash >= 80) {
                                        status = 'Completed';
                                        statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                                        detailText = `Graded: ${Math.min(100, Math.round(student.avgScore + (student.avgScore % 5)))}% | Submitted online`;
                                    } else if (scoreHash >= 70 && scoreHash < 80) {
                                        status = 'In Progress';
                                        statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                                        detailText = 'Draft saved | Standard scaffolding tools in-use';
                                    } else {
                                        status = 'Not Started';
                                        statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                                        detailText = 'No online draft found | Offline intervention scheduled';
                                    }

                                    return (
                                        <div key={student.id} className="flex items-center justify-between p-3 hover:bg-[#1C1F2E]/30 transition text-xs">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={student.avatar}
                                                    alt={student.name}
                                                    referrerPolicy="no-referrer"
                                                    className="w-7 h-7 rounded-full object-cover border border-[#2A2D3A]"
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-200">{student.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">
                                                        Math Score: {student.mathScore}% | Grade {student.grade} (Room {student.room})
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className={`inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${statusColor} mb-1`}>
                                                    {status}
                                                </span>
                                                <p className="text-[10px] text-slate-400 font-medium">{detailText}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-6 text-center text-slate-500 italic text-xs">
                                    No active students are currently targeted in this specialized cohort level/group vector.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 pt-4 border-t border-[#2A2D3A]/60 flex justify-end gap-3">
                    <button
                        onClick={() => {
                            onClose();
                            onEditClick(viewingAssignment);
                        }}
                        className="px-4 py-2 hover:bg-[#2A2D3A] text-orange-500 font-bold text-xs rounded-lg border border-orange-500/30 hover:border-orange-500/60 bg-transparent cursor-pointer transition flex items-center gap-1.5"
                    >
                        <Edit size={12} />
                        Edit Task Specs
                    </button>

                    <Button
                        onClick={onClose}
                    >
                        Close Details
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentDetailsModal;