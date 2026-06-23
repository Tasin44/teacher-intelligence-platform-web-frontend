import React from 'react';
import { Mail, X, Copy } from 'lucide-react';
import { Student, CommsHistory } from '@/types';
import { Button } from '../ui/button';

interface SentEmailRecordModalProps {
    isOpen: boolean;
    viewingHistoryItem: CommsHistory | null;
    viewingStudent: Student | null;
    viewingMessageBody: string;
    onClose: () => void;
    onCopy: () => void;
}

const SentEmailRecordModal = ({
    isOpen,
    viewingHistoryItem,
    viewingStudent,
    viewingMessageBody,
    onClose,
    onCopy
}: SentEmailRecordModalProps) => {
    if (!isOpen || !viewingHistoryItem || !viewingStudent) return null;

    return (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-xl w-full max-w-lg shadow-2xl p-6 relative animate-slideUp">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer bg-transparent border-0 p-1"
                >
                    <X size={16} />
                </button>

                <div className="flex items-center gap-2.5 mb-4">
                    <Mail className="text-orange-500" size={18} />
                    <h3 className="text-base font-bold text-slate-100 font-heading">Sent Email Record</h3>
                </div>

                <div className="space-y-3.5 mb-5 text-xs text-slate-350">
                    <div className="grid grid-cols-2 gap-4 bg-[#0F1117]/40 p-3 rounded-lg border border-[#2A2D3A]/50">
                        <div>
                            <span className="text-[10px] text-slate-505 uppercase font-mono block">Recipient Parent</span>
                            <strong className="text-slate-200 mt-0.5 block">
                                {viewingStudent.parentName} ({viewingStudent.name}'s parent)
                            </strong>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-505 uppercase font-mono block">Delivery Address</span>
                            <strong className="text-slate-200 mt-0.5 block">{viewingStudent.parentEmail}</strong>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div className="bg-[#0F1117]/30 p-2.5 rounded-lg border border-[#2A2D3A]/40">
                            <span className="text-[9px] text-slate-505 uppercase font-mono block">Sent Date</span>
                            <span className="font-semibold text-slate-300 block mt-0.5">{viewingHistoryItem.date}</span>
                        </div>
                        <div className="bg-[#0F1117]/30 p-2.5 rounded-lg border border-[#2A2D3A]/40 border-l-0">
                            <span className="text-[9px] text-slate-505 uppercase font-mono block">Classification</span>
                            <span className="font-semibold text-slate-300 block mt-0.5">{viewingHistoryItem.type}</span>
                        </div>
                        <div className="bg-[#0F1117]/30 p-2.5 rounded-lg border border-[#2A2D3A]/40 border-l-0">
                            <span className="text-[9px] text-slate-505 uppercase font-mono block">Tone Setting</span>
                            <span className="font-semibold text-slate-300 block mt-0.5 uppercase tracking-wider font-mono">
                                {viewingHistoryItem.tone}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#0F1117] rounded-lg p-3.5 border border-[#2A2D3A]">
                        <span className="text-[10px] text-slate-505 uppercase font-mono block mb-2">Dispatched Email Body</span>
                        <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-200 max-h-48 overflow-y-auto pr-1">
                            {viewingMessageBody}
                        </pre>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCopy}
                        className="px-4 py-2 border border-[#2A2D3A] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-lg transition duration-150 bg-transparent cursor-pointer flex items-center gap-1.5"
                    >
                        <Copy size={13} />
                        Copy Text
                    </button>
                    <Button
                        onClick={onClose}
                    >
                        Close View
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SentEmailRecordModal;