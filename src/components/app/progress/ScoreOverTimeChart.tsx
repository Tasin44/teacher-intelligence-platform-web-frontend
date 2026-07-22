import Card from '@/components/shared/Card';
import React from 'react';

import { WeeklyScore } from '@/lib/api/progress.api';

interface ScoreOverTimeChartProps {
    studentName: string;
    weeklyScores?: WeeklyScore[];
}

const ScoreOverTimeChart = ({ studentName, weeklyScores = [] }: ScoreOverTimeChartProps) => {
    const xCoords = [20, 105, 190, 275, 360, 445, 530, 615];

    // Dynamic score points from API
    const scorePoints = weeklyScores.slice(0, 8).map((score, idx) => ({
        x: xCoords[idx] || 0,
        y: score.avg_score ? 150 - (score.avg_score * 1.5) : 150
    }));

    const scorePath = scorePoints.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <Card title={`Score Over Time (${studentName})`} subtitle="Interactive weekly diagnostic benchmarks" className="h-[390px]">

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

                            {/* Score line */}
                            {scorePoints.length > 1 && (
                                <polyline fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={scorePath} />
                            )}

                            {/* Score markers */}
                            {scorePoints.map((p, idx) => (
                                <circle key={`s-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="#F97316" stroke="#FFF" strokeWidth="1" className="cursor-pointer" />
                            ))}

                            {/* Empty state line */}
                            {scorePoints.length === 0 && (
                                <text x="317" y="80" textAnchor="middle" fill="#CBD5E1" fontSize="12" fontWeight="600">No weekly score data yet</text>
                            )}
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
        </Card>
    );
};

export default ScoreOverTimeChart;