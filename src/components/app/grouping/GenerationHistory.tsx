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
            <div className="overflow-x-auto w-full max-w-full">
                <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
                    <thead>
                        <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                            <th className="pb-2 whitespace-nowrap pr-4">Date</th>
                            <th className="pb-2 whitespace-nowrap px-4">Groups Formed</th>
                            <th className="pb-2 whitespace-nowrap pl-4">Trigger Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2D3A]/20">
                        {history.map((hist) => (
                            <tr key={hist.id} className="hover:bg-slate-800/10">
                                <td className="py-3 text-slate-300 font-bold whitespace-nowrap pr-4">{hist.date}</td>
                                <td className="py-3 text-slate-400 whitespace-nowrap px-4">{hist.groupsCreatedCount} Clusters Built</td>
                                <td className="py-3 text-slate-200 font-semibold pl-4">{hist.trigger}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default GenerationHistory;