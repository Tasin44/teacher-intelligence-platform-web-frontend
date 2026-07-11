import Card from '@/components/shared/Card';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getSubjectPerformance, SubjectPerformance } from '@/lib/api/dashboard.api';

const ClassPerformanceChart = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [chartData, setChartData] = useState<SubjectPerformance[]>([]);

    useEffect(() => {
        setIsMounted(true);
        getSubjectPerformance().then(res => setChartData(res)).catch(console.error);
    }, []);

    if (!isMounted) {
        return (
            <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] h-[380px] animate-pulse flex items-center justify-center">
                <span className="text-slate-400 text-sm">Loading Chart...</span>
            </div>
        );
    }

    return (
        <Card title='Class Performance' className="lg:col-span-7 flex flex-col justify-between">
            <div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                            barGap={6}
                            barCategoryGap="25%"
                        >
                            <XAxis
                                dataKey="subject"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    backgroundColor: '#1E2130',
                                    borderColor: '#2A2D3A',
                                    borderRadius: '8px',
                                    color: '#F1F5F9',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '12px'
                                }}
                                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Avg Score']}
                            />
                            <Bar dataKey="avg_score" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Custom Legend aligned to bottom left */}
            <div className="flex gap-4 text-xs font-semibold mt-4 px-2" id="chart-legend">
                <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                    <span>Average Class Score</span>
                </div>
            </div>
        </Card>
    );
};

export default ClassPerformanceChart;