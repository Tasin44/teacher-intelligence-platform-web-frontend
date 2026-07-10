import React from 'react';
import { Copy, Download, Send } from 'lucide-react';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';

interface PreviewDraftMessageProps {
    generatedMessage: string;
    setGeneratedMessage: (msg: string) => void;
    handleCopy: () => void;
    handleSendEmail: () => void;
    handleExportPdf?: () => void;
}

const PreviewDraftMessage = ({ generatedMessage, setGeneratedMessage, handleCopy, handleSendEmail, handleExportPdf }: PreviewDraftMessageProps) => {
    return (
        <Card title='Preview Draft Message' actionElements={
            <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono border border-emerald-500/15">
                ✦ AI Generated
            </span>
        }>


            {/* Textarea inside */}
            <div className="bg-[#0F1117] rounded-lg p-4 border border-[#2A2D3A]" id="monospace-text-area">
                <textarea
                    rows={10}
                    value={generatedMessage}
                    onChange={(e) => setGeneratedMessage(e.target.value)}
                    className="w-full bg-transparent text-slate-100 text-xs focus:outline-none resize-none font-mono leading-relaxed"
                />
            </div>

            {/* Bottom action row */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3">
                <span className="text-[10px] text-slate-500 font-mono">
                    Editing mode active. You may customize text lines before emailing.
                </span>
                <div className="flex gap-3">
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 border border-[#2A2D3A] hover:bg-slate-850 text-slate-355 hover:text-slate-500 text-xs font-bold rounded-lg transition duration-150 bg-transparent cursor-pointer flex items-center gap-1.5"
                    >
                        <Copy size={13} />
                        Copy Message
                    </button>
                    <button
                        onClick={handleExportPdf}
                        className="px-4 py-2 border border-[#2A2D3A] hover:bg-slate-850 text-slate-355 hover:text-slate-500 text-xs font-bold rounded-lg transition duration-150 bg-transparent cursor-pointer flex items-center gap-1.5 border-r-0"
                    >
                        <Download size={13} />
                        Export PDF
                    </button>
                    <Button
                        onClick={handleSendEmail}
                    >
                        <Send size={13} />
                        Send via Email
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default PreviewDraftMessage;