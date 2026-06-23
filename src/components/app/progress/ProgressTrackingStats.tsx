import React from 'react';

interface ProgressTrackingStatsProps {
  studentName?: string;
}

const ProgressTrackingStats = ({ studentName }: ProgressTrackingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Overall Growth Rate */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-[150px]" id="progress-card-trend">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 tracking-wider block uppercase">
            Overall Growth Rate
          </span>
          <h3 className="text-3xl font-extrabold text-[#10B981] mt-2 font-sans tracking-tight">
            +8.2%
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Approx Improvement since prior month
          </p>
        </div>
        <div className="mt-2">
          <span className="bg-[#FEF3C7] text-[#D97706] font-bold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase">
            Climbing
          </span>
        </div>
      </div>

      {/* Card 2: Standards Mastered */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-[150px]" id="progress-card-standards">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 tracking-wider block uppercase">
            Standards Mastered
          </span>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2 font-sans tracking-tight">
            3/5
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Completion Coefficient
        </p>
      </div>

      {/* Card 3: Attendance Rate */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-[150px]" id="progress-card-attendance">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 tracking-wider block uppercase">
            Class Attendance Rate
          </span>
          <h3 className="text-3xl font-extrabold text-[#10B981] mt-2 font-sans tracking-tight">
            89.4%
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Compliance guideline met successfully.
        </p>
      </div>
    </div>
  );
};

export default ProgressTrackingStats;