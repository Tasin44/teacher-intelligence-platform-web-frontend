"use client";

import React, { useState } from 'react';
import { AlertOctagon, CheckCircle, Sparkles, CheckSquare, Square, Search } from 'lucide-react';
import { Student, PacingSuggestion, StandardsCoverage } from '@/types';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import Card from '@/components/shared/Card';
import CurriculumAdjustmentRecommendations from './CurriculumAdjustmentRecommendations';
import { getAssignments, ApiAssignment } from '@/lib/api/assignment.api';
import { getPacingRecommendations, generatePacing, PacingRecommendation, StandardCoverage } from '@/lib/api/pacing.api';

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
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
  const [topicId, setTopicId] = useState('');
  
  const [recommendations, setRecommendations] = useState<PacingRecommendation[]>([]);
  const [activeRecommendation, setActiveRecommendation] = useState<PacingRecommendation | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pacingState, setPacingState] = useState<'Behind' | 'On Track'>('Behind');

  // Load assignments and existing recommendations on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignRes, pacingRes] = await Promise.all([
          getAssignments() as any,
          getPacingRecommendations()
        ]);
        
        let assignmentList = [];
        if (Array.isArray(assignRes)) assignmentList = assignRes;
        else if (assignRes?.results) assignmentList = assignRes.results;
        
        setAssignments(assignmentList);
        setRecommendations(pacingRes);
        
        if (assignmentList.length > 0) {
          setTopicId(assignmentList[0].assignment_id.toString());
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchData();
  }, []);

  // Update active recommendation when topicId changes
  React.useEffect(() => {
    if (topicId) {
      const existing = recommendations.find(r => r.assignment_title === assignments.find(a => a.assignment_id.toString() === topicId)?.title);
      setActiveRecommendation(existing || null);
    }
  }, [topicId, recommendations, assignments]);

  const handleAnalyze = async () => {
    if (!topicId) return;
    setIsAnalyzing(true);
    try {
      const generated = await generatePacing(Number(topicId));
      setActiveRecommendation(generated);
      setRecommendations(prev => [generated, ...prev.filter(r => r.pacing_id !== generated.pacing_id)]);
      setPacingState('On Track');
      alert(`AI Engine has re-analyzed pacing metrics and recalibrated actual pacing guidelines against the core calendar!`);
    } catch (err) {
      console.error("Failed to generate pacing", err);
      alert("Failed to analyze pacing for this topic.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggle = (code: string) => {
    // This is currently read-only from the API, so toggle only affects local state.
    if (!activeRecommendation) return;
    setActiveRecommendation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        standards_coverage_checklist: prev.standards_coverage_checklist.map(st => 
          st.standard === code ? { ...st, covered: !st.covered } : st
        )
      };
    });
  };

  const coverageList = activeRecommendation?.standards_coverage_checklist || [];
  const coveredCount = coverageList.filter((c) => c.covered).length;
  const coveragePercent = coverageList.length > 0 ? Math.round((coveredCount / coverageList.length) * 100) : 0;

  return (
    <DashboardChildrenLayout
      title="Pacing & Curriculum"
      subtitle="Track curriculum pace and get AI-powered adjustment recommendations"
    >
      {/* Section 2 — Input + Status Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="w-full md:w-[55%] relative flex items-center">
          <label className="text-xs font-bold text-slate-400 tracking-wider uppercase font-heading shrink-0 mr-4">
            Current Lesson / Unit Topic
          </label>
          <div className="flex-1 relative">
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full bg-[#F4F6F9]/40 border border-slate-200 rounded-full pl-5 pr-10 py-3 text-xs text-slate-700 focus:outline-none focus:border-orange-500 font-medium appearance-none cursor-pointer shadow-sm"
            >
              {assignments.map(a => (
                <option key={a.assignment_id} value={a.assignment_id}>{a.title}</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
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

      {/* Section 4 — Two Columns: Adjustment Suggestions vs Standards Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column 60%: Curriculum Assessment Suggestions */}
        <div className="lg:col-span-7">
          <CurriculumAdjustmentRecommendations
            adjustmentText={activeRecommendation?.curriculum_adjustment}
          />
        </div>

        {/* Right Column 40%: Standards Coverage Tracker */}
        <div className="lg:col-span-5">
          <Card
            title="Standards Coverage Checklist"
            subtitle="Grade 4 fundamental math & syllabus thresholds checked"
            className="flex flex-col justify-between h-[420px]"
          >
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1.5" id="pacing-checklist">
              {coverageList.map((st) => (
                <div
                  key={st.standard}
                  className="bg-[#0F1117]/60 p-2.5 rounded-lg border border-[#2A2D3A]/40 flex items-start gap-2.5 hover:border-slate-700/60 transition cursor-pointer"
                  onClick={() => handleToggle(st.standard)}
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
                      <strong className="text-slate-205 font-bold font-mono">{st.standard}</strong>
                      <span className={`text-[8px] font-bold uppercase ${st.covered ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {st.covered ? 'Mastered' : 'In Progress'}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-snug truncate" title={st.notes}>
                      {st.notes}
                    </p>
                  </div>
                </div>
              ))}
              {coverageList.length === 0 && (
                <div className="text-slate-500 italic text-xs p-2">No standards covered.</div>
              )}
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
    </DashboardChildrenLayout>
  );
};

export default PacingCurriculumPage;
