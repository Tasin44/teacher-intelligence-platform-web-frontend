"use client";
import { Calendar, Edit2 } from 'lucide-react';
import { Student, Intervention } from '@/types';

interface ActiveInterventionPlanCardProps {
    intervention: Intervention;
    student: Student;
    onModifyPlan: (intervention: Intervention) => void;
}

const ActiveInterventionPlanCard = ({ intervention, student, onModifyPlan }: ActiveInterventionPlanCardProps) => {
    const isCompleted = intervention.status === 'Completed';

    return (
        <div
            className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col lg:flex-row justify-between gap-6 hover:border-slate-700 transition"
        >
            {/* Left side student or group info */}
            <div className="flex items-center gap-4.5 lg:w-1/4 text-left">
                {intervention.targetType === 'group' ? (
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-extrabold font-heading text-sm shrink-0">
                        {intervention.targetName ? intervention.targetName.split(' ').map(n => n[0]).join('').toUpperCase() : 'GP'}
                    </div>
                ) : (
                    <img
                        src={student.avatar}
                        alt={student.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/10 shrink-0"
                    />
                )}
                <div>
                    <h4 className="font-bold text-sm text-slate-155">
                        {intervention.targetType === 'group' ? (intervention.targetName || 'Target Group') : student.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                        {intervention.targetType === 'group' ? `Group Intervention` : `${student.grade} | Room 12`}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {intervention.targetType === 'group' ? `Target Group ID: ${intervention.groupId || 'N/A'}` : `Active Cluster: Group ${student.group}`}
                    </span>
                </div>
            </div>

            {/* Center Activities and Timeline */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-left">
                {/* Strategy & Activities */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-slate-400">Tactical Strategy</span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-305">
                        {intervention.activities.map((act, idx) => (
                            <li key={idx} className="flex gap-2 font-medium">
                                <span className="text-orange-500 font-bold">•</span>
                                <span>{act}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Period Timeline & Progress meter */}
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
                        <Calendar size={13} className="text-slate-505" />
                        <span>Timeline: {intervention.startDate} → {intervention.endDate}</span>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-450 font-medium">Progress Checked Goal</span>
                            <strong className="text-orange-400 font-mono font-bold">{intervention.progress}%</strong>
                        </div>
                        <div className="w-full h-1.5 bg-slate-805 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full transition-all duration-750" style={{ width: `${intervention.progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side status actions */}
            <div className="flex lg:flex-col justify-between items-end gap-3 lg:w-36 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#2A2D3A]/40">
                {isCompleted ? (
                    <span className="bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold">
                        Completed
                    </span>
                ) : (
                    <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                        Active Plan
                    </span>
                )}

                <button
                    onClick={() => onModifyPlan(intervention)}
                    className="text-xs text-slate-400 hover:text-slate-205 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 font-semibold"
                >
                    <Edit2 size={12} className="text-slate-505" />
                    Modify Plan
                </button>
            </div>
        </div>
    );
};

export default ActiveInterventionPlanCard;