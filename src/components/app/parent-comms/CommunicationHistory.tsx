import React from 'react';
import { Mail, MessageSquare, Award } from 'lucide-react';
import { ParentMessage } from '@/lib/api/parent-comms.api';
import Card from '@/components/shared/Card';

interface CommunicationHistoryProps {
    messages: ParentMessage[];
    setViewingHistoryItem: (item: ParentMessage) => void;
}

const CommunicationHistory = ({ messages, setViewingHistoryItem }: CommunicationHistoryProps) => {
    const getIcon = (type: string) => {
        if (type === 'concern') return <MessageSquare size={14} className="text-rose-500" />;
        if (type === 'achievement') return <Award size={14} className="text-emerald-500" />;
        return <Mail size={14} className="text-blue-500" />;
    };

    return (
        <Card title="Communication History" subtitle="Tracking email deliverables sent during the current Grade 4 term cycle">
            <div className="overflow-x-auto w-full max-w-full">
                <table className="w-full text-left text-xs text-slate-350 min-w-[650px]">
                    <thead>
                        <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                            <th className="pb-3 pr-4 whitespace-nowrap">Date Sent</th>
                            <th className="pb-3 px-4 whitespace-nowrap">Recipient Student</th>
                            <th className="pb-3 px-4 whitespace-nowrap">Classification</th>
                            <th className="pb-3 px-4 whitespace-nowrap">Tone Setting</th>
                            <th className="pb-3 pl-4 text-right whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2D3A]/10">
                        {messages.map((hist) => {
                            return (
                                <tr key={hist.message_id} className="hover:bg-slate-800/10 transition">
                                    <td className="py-3 text-slate-450 font-bold pr-4 whitespace-nowrap">{hist.sent_at ? new Date(hist.sent_at).toLocaleDateString() : 'Draft'}</td>
                                    <td className="py-3 text-slate-200 font-semibold px-4 whitespace-nowrap">{hist.student_name}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            {getIcon(hist.classification)}
                                            <span className="text-xs font-semibold capitalize text-slate-300">{hist.classification.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 uppercase text-[10px] font-extrabold text-slate-400 tracking-wider font-mono px-4 whitespace-nowrap">{hist.tone}</td>
                                    <td className="py-3 text-right pl-4 whitespace-nowrap">
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