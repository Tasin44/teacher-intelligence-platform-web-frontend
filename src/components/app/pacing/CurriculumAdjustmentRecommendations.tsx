import React from 'react';
import { Sparkles } from 'lucide-react';
import Card from '@/components/shared/Card';

interface CurriculumAdjustmentRecommendationsProps {
  adjustmentText?: string;
}

const CurriculumAdjustmentRecommendations = ({
  adjustmentText
}: CurriculumAdjustmentRecommendationsProps) => {
  return (
    <Card
      title="Curriculum Adjustment Recommendations"
      subtitle="AI-calculated syllabus compressions to realign lessons and recover delayed instructional dates"
      className="flex flex-col justify-between h-[420px]"
      actionElements={<Sparkles size={16} className="text-orange-500 animate-pulse" />}
    >
      <div className="space-y-4 max-h-64 overflow-y-auto pr-1 text-slate-300 text-sm leading-relaxed" id="suggestions-box">
        {adjustmentText ? (
          <div className="whitespace-pre-wrap">{adjustmentText}</div>
        ) : (
          <div className="text-slate-500 italic text-xs">No adjustment recommendations available.</div>
        )}
      </div>
    </Card>
  );
};

export default CurriculumAdjustmentRecommendations;