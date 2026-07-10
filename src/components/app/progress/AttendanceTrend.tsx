import Card from '@/components/shared/Card';
import React from 'react';
import { MonthlyAttendance } from '@/lib/api/progress.api';

interface AttendanceTrendProps {
    attendanceTrend?: MonthlyAttendance[];
}

const AttendanceTrend = ({ attendanceTrend = [] }: AttendanceTrendProps) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <Card className="h-[390px]" title='Attendance Trend' subtitle='Log counted every 30-day interval based on school admissions.'>
            {/* Bar Chart Container */}
            <div className="flex-1 mt-6 flex items-stretch">
                {/* Y Axis Labels */}
                <div className="w-8 flex flex-col justify-between text-[11px] font-bold text-slate-400 select-none pb-7 pt-1 text-right pr-2">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                </div>

                {/* Chart Bars and Grids */}
                <div className="flex-1 relative flex justify-around items-end pb-7 border-b border-slate-250">
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7 pt-1">
                        <div className="border-t border-slate-100 w-full"></div>
                        <div className="border-t border-slate-100 w-full"></div>
                        <div className="border-t border-slate-100 w-full"></div>
                    </div>

                    {/* Bars from API data (show last 3 months if available) */}
                    {attendanceTrend.slice(-3).map((item, idx) => (
                        <div key={idx} className="relative flex flex-col items-center z-10 w-12">
                            {/* Height based on attendance_rate / 100 * max_height (140px) */}
                            <div 
                                className="w-8 bg-[#10B981] rounded-t-sm transition-all duration-500 hover:opacity-90"
                                style={{ height: `${(item.attendance_rate || 0) * 1.4}px` }}
                            ></div>
                            <span className="absolute -bottom-6 text-[11px] font-bold text-slate-400">
                                {months[item.month - 1]}
                            </span>
                        </div>
                    ))}
                    {attendanceTrend.length === 0 && (
                        <div className="text-xs text-slate-400">No attendance data</div>
                    )}
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