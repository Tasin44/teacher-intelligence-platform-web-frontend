"use client";
import { Sparkles } from 'lucide-react';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';

interface StudentsNeedingInterventionAssistanceCardProps {
    student: Student;
    onCreatePlan: (studentId: string) => void;
}

const StudentsNeedingInterventionAssistanceCard = ({ student, onCreatePlan }: StudentsNeedingInterventionAssistanceCardProps) => {
    return (
        <div className="shrink-0 w-64 bg-[#0F1117] p-4.5 rounded-xl border border-[#2A2D3A]/70 flex flex-col justify-between h-50 snap-start hover:border-rose-500/30 transition duration-150">
            <div className="flex items-center gap-3">
                <img
                    src={student.avatar}
                    alt={student.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-rose-500/20"
                />
                <div>
                    <h4 className="font-bold text-xs text-slate-155 leading-tight">{student.name}</h4>
                    <p className="text-[10px] text-slate-550 font-semibold">
                        Grade 4 | Score Coefficient: <strong className="text-rose-500 font-bold">{student.avgScore}%</strong>
                    </p>
                </div>
            </div>

            <div className="my-3 text-left">
                <span className="text-[10px] uppercase font-extrabold text-rose-500 tracking-wider block">Identified Blockage</span>
                <span className="bg-rose-500/10 text-rose-400 font-semibold px-2 py-0.5 rounded text-[10px] mt-1.5 inline-block font-mono">
                    Weak: Multiplication ({student.mathScore}%)
                </span>
            </div>

            <Button
                onClick={() => onCreatePlan(student.id)}
            >
                <Sparkles size={11} fill="#000" />
                Create Plan
            </Button>
        </div>
    );
};

export default StudentsNeedingInterventionAssistanceCard;