import Card from '@/components/shared/Card';
import React from 'react';

const ExpectedVsActualPacingChart = () => {
    const data = [
        { expected: 8, actual: 7, label: 'Wk 1' },
        { expected: 8, actual: 6, label: 'Wk 2' },
        { expected: 7, actual: 5, label: 'Wk 3' },
        { expected: 9, actual: 6, label: 'Wk 4' },
        { expected: 8, actual: 7, label: 'Wk 5' },
        { expected: 8, actual: 6, label: 'Wk 6' },
        { expected: 7, actual: 7, label: 'Wk 7' },
        { expected: 9, actual: 6, label: 'Wk 8' }
    ];

    const maxVal = 12;
    const chartHeight = 150; // in pixels

    return (
        <Card title='Expected vs Actual Pacing'>
            {/* Grouped Bar Chart Visual */}
            <div className="h-56 flex flex-col justify-between" id="visual-pacing-chart">
                <div className="flex-1 relative border-b border-slate-200 pb-2 flex">
                    {/* Y Axis Labels */}
                    <div className="w-8 flex flex-col justify-between text-[11px] font-bold text-slate-450 select-none pb-5 pt-1 text-right pr-2">
                        <span>12</span>
                        <span>9</span>
                        <span>6</span>
                        <span>3</span>
                        <span>0</span>
                    </div>

                    {/* Chart Bars and Grids */}
                    <div className="flex-1 relative flex justify-around items-end pb-5 pt-1">
                        {/* Horizontal grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-5 pt-1">
                            <div className="border-t border-slate-100/80 w-full"></div>
                            <div className="border-t border-slate-100/80 w-full"></div>
                            <div className="border-t border-slate-100/80 w-full"></div>
                            <div className="border-t border-slate-100/80 w-full"></div>
                        </div>

                        {/* Plot Rows */}
                        {data.map((week, idx) => {
                            const expectedHeight = (week.expected / maxVal) * chartHeight;
                            const actualHeight = (week.actual / maxVal) * chartHeight;

                            return (
                                <div key={idx} className="flex flex-col items-center group w-12 text-center select-none z-10">
                                    <div className="flex items-end justify-center gap-1.5">
                                        {/* Expected bar */}
                                        <div
                                            className="w-3.5 bg-accent-orange rounded-t-sm hover:brightness-110 transition-all duration-300"
                                            style={{ height: `${expectedHeight}px` }}
                                            title={`Expected: ${week.expected}`}
                                        ></div>
                                        {/* Actual bar */}
                                        <div
                                            className="w-3.5 bg-[#3B82F6] rounded-t-sm hover:brightness-110 transition-all duration-300"
                                            style={{ height: `${actualHeight}px` }}
                                            title={`Actual: ${week.actual}`}
                                        ></div>
                                    </div>
                                    <span className="absolute -bottom-5 text-[10px] text-slate-400 font-semibold">
                                        {week.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend below pacing chart */}
            <div className="flex gap-4 text-xs font-semibold mt-7" id="pacing-chart-legend">
                <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-orange"></span>
                    <span>Expected</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                    <span>Actual</span>
                </div>
            </div>
        </Card>
    );
};

export default ExpectedVsActualPacingChart;