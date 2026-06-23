import Card from '@/components/shared/Card';
import React from 'react';

const AttendanceTrend = () => {
    return (
        <Card className="h-[390px]" title='Attendance Trend' subtitle='Log counted every 30-day interval based on school admissions.'>
            {/* Bar Chart Container */}
            <div className="flex-1 mt-6 flex items-stretch">
                {/* Y Axis Labels */}
                <div className="w-8 flex flex-col justify-between text-[11px] font-bold text-slate-400 select-none pb-7 pt-1 text-right pr-2">
                    <span>200</span>
                    <span>100</span>
                    <span>50</span>
                    <span>0</span>
                </div>

                {/* Chart Bars and Grids */}
                <div className="flex-1 relative flex justify-around items-end pb-7 border-b border-slate-250">
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7 pt-1">
                        <div className="border-t border-slate-100 w-full"></div>
                        <div className="border-t border-slate-100 w-full"></div>
                        <div className="border-t border-slate-100 w-full"></div>
                    </div>

                    {/* Bar 1: Apr */}
                    <div className="relative flex flex-col items-center z-10 w-12">
                        <div className="w-8 bg-[#10B981] rounded-t-sm h-[110px] transition-all duration-500 hover:opacity-90"></div>
                        <span className="absolute -bottom-6 text-[11px] font-bold text-slate-400">Apr</span>
                    </div>

                    {/* Bar 2: May */}
                    <div className="relative flex flex-col items-center z-10 w-12">
                        <div className="w-8 bg-[#10B981] rounded-t-sm h-[110px] transition-all duration-500 hover:opacity-90"></div>
                        <span className="absolute -bottom-6 text-[11px] font-bold text-slate-400">May</span>
                    </div>

                    {/* Bar 3: Jun */}
                    <div className="relative flex flex-col items-center z-10 w-12">
                        <div className="w-8 bg-[#10B981] rounded-t-sm h-[110px] transition-all duration-500 hover:opacity-90"></div>
                        <span className="absolute -bottom-6 text-[11px] font-bold text-slate-400">Jun</span>
                    </div>
                </div>
            </div>

            {/* Summary statistics */}
            <div className="grid grid-cols-3 gap-2 text-center mt-8 pt-4 border-t border-slate-100 text-xs font-semibold" id="attendance-trend-legend">
                <div>
                    <span className="text-sm font-extrabold text-[#10B981] block font-mono">75%</span>
                    <span className="text-[10px] text-[#10B981] block font-bold mt-0.5">Present Rate</span>
                </div>
                <div>
                    <span className="text-sm font-extrabold text-[#EF4444] block font-mono">11%</span>
                    <span className="text-[10px] text-[#EF4444] block font-bold mt-0.5">Absent Rate</span>
                </div>
                <div>
                    <span className="text-sm font-extrabold text-[#D97706] block font-mono">17%</span>
                    <span className="text-[10px] text-[#D97706] block font-bold mt-0.5">Late Rate</span>
                </div>
            </div>
        </Card>
    );
};

export default AttendanceTrend;