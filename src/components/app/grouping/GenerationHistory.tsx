"use client";

import React from 'react';
import { Clock } from 'lucide-react';
import { GroupHistory } from '@/types';
import Card from '@/components/shared/Card';

interface GenerationHistoryProps {
    history: GroupHistory[];
    onRestore: (hist: GroupHistory) => void;
}

const GenerationHistory = ({ history, onRestore }: GenerationHistoryProps) => {
    return (
        <Card title='Generation History' subtitle='Review past cluster triggers or audit student migration history'>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                        <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Groups Formed</th>
                            <th className="pb-2">Trigger Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2D3A]/60">
                        {history.map((hist) => (
                            <tr key={hist.id} className="hover:bg-slate-800/10">
                                <td className="py-3 text-slate-300 font-bold">{hist.date}</td>
                                <td className="py-3 text-slate-400">{hist.groupsCreatedCount} Clusters Built</td>
                                <td className="py-3 text-slate-200 font-semibold">{hist.trigger}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default GenerationHistory;