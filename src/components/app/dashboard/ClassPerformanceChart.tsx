import Card from '@/components/shared/Card';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Math',
        Below: 25,
        'On Track': 60,
        Advanced: 32,
    },
    {
        name: 'Reading',
        Below: 18,
        'On Track': 68,
        Advanced: 32,
    },
    {
        name: 'Science',
        Below: 30,
        'On Track': 54,
        Advanced: 30,
    },
    {
        name: 'Soc. Studies',
        Below: 10,
        'On Track': 75,
        Advanced: 30,
    },
    {
        name: 'Writing',
        Below: 38,
        'On Track': 50,
        Advanced: 30,
    },
];

const ClassPerformanceChart = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] h-[380px] animate-pulse flex items-center justify-center">
                <span className="text-slate-400 text-sm font-sans">Loading Chart...</span>
            </div>
        );
    }

    return (
        <Card title='Class Performance' className="lg:col-span-7 flex flex-col justify-between">
            <div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                            barGap={6}
                            barCategoryGap="25%"
                        >
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'var(--font-sans)' }}
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
                            />
                            <Bar dataKey="Below" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={14} />
                            <Bar dataKey="On Track" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={14} />
                            <Bar dataKey="Advanced" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={14} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Custom Legend aligned to bottom left */}
            <div className="flex gap-4 text-xs font-semibold mt-4 px-2" id="chart-legend">
                <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                    <span>Below</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                    <span>On Track</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                    <span>Advanced</span>
                </div>
            </div>
        </Card>
    );
};

export default ClassPerformanceChart;