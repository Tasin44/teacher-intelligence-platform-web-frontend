import Card from '@/components/shared/Card';
import React, { useState, useEffect } from 'react';
import { getBestSubject, BestSubject } from '@/lib/api/dashboard.api';

const StandardsMastery = () => {
    const [data, setData] = useState<BestSubject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBestSubject().then(res => {
            setData(res);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const getStatus = (score: number) => {
        if (score >= 90) return { label: 'Mastered', className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' };
        if (score >= 70) return { label: 'On Track', className: 'bg-blue-500/10 text-blue-400 border border-blue-500/25' };
        if (score >= 50) return { label: 'In Progress', className: 'bg-amber-500/10 text-amber-550 dark:text-amber-400 border border-amber-500/25' };
        return { label: 'Needs Help', className: 'bg-rose-500/10 text-rose-400 border border-rose-500/25' };
    };
    return (
        <Card title="Student Best Subjects" className="lg:col-span-5 flex flex-col justify-between">
            <div>
                <div className="overflow-x-auto" id="mastery-table-container">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                            <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                                <th className="pb-3.5 pr-4 text-left font-bold tracking-wider whitespace-nowrap">Student Name</th>
                                <th className="pb-3.5 px-4 text-left font-bold tracking-wider whitespace-nowrap">Best Subject</th>
                                <th className="pb-3.5 px-4 text-left font-bold tracking-wider whitespace-nowrap">Avg Score</th>
                                <th className="pb-3.5 pl-4 text-right font-bold tracking-wider whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2D3A]/10">
                            {loading ? (
                                <tr><td colSpan={4} className="py-8 text-center text-slate-500">Loading...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={4} className="py-8 text-center text-slate-500">No subject data found.</td></tr>
                            ) : data.map((row, i) => {
                                const status = getStatus(row.avg_score);
                                return (
                                <tr key={i} className="hover:bg-slate-800/15 transition">
                                    <td className="py-4 pr-4 font-semibold text-slate-100 text-sm whitespace-nowrap">{row.student_name}</td>
                                    <td className="py-4 px-4 text-slate-400/90 text-sm font-medium whitespace-nowrap capitalize">{row.best_subject}</td>
                                    <td className="py-4 px-4 text-left font-bold text-slate-200 text-sm whitespace-nowrap">{row.avg_score.toFixed(1)}%</td>
                                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block tracking-wide ${status.className}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
};

export default StandardsMastery;