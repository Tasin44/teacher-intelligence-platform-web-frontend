import React from 'react';
import { Student } from '@/types';

interface IndividualStudentProgressAlignmentsCardProps {
  student: Student;
}

const IndividualStudentProgressAlignmentsCard = ({ student }: IndividualStudentProgressAlignmentsCardProps) => {
  const levelColor =
    student.riskLevel === 'At Risk'
      ? 'text-rose-500 bg-rose-500/10'
      : student.riskLevel === 'Advanced'
        ? 'text-blue-500 bg-blue-500/10'
        : 'text-emerald-500 bg-emerald-500/10';

  const coveredCountMock = student.riskLevel === 'At Risk' ? 8 : student.riskLevel === 'Advanced' ? 17 : 12;
  const percentageMock = Math.round((coveredCountMock / 20) * 100);

  return (
    <div className="bg-[#1E2130] p-4.5 rounded-xl border border-[#2A2D3A] flex flex-col justify-between hover:border-slate-700 transition">
      <div className="flex items-center gap-3">
        <img
          src={student.avatar}
          alt={student.name}
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover border border-[#2A2D3A] shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-xs text-slate-150 truncate leading-tight w-full" title={student.name}>
            {student.name}
          </h4>
          <span className={`px-2 py-0.2 rounded-full text-[8px] font-extrabold uppercase mt-1 inline-block ${levelColor}`}>
            {student.riskLevel === 'At Risk' ? 'Behind' : student.riskLevel === 'Advanced' ? 'Ahead' : 'On Track'}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 mt-3 select-none">
        <div className="flex justify-between text-[10px] font-bold">
          <span className="text-slate-400">Mastery covered</span>
          <span className="text-orange-400 font-mono">{coveredCountMock}/20</span>
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden select-none">
          <div className="h-full bg-orange-500 rounded-full transition-all duration-350" style={{ width: `${percentageMock}%` }}></div>
        </div>
      </div>
    </div>

  );
};

export default IndividualStudentProgressAlignmentsCard;