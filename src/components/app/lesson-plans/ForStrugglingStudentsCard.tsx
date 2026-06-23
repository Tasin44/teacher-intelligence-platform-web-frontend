"use client";
import { LessonSuggestion } from '@/types';

interface ForStrugglingStudentsCardProps {
    suggestion: LessonSuggestion;
    onApply: (suggestion: LessonSuggestion) => void;
    onDismiss?: () => void;
}

const tagStyles: Record<string, { bg: string, text: string, duration: string }> = {
    'Scaffolding': { bg: '#FAF5FF', text: '#9333EA', duration: '20 mins' },
    'Visual Aid': { bg: '#EFF6FF', text: '#2563EB', duration: '15 mins' },
    'Simplified Text': { bg: '#FFF7ED', text: '#EA580C', duration: '10 mins' },
    'Extension': { bg: '#F0FDF4', text: '#16A34A', duration: '25 mins' },
    'Challenge': { bg: '#EEF2FF', text: '#4F46E5', duration: '20 mins' },
    'Enrichment': { bg: '#F0FDFA', text: '#0D9488', duration: '15 mins' }
};

const ForStrugglingStudentsCard = ({
    suggestion,
    onApply,
    onDismiss
}: ForStrugglingStudentsCardProps) => {
    const handleDismissClick = () => {
        if (onDismiss) {
            onDismiss();
        } else {
            alert('Suggestion dismissed.');
        }
    };

    const styleInfo = tagStyles[suggestion.tag] || { bg: '#F1F5F9', text: '#475569', duration: '15 mins' };

    return (
        <div
            className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all duration-200 text-left min-h-[170px]"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
        >
            <div>
                <div className="flex justify-between items-center mb-3">
                    <span
                        className="font-bold px-2.5 py-1 rounded text-xs leading-none"
                        style={{ backgroundColor: styleInfo.bg, color: styleInfo.text }}
                    >
                        {suggestion.tag}
                    </span>
                    <span
                        className="text-xs text-slate-400 font-medium"
                        style={{ color: '#94A3B8' }}
                    >
                        {styleInfo.duration}
                    </span>
                </div>
                <p
                    className="text-sm text-slate-600 leading-relaxed font-normal mb-4"
                    style={{ color: '#475569' }}
                >
                    {suggestion.description}
                </p>
            </div>

            <div className="flex gap-2 justify-end pt-1">
                <button
                    onClick={handleDismissClick}
                    className="px-5 py-2 bg-brand-bg border border-slate-200 text-slate-650 hover:bg-slate-50 text-xs font-bold rounded transition cursor-pointer"
                    style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#475569' }}
                >
                    DISMISS
                </button>
                <button
                    onClick={() => onApply(suggestion)}
                    className="px-5 py-2 bg-accent-orange text-white text-xs font-bold rounded hover:opacity-90 transition cursor-pointer border-0"
                    style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
                >
                    Apply Modification
                </button>
            </div>
        </div>
    );
};

export default ForStrugglingStudentsCard;