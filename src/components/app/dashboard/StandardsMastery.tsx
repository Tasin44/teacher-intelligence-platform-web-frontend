import Card from '@/components/shared/Card';
import React from 'react'

const masteryData = [
    {
        student: 'Sofia M.',
        standard: 'A.1',
        percentage: '92%',
        status: 'Mastered',
        statusColorClass: 'bg-emerald-500/10 text-emerald-500'
    },
    {
        student: 'Marcus T.',
        standard: 'R.1',
        percentage: '45%',
        status: 'In Progress',
        statusColorClass: 'bg-orange-500/10 text-orange-500'
    },
    {
        student: 'Aiden K.',
        standard: 'A.2',
        percentage: '78%',
        status: 'In Progress',
        statusColorClass: 'bg-orange-500/10 text-orange-500'
    },
    {
        student: 'Lily R.',
        standard: 'R.5',
        percentage: '12%',
        status: 'Not Started',
        statusColorClass: 'bg-rose-500/10 text-rose-500'
    },
    {
        student: 'Noah P.',
        standard: 'W.1',
        percentage: '96%',
        status: 'Mastered',
        statusColorClass: 'bg-emerald-500/10 text-emerald-500'
    }
];

const StandardsMastery = () => {
    return (
        <Card title='Standards Mastery' className="lg:col-span-5 flex flex-col justify-between">
            <div>
                <div className="overflow-x-auto" id="mastery-table-container">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                            <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                                <th className="pb-3 text-left">Student</th>
                                <th className="pb-3 text-left">Standard</th>
                                <th className="pb-3 text-center">%</th>
                                <th className="pb-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2D3A]/60">
                            {masteryData.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-800/15 transition">
                                    <td className="py-3 font-semibold text-slate-200">{row.student}</td>
                                    <td className="py-3 text-slate-400">{row.standard}</td>
                                    <td className="py-3 text-center font-medium text-slate-200">{row.percentage}</td>
                                    <td className="py-3 text-right">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.statusColorClass}`}>
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
    )
}

export default StandardsMastery