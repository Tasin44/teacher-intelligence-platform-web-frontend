"use client";

interface StudentGroupingStatsProps {
    studentsCount: number;
    groupsCount: number;
}

const StudentGroupingStats = ({ studentsCount, groupsCount }: StudentGroupingStatsProps) => {
    return (
        <div className="bg-[#1E2130] p-4.5 rounded-xl border border-[#2A2D3A] grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#2A2D3A]/60 text-center" id="summary-bar-card">
            <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Total Students</span>
                <strong className="text-lg font-bold text-slate-100 mt-1 block font-mono">{studentsCount}</strong>
            </div>
            <div className="pt-2.5 md:pt-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Groups Formed</span>
                <strong className="text-lg font-bold text-accent-orange mt-1 block font-mono">{groupsCount}</strong>
            </div>
            <div className="pt-2.5 md:pt-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Avg Group Size</span>
                <strong className="text-lg font-bold text-slate-100 mt-1 block font-mono">7 Students</strong>
            </div>
            <div className="pt-2.5 md:pt-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Diagnostic Cycle</span>
                <strong className="text-xs font-semibold text-emerald-400 mt-2 block uppercase tracking-wide">June 2026 Sync</strong>
            </div>
        </div>
    );
}

export default StudentGroupingStats;