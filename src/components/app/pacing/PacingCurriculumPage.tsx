"use client";

import React, { useState } from 'react';
import { AlertOctagon, CheckCircle, Sparkles, CheckSquare, Square, Search } from 'lucide-react';
import { Student, PacingSuggestion, StandardsCoverage } from '@/types';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import Card from '@/components/shared/Card';
import ExpectedVsActualPacingChart from './ExpectedVsActualPacingChart';
import CurriculumAdjustmentRecommendations from './CurriculumAdjustmentRecommendations';
import IndividualStudentProgressAlignments from './IndividualStudentProgressAlignments';

interface PacingCurriculumScreenProps {
  students: Student[];
  pacingSuggestions: PacingSuggestion[];
  standardsCoverageList: StandardsCoverage[];
  onApplyPacingSuggestion: (id: string) => void;
  onToggleStandardCoverage: (code: string) => void;
}

const PacingCurriculumPage = ({
  students,
  pacingSuggestions: initialSuggestions,
  standardsCoverageList: initialCoverage,
  onApplyPacingSuggestion,
  onToggleStandardCoverage
}: PacingCurriculumScreenProps) => {
  const [suggestions, setSuggestions] = useState<PacingSuggestion[]>(initialSuggestions);
  const [coverageList, setCoverageList] = useState<StandardsCoverage[]>(initialCoverage);
  const [unitInput, setUnitInput] = useState('Fractions Unit 4');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pacingState, setPacingState] = useState<'Behind' | 'On Track'>('Behind');

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setPacingState('On Track');
      alert(`AI Engine has re-analyzed ${unitInput} metrics and recalibrated actual pacing guidelines against the core calendar! Status updated: On Track!`);
    }, 1200);
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter((s) => s.id !== id));
    onApplyPacingSuggestion(id);
  };

  const handleToggle = (code: string) => {
    setCoverageList(
      coverageList.map((st) => {
        if (st.code === code) {
          const newCovered = !st.covered;
          return {
            ...st,
            covered: newCovered,
            status: newCovered ? 'Mastered' : 'In Progress'
          };
        }
        return st;
      })
    );
    onToggleStandardCoverage(code);
  };

  const coveredCount = coverageList.filter((c) => c.covered).length;
  const coveragePercent = Math.round((coveredCount / coverageList.length) * 100);

  return (
    <DashboardChildrenLayout
      title="Pacing & Curriculum"
      subtitle="Track curriculum pace and get AI-powered adjustment recommendations"
    >
      {/* Section 2 — Input + Status Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left Input areas */}
        <div className="w-full md:w-[55%] relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={unitInput}
            onChange={(e) => setUnitInput(e.target.value)}
            placeholder="Current Unit (e.g. Fractions Unit 4)"
            className="w-full bg-[#F4F6F9]/40 border border-slate-200 rounded-full pl-11 pr-4 py-3 text-xs text-slate-700 focus:outline-none focus:border-orange-500 font-medium placeholder-slate-400 shadow-sm"
          />
        </div>

        {/* Right Status layout */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 justify-end w-full md:w-auto mt-4 md:mt-0">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-accent-orange hover:bg-orange-600 disabled:opacity-40 text-white font-extrabold px-5 py-2.5 rounded-full text-xs tracking-wide transition shadow-lg shadow-orange-500/10 cursor-pointer border-0 flex items-center gap-2 shrink-0 h-10"
            id="btn-analyze-pacing"
          >
            <Sparkles size={13} fill="#FFF" stroke="#FFF" />
            {isAnalyzing ? 'Re-analyzing...' : 'Analyze Pacing'}
          </button>
        </div>
      </div>

      {/* Section 3 — Comparison Grouped Bar Chart */}
      <ExpectedVsActualPacingChart />

      {/* Section 4 — Two Columns: Adjustment Suggestions vs Standards Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column 60%: Curriculum Assessment Suggestions */}
        <div className="lg:col-span-7">
          <CurriculumAdjustmentRecommendations
            suggestions={suggestions}
            onApplySuggestion={handleDismissSuggestion}
          />
        </div>

        {/* Right Column 40%: Standards Coverage Tracker */}
        <div className="lg:col-span-5">
          <Card
            title="Standards Coverage Checklist"
            subtitle="Grade 4 fundamental math & syllabus thresholds checked"
            className="flex flex-col justify-between h-[390px]"
          >
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1.5" id="pacing-checklist">
              {coverageList.map((st) => (
                <div
                  key={st.code}
                  className="bg-[#0F1117]/60 p-2.5 rounded-lg border border-[#2A2D3A]/40 flex items-start gap-2.5 hover:border-slate-700/60 transition cursor-pointer"
                  onClick={() => handleToggle(st.code)}
                >
                  <button className="text-orange-500 mt-0.5 cursor-pointer bg-transparent border-0 p-0">
                    {st.covered ? (
                      <CheckSquare size={15} strokeWidth={2.5} />
                    ) : (
                      <Square size={15} />
                    )}
                  </button>
                  <div className="flex-1 text-[11px] select-none min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <strong className="text-slate-205 font-bold font-mono">{st.code}</strong>
                      <span className={`text-[8px] font-bold uppercase ${st.status === 'Mastered' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {st.status}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-snug truncate" title={st.name}>
                      {st.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#2A2D3A]/45 mt-4 text-xs font-semibold select-none">
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-400">Cumulative syllabus coverage:</span>
                <strong className="text-orange-500 font-mono text-sm leading-none">{coveredCount} of {coverageList.length} ({coveragePercent}%)</strong>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 select-none">
                <div className="h-full bg-accent-orange rounded-full transition-all duration-750" style={{ width: `${coveragePercent}%` }}></div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Section 5 — Per-Student Pacing Cards bottom */}
      <IndividualStudentProgressAlignments students={students} />
    </DashboardChildrenLayout>
  );
};

export default PacingCurriculumPage;
