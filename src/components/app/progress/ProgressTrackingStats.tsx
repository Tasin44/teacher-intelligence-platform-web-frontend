import React from 'react';
import { StudentOverallProgress, ClassAttendance } from '@/lib/api/progress.api';

interface ProgressTrackingStatsProps {
  overallProgress?: StudentOverallProgress | null;
  classAttendance?: ClassAttendance | null;
}

const ProgressTrackingStats = ({ overallProgress, classAttendance }: ProgressTrackingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Overall Growth Rate */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-[150px]" id="progress-card-trend">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 tracking-wider block uppercase">
            Avg Score
          </span>
          <h3 className="text-3xl font-extrabold text-[#10B981] mt-2 font-sans tracking-tight">
            {overallProgress ? overallProgress.avg_score + '%' : '--'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Risk: {overallProgress ? overallProgress.risk_status.replace('_', ' ') : '--'}
          </p>
        </div>
        <div className="mt-2">
          <span className="bg-[#FEF3C7] text-[#D97706] font-bold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase">
            {overallProgress?.reading_level ? `Reading Level ${overallProgress.reading_level}` : 'Loading...'}
          </span>
        </div>
      </div>

      {/* Card 2: Standards Mastered */}
      {/* <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-[150px]" id="progress-card-standards">
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
      </div> */}

      {/* Card 3: Attendance Rate */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-[150px]" id="progress-card-attendance">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 tracking-wider block uppercase">
            Class Attendance Rate
          </span>
          <h3 className="text-3xl font-extrabold text-[#10B981] mt-2 font-sans tracking-tight">
            {classAttendance ? classAttendance.class_attendance_rate + '%' : '--'}
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Based on {classAttendance?.total_days_recorded || 0} total days recorded.
        </p>
      </div>
    </div>
  );
};

export default ProgressTrackingStats;