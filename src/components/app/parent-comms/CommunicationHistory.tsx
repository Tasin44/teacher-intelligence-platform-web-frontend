import React from 'react';
import { Student, CommsHistory } from '@/types';
import Card from '@/components/shared/Card';

interface CommunicationHistoryProps {
    commsHistoryList: CommsHistory[];
    students: Student[];
    setViewingHistoryItem: (item: CommsHistory) => void;
}

const CommunicationHistory = ({ commsHistoryList, students, setViewingHistoryItem }: CommunicationHistoryProps) => {
    return (
        <Card title="Communication History" subtitle="Tracking email deliverables sent during the current Grade 4 term cycle">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-350">
                    <thead>
                        <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                            <th className="pb-3">Date Sent</th>
                            <th className="pb-3">Recipient Student</th>
                            <th className="pb-3">Classification</th>
                            <th className="pb-3">Tone Setting</th>
                            <th className="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2D3A]/10">
                        {commsHistoryList.map((hist) => {
                            const studentName = students.find((s) => s.id === hist.studentId)?.name || 'Marcus Thompson';
                            return (
                                <tr key={hist.id} className="hover:bg-slate-800/10 transition">
                                    <td className="py-3 text-slate-450 font-bold">{hist.date}</td>
                                    <td className="py-3 text-slate-200 font-semibold">{studentName}</td>
                                    <td className="py-3">
                                        {hist.type === 'Concern' ? (
                                            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                                Concern
                                            </span>
                                        ) : hist.type === 'Achievement' ? (
                                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                                Achievement
                                            </span>
                                        ) : (
                                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                                Progress Update
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 uppercase text-[10px] font-extrabold text-slate-400 tracking-wider font-mono">{hist.tone}</td>
                                    <td className="py-3 text-right">
                                        <button
                                            onClick={() => setViewingHistoryItem(hist)}
                                            className="text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline bg-transparent border-0 cursor-pointer"
                                        >
                                            View Copy
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default CommunicationHistory;