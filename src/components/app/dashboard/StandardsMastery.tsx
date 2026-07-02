import Card from '@/components/shared/Card';
import React from 'react';

const masteryData = [
    {
        student: 'Sofia M.',
        standard: 'CCSS.Math.3.OA',
        percentage: '92%',
        status: 'Mastered',
        statusColorClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
    },
    {
        student: 'Marcus T.',
        standard: 'CCSS.Math.3.OA',
        percentage: '45%',
        status: 'In Progress',
        statusColorClass: 'bg-amber-500/10 text-amber-550 dark:text-amber-400 border border-amber-500/25'
    },
    {
        student: 'Aiden K.',
        standard: 'CCSS.Math.4.OA',
        percentage: '78%',
        status: 'In Progress',
        statusColorClass: 'bg-amber-500/10 text-amber-550 dark:text-amber-400 border border-amber-500/25'
    },
    {
        student: 'Lily R.',
        standard: 'CCSS.ELA.RI.4.1',
        percentage: '12%',
        status: 'Not Started',
        statusColorClass: 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
    },
    {
        student: 'Noah P.',
        standard: 'CCSS.Math.4.OA',
        percentage: '95%',
        status: 'Mastered',
        statusColorClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
    }
];

const StandardsMastery = () => {
    return (
        <Card title="Standards Mastery" className="lg:col-span-5 flex flex-col justify-between">
            <div>
                <div className="overflow-x-auto" id="mastery-table-container">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                            <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                                <th className="pb-3.5 pr-4 text-left font-bold tracking-wider whitespace-nowrap">Student Name</th>
                                <th className="pb-3.5 px-4 text-left font-bold tracking-wider whitespace-nowrap">Standard</th>
                                <th className="pb-3.5 px-4 text-left font-bold tracking-wider whitespace-nowrap">Mastery %</th>
                                <th className="pb-3.5 pl-4 text-right font-bold tracking-wider whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2D3A]/10">
                            {masteryData.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-800/15 transition">
                                    <td className="py-4 pr-4 font-semibold text-slate-100 text-sm whitespace-nowrap">{row.student}</td>
                                    <td className="py-4 px-4 text-slate-400/90 text-sm font-medium whitespace-nowrap">{row.standard}</td>
                                    <td className="py-4 px-4 text-left font-bold text-slate-200 text-sm whitespace-nowrap">{row.percentage}</td>
                                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block tracking-wide ${row.statusColorClass}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
};

export default StandardsMastery;