import Card from '@/components/shared/Card';
import React from 'react';

import { WeeklyScore } from '@/lib/api/progress.api';

interface ScoreOverTimeChartProps {
    studentName: string;
    weeklyScores?: WeeklyScore[];
}

const ScoreOverTimeChart = ({ studentName, weeklyScores = [] }: ScoreOverTimeChartProps) => {
    // X coordinates for Week 1 through 8 (we use 4 weeks since the API has 4 weeks, but let's interpolate or use available)
    const xCoords = [20, 105, 190, 275, 360, 445, 530, 615];

    // Math points (Orange) - mapping weeklyScores avg_score
    const mathPoints = weeklyScores.slice(0, 8).map((score, idx) => ({
        x: xCoords[idx] || 0,
        y: score.avg_score ? 150 - (score.avg_score * 1.5) : 150 // simple inverted scaling
    }));

    // Reading points (Green)
    const readingPoints = [
        { x: xCoords[0], y: 68 },
        { x: xCoords[1], y: 60 },
        { x: xCoords[2], y: 62 },
        { x: xCoords[3], y: 52 },
        { x: xCoords[4], y: 48 },
        { x: xCoords[5], y: 42 },
        { x: xCoords[6], y: 40 },
        { x: xCoords[7], y: 35 },
    ];

    // Science points (Blue)
    const sciencePoints = [
        { x: xCoords[0], y: 85 },
        { x: xCoords[1], y: 82 },
        { x: xCoords[2], y: 70 },
        { x: xCoords[3], y: 80 },
        { x: xCoords[4], y: 62 },
        { x: xCoords[5], y: 66 },
        { x: xCoords[6], y: 52 },
        { x: xCoords[7], y: 48 },
    ];

    const mathPath = mathPoints.map(p => `${p.x},${p.y}`).join(' ');
    const readingPath = readingPoints.map(p => `${p.x},${p.y}`).join(' ');
    const sciencePath = sciencePoints.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <Card title={`Score Over Time (${studentName})`} subtitle="Interactive weekly diagnostic benchmarks across fundamental modules" className="h-[390px]">

            {/* SVG Canvas wrapper */}
            <div className="relative w-full mt-4 flex-1 flex flex-col justify-center">
                <div className="w-full h-52 relative flex">
                    {/* Y Axis Labels */}
                    <div className="w-6 flex flex-col justify-between text-[11px] font-bold text-slate-400 select-none pb-6 pt-1 text-right pr-2">
                        <span className="leading-none">80</span>
                        <span className="leading-none">60</span>
                        <span className="leading-none">45</span>
                        <span className="leading-none">30</span>
                    </div>

                    <div className="flex-1 relative pb-6">
                        {/* SVG Plotting */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 635 150" preserveAspectRatio="none">
                            {/* Grid lines */}
                            <line x1="0" y1="5" x2="635" y2="5" stroke="#F1F5F9" strokeWidth="1.5" />
                            <line x1="0" y1="50" x2="635" y2="50" stroke="#F1F5F9" strokeWidth="1.5" />
                            <line x1="0" y1="95" x2="635" y2="95" stroke="#F1F5F9" strokeWidth="1.5" />
                            <line x1="0" y1="140" x2="635" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />

                            {/* Draw polylines */}
                            <polyline fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={mathPath} />
                            <polyline fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={readingPath} />
                            <polyline fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={sciencePath} />

                            {/* Math markers */}
                            {mathPoints.map((p, idx) => (
                                <circle key={`m-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="#F97316" stroke="#FFF" strokeWidth="1" className="cursor-pointer hover:r-5 transition-all" />
                            ))}

                            {/* Reading markers */}
                            {readingPoints.map((p, idx) => (
                                <circle key={`r-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="#10B981" stroke="#FFF" strokeWidth="1" className="cursor-pointer hover:r-5 transition-all" />
                            ))}

                            {/* Science markers */}
                            {sciencePoints.map((p, idx) => (
                                <circle key={`s-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="#3B82F6" stroke="#FFF" strokeWidth="1" className="cursor-pointer hover:r-5 transition-all" />
                            ))}
                        </svg>

                        {/* X Axis Labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[11px] font-bold text-slate-400 select-none">
                            {xCoords.map((_, idx) => (
                                <span key={idx}>Week {idx + 1}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend below the chart */}
            <div className="flex justify-center gap-6 text-xs font-bold mt-4" id="subject-chart-legend">
                <div className="flex items-center gap-1.5">
                    <span className="flex items-center justify-center">
                        <svg width="24" height="8" className="inline-block">
                            <line x1="0" y1="4" x2="24" y2="4" stroke="#F97316" strokeWidth="1.5" />
                            <circle cx="12" cy="4" r="2.5" fill="#F97316" stroke="#FFF" strokeWidth="0.75" />
                        </svg>
                    </span>
                    <span className="text-[11px] text-slate-500 font-extrabold uppercase">Math</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="flex items-center justify-center">
                        <svg width="24" height="8" className="inline-block">
                            <line x1="0" y1="4" x2="24" y2="4" stroke="#10B981" strokeWidth="1.5" />
                            <circle cx="12" cy="4" r="2.5" fill="#10B981" stroke="#FFF" strokeWidth="0.75" />
                        </svg>
                    </span>
                    <span className="text-[11px] text-slate-500 font-extrabold uppercase">Reading</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="flex items-center justify-center">
                        <svg width="24" height="8" className="inline-block">
                            <line x1="0" y1="4" x2="24" y2="4" stroke="#3B82F6" strokeWidth="1.5" />
                            <circle cx="12" cy="4" r="2.5" fill="#3B82F6" stroke="#FFF" strokeWidth="0.75" />
                        </svg>
                    </span>
                    <span className="text-[11px] text-slate-500 font-extrabold uppercase">Science</span>
                </div>
            </div>
        </Card>
    );
};

export default ScoreOverTimeChart;