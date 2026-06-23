"use client";

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { Student, ReteachPlan } from '@/types';
import { Button } from '../ui/button';

interface GroupReteachPlanDetailsModalProps {
    plan: ReteachPlan | null;
    students: Student[];
    isOpen: boolean;
    onClose: () => void;
    onDispatchHomework: () => void;
    onDownloadPacket: () => void;
}

const GroupReteachPlanDetailsModal = ({ plan, students, isOpen, onClose, onDispatchHomework, onDownloadPacket }: GroupReteachPlanDetailsModalProps) => {
    const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (isOpen) {
            setCheckedSteps({});
        }
    }, [isOpen]);

    if (!isOpen || !plan) return null;

    const matchingStudents = students
        .filter((st) => st.riskLevel === 'At Risk' || st.riskLevel === 'Developing')
        .slice(0, plan.studentCount);

    let fullStandardName = plan.standard;
    let remediationStrategy = "Personalized Scaffolding & Tier-2 Direct Tutoring";
    let actionSteps = [
        "Check pre-requisite vocabulary elements and model with simplified diagrams.",
        "Distribute scaffolded worksheets with clear step-by-step guidance indicators.",
        "Conduct a 10-minute targeted small-group intervention using manipulatives.",
        "Assess readiness utilizing standard formatted exit tickets."
    ];

    if (plan.standard.includes("Math.3.OA")) {
        fullStandardName = "CCSS.Math.3.OA.A.1 — Represent and solve problems involving multiplication and division.";
        remediationStrategy = "Tactile Visual Arrays & Grouping Counters";
        actionSteps = [
            "Provide students with tactile coordinate counting grids and wood tiles.",
            "Demonstrate concept equivalence of groups (e.g. 5 pools of 3 ducks = 15 total ducks).",
            "Pair up targeted student groups to practice physically mapping out visual blocks.",
            "Circulate for immediate feedback and evaluate on formative exit vouchers."
        ];
    } else if (plan.standard.includes("ELA.RI")) {
        fullStandardName = "CCSS.ELA.RI.4.1 — Refer to details/examples when explaining explicit text.";
        remediationStrategy = "evidence highlight sentence framing templates";
        actionSteps = [
            "Hand out evidence-locator cards highlighting direct citation points.",
            "Display visual templates featuring sentence starters like: 'According to paragraph 2...'",
            "Model dual-column evidence mapping (Text Statement VS My Supporting Inference).",
            "Have peers highlight direct claims in the reading passage using physical highlighters."
        ];
    } else if (plan.standard.includes("NGSS")) {
        fullStandardName = "NGSS.4-LS1-1 — Construct an argument detailing internal & external organic structures.";
        remediationStrategy = "illustrated comparative organ mapping workflows";
        actionSteps = [
            "Project comparative whiteboard diagrams highlighting cell pathways and outer skin/bark layers.",
            "Instruct student teams to construct structural mock-ups of plant stems with tactile modeling clay.",
            "Have students label structural pathways versus physiological functions on whiteboards.",
            "Administer quick structural exit tickets to gauge student comprehension levels before next unit."
        ];
    }

    return (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/85 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative flex flex-col justify-between animate-scaleIn text-slate-200">

                {/* Corner Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer bg-transparent border-0"
                >
                    <X size={18} />
                </button>

                {/* Modal Header */}
                <div className="mb-5 pb-4 border-b border-[#2A2D3A]/60 text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500 block mb-1">
                        🎯 TARGETED SMALL GROUP RETEACH PIPELINE
                    </span>
                    <h3 className="text-lg font-bold font-heading text-slate-100 leading-snug">
                        {fullStandardName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                            {plan.studentCount} Students Blocked
                        </span>

                        <span className="text-[11px] bg-slate-800 text-slate-305 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
                            STRATEGY: {remediationStrategy}
                        </span>
                    </div>
                </div>

                {/* Scrollable Content Section */}
                <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar text-xs text-left">

                    {/* Method / Overview Details */}
                    <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A]">
                        <h4 className="font-bold text-slate-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                            📘 Remedial Classroom Methodology Overview
                        </h4>
                        <p className="text-slate-305 leading-relaxed font-semibold">
                            {plan.method}
                        </p>
                    </div>

                    {/* Interactive Steps Checklist */}
                    <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A] space-y-3">
                        <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[10px] flex items-center justify-between">
                            <span>📋 Step-By-Step Interactive Execution Plan</span>
                            <span className="text-[10px] text-orange-500 lowercase font-semibold italic">click steps to check off progress</span>
                        </h4>

                        <div className="space-y-2.5">
                            {actionSteps.map((step, idx) => {
                                const stepKey = `${plan.id}_step_${idx}`;
                                const isCompleted = !!checkedSteps[stepKey];
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setCheckedSteps(prev => ({ ...prev, [stepKey]: !prev[stepKey] }))}
                                        className={`flex items-start gap-3 p-2.5 rounded-lg border transition cursor-pointer select-none ${isCompleted
                                                ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-400 line-through'
                                                : 'bg-[#1E2130]/50 border-[#2A2D3A]/60 hover:border-slate-500 text-slate-200'
                                            }`}
                                    >
                                        <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition ${isCompleted
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                                : 'border-[#424659] hover:border-slate-400'
                                            }`}>
                                            {isCompleted && <Check size={10} strokeWidth={4} />}
                                        </div>
                                        <span className="text-xs leading-relaxed font-semibold">
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Targeted Cohort Status */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[10px] px-1 flex items-center justify-between">
                            <span>👥 BLOCKED STUDENTS ASSIGNED IN CURRENT FLAGGED MATRIX</span>
                            <span className="text-slate-550 text-[10px] font-semibold">Academic Score Indicator</span>
                        </h4>

                        <div className="bg-[#151722] rounded-xl border border-[#2A2D3A] divide-y divide-[#2A2D3A]/50 overflow-hidden">
                            {matchingStudents.length > 0 ? (
                                matchingStudents.map((student) => (
                                    <div key={student.id} className="flex items-center justify-between p-3 hover:bg-[#1C1F2E]/30 transition text-xs">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                referrerPolicy="no-referrer"
                                                className="w-7 h-7 rounded-full object-cover border border-[#2A2D3A]"
                                            />
                                            <div>
                                                <p className="font-bold text-slate-250">{student.name}</p>
                                                <p className="text-[10px] text-slate-500 font-semibold">
                                                    Grade {student.grade} | Room {student.room}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-405 border border-rose-500/10 mb-1">
                                                {student.riskLevel}
                                            </span>
                                            <p className="text-[10px] font-semibold text-slate-405">
                                                Math Score: {student.mathScore}%
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-slate-505 italic text-xs">
                                    No active academic intervention profiles match this specific standard filter.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="mt-5 pt-4 border-t border-[#2A2D3A]/60 flex justify-between items-center gap-3">
                    <Button
                        onClick={onDispatchHomework}
                    >
                        <Sparkles size={12} className="text-slate-900 animate-spin" />
                        Dispatch AI Homework Tasks
                    </Button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onDownloadPacket}
                            className="px-4 py-3 text-xs font-bold text-slate-305 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition bg-transparent border border-[#2A2D3A]"
                        >
                            Download Packet
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-3 text-xs font-bold bg-[#2A2D3A] text-slate-100 hover:bg-[#34384b] rounded-lg cursor-pointer transition border-0"
                        >
                            Close Plan
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GroupReteachPlanDetailsModal;