import React from 'react';
import { Sparkles } from 'lucide-react';
import { PacingSuggestion } from '@/types';
import Card from '@/components/shared/Card';

interface CurriculumAdjustmentRecommendationsProps {
  suggestions: PacingSuggestion[];
  onApplySuggestion: (id: string) => void;
}

const CurriculumAdjustmentRecommendations = ({
  suggestions,
  onApplySuggestion
}: CurriculumAdjustmentRecommendationsProps) => {
  return (
    <Card
      title="Curriculum Adjustment Recommendations"
      subtitle="AI-calculated syllabus compressions to realign lessons and recover delayed instructional dates"
      className="flex flex-col justify-between h-[420px]"
      actionElements={<Sparkles size={16} className="text-orange-500 animate-pulse" />}
    >
      <div className="space-y-4 max-h-64 overflow-y-auto pr-1" id="suggestions-box">
        {suggestions.map((sug) => (
          <div key={sug.id} className="bg-[#0F1117] p-4 rounded-xl border border-[#2A2D3A]/60 hover:border-orange-500/10 transition flex gap-3">
            <div className="mt-1 shrink-0">
              {sug.priority === 'High' ? (
                <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono tracking-wide">
                  High
                </span>
              ) : (
                <span className="bg-blue-500/10 text-blue-505 border border-blue-505/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono tracking-wide">
                  Medium
                </span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">{sug.suggestion}</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] pt-1">
                <span className="text-slate-500 font-mono break-all sm:break-normal">Standards: {sug.standardsImpacted}</span>
                <button
                  onClick={() => onApplySuggestion(sug.id)}
                  className="text-[10px] font-bold text-orange-500 hover:text-orange-400 cursor-pointer bg-transparent border-0 shrink-0"
                >
                  Apply Suggestion
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CurriculumAdjustmentRecommendations;