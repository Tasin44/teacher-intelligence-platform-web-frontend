import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle,
  AlertOctagon,
  Calendar,
  CheckSquare,
  Square,
  ChevronRight,
  User,
  Sliders
} from 'lucide-react';
import { Student, PacingSuggestion, StandardsCoverage } from '@/types';

interface PacingCurriculumScreenProps {
  students: Student[];
  pacingSuggestions: PacingSuggestion[];
  standardsCoverageList: StandardsCoverage[];
  onApplyPacingSuggestion: (id: string) => void;
  onToggleStandardCoverage: (code: string) => void;
}

export default function PacingCurriculumScreen({
  students,
  pacingSuggestions: initialSuggestions,
  standardsCoverageList: initialCoverage,
  onApplyPacingSuggestion,
  onToggleStandardCoverage
}: PacingCurriculumScreenProps) {
  const [suggestions, setSuggestions] = useState<PacingSuggestion[]>(initialSuggestions);
  const [coverageList, setCoverageList] = useState<StandardsCoverage[]>(initialCoverage);
  const [unitInput, setUnitInput] = useState('Fractions Unit 4');
  const [weekInput, setWeekInput] = useState(4);
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

  // Covered count
  const coveredCount = coverageList.filter((c) => c.covered).length;
  const coveragePercent = Math.round((coveredCount / coverageList.length) * 100);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="pacing-root-container">
      {/* Section 1 — Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            Pacing & Curriculum
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Compare classroom progression against state lesson models and unlock pacing modifications</p>
        </div>
      </div>

      {/* Section 2 — Input + Status Bar */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6" id="pacing-billboard">
        {/* Left Input areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 font-heading">Current Lesson Unit</label>
            <input
              type="text"
              value={unitInput}
              onChange={(e) => setUnitInput(e.target.value)}
              className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 font-heading">Current Cycle Week</label>
            <input
              type="number"
              value={weekInput}
              onChange={(e) => setWeekInput(Number(e.target.value))}
              max="9"
              min="1"
              className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono font-bold"
            />
          </div>
        </div>

        {/* Right Status layout */}
        <div className="flex flex-col sm:flex-row items-center gap-4.5 shrink-0 justify-end pt-4 xl:pt-0 border-t xl:border-t-0 border-[#2A2D3A]/45">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 hidden sm:block">Calculated Schedule Index:</span>
            {pacingState === 'Behind' ? (
              <span className="bg-rose-500/15 text-rose-500 border border-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider animate-pulse flex items-center gap-2">
                <AlertOctagon size={13} />
                Behind Schedule
              </span>
            ) : (
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle size={13} />
                On Schedule
              </span>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-[#F97316] hover:bg-orange-600 disabled:opacity-40 text-slate-900 font-extrabold px-5 py-2.5 rounded-lg text-xs tracking-wide transition shadow-lg shadow-orange-500/10 cursor-pointer border-0 flex items-center gap-1.5 shrink-0"
            id="btn-analyze-pacing"
          >
            <Sparkles size={11} fill="#000" />
            {isAnalyzing ? 'Re-analyzing...' : 'Analyze Pacing'}
          </button>
        </div>
      </div>

      {/* Section 3 — Comparison Grouped Bar Chart (Custom SVG) */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="pacing-chart-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-100">Expected vs Actual Pacing</h3>
            <p className="text-xs text-slate-400">Number of CCSS standard coverage milestones completed by instruction week</p>
          </div>
          <div className="flex gap-4 text-xs font-semibold" id="pacing-chart-legend">
            <div className="flex items-center gap-1.5 text-orange-500">
              <span className="w-3.5 h-1.5 rounded-sm bg-[#F97316]"></span>
              <span>Expected Standard Target</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-500">
              <span className="w-3.5 h-1.5 rounded-sm bg-[#3B82F6]"></span>
              <span>Actual Standard Progress</span>
            </div>
          </div>
        </div>

        {/* Grouped Bar Chart Visual */}
        <div className="h-64 flex flex-col justify-between" id="visual-pacing-chart">
          <div className="flex-1 relative border-b border-[#2A2D3A] pb-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-slate-500">
              <div className="border-t border-[#2A2D3A]/30 pt-0.5">10 Standards</div>
              <div className="border-t border-[#2A2D3A]/25 pt-0.5">7 Standards</div>
              <div className="border-t border-[#2A2D3A]/25 pt-0.5">5 Standards</div>
              <div className="border-t border-[#2A2D3A]/25 pt-0.5">2 Standards</div>
              <div className="border-t border-[#2A2D3A]/20 pt-0.5">0</div>
            </div>

            {/* Plot Rows */}
            <div className="h-full flex justify-around items-end pt-6 relative z-10">
              {[
                { expected: 2, actual: 2, label: 'Wk 1' },
                { expected: 3, actual: 4, label: 'Wk 2' },
                { expected: 5, actual: 5, label: 'Wk 3' },
                { expected: 6, actual: 4, label: 'Wk 4' }, // Current: Behind point (Expected: 6, Actual: 4)
                { expected: 7, actual: 5, label: 'Wk 5' },
                { expected: 8, actual: 6, label: 'Wk 6' },
                { expected: 9, actual: 7, label: 'Wk 7' },
                { expected: 10, actual: 8, label: 'Wk 8' }
              ].map((week, idx) => (
                <div key={idx} className="flex flex-col items-center group w-12 text-center select-none">
                  <div className="flex items-end justify-center gap-1">
                    {/* Expected bar */}
                    <div
                      className="w-3 bg-orange-500 rounded-t-sm hover:brightness-115 transition-all duration-300"
                      style={{ height: `${week.expected * 15}px` }}
                      title={`Expected: ${week.expected}`}
                    ></div>
                    {/* Actual bar */}
                    <div
                      className="w-3 bg-blue-500 rounded-t-sm hover:brightness-115 transition-all duration-300"
                      style={{ height: `${week.actual * 15}px` }}
                      title={`Actual: ${week.actual}`}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-450 mt-1.5 font-bold uppercase">
                    {week.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 — Two Columns: Adjustment Suggestions vs Standards Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="pacing-remedy-grid">
        {/* Left Column 60%: Curriculum Assessment Suggestions */}
        <div className="lg:col-span-7 bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col justify-between" id="pacing-suggestions-card">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-100 mb-1 flex items-center gap-2">
              <Sparkles size={16} className="text-orange-500 animate-spin" />
              Curriculum Adjustment Recommendations
            </h3>
            <p className="text-xs text-slate-400 mb-5">AI-calculated syllabus compressions to realign lessons and recover delayed instructional dates</p>

            <div className="space-y-4" id="suggestions-box">
              {suggestions.map((sug) => (
                <div key={sug.id} className="bg-[#0F1117] p-4.5 rounded-xl border border-[#2A2D3A]/60 hover:border-orange-500/10 transition flex gap-3">
                  <div className="mt-1 shrink-0">
                    {sug.priority === 'High' ? (
                      <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono tracking-wide">
                        High
                      </span>
                    ) : (
                      <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono tracking-wide">
                        Medium
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs text-slate-205 leading-relaxed">{sug.suggestion}</p>
                    <div className="flex justify-between items-center text-[10px] pt-1">
                      <span className="text-slate-500 font-mono">Standards: {sug.standardsImpacted}</span>
                      <button
                        onClick={() => handleDismissSuggestion(sug.id)}
                        className="text-[10px] font-bold text-orange-500 hover:text-orange-400 cursor-pointer bg-transparent border-0"
                      >
                        Apply Suggestion
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column 40%: Standards Coverage Tracker */}
        <div className="lg:col-span-5 bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col justify-between" id="standards-checklist-card">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-100 mb-1.5 flex items-center gap-1.5">
              <CheckSquare size={16} className="text-orange-500" />
              Standards Coverage Checklist
            </h3>
            <p className="text-xs text-slate-400 mb-5">Grade 4 fundamental math & syllabus thresholds checked</p>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1.5" id="pacing-checklist">
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
                  <div className="flex-1 text-[11px] select-none">
                    <div className="flex justify-between items-center mb-0.5">
                      <strong className="text-slate-250 font-bold font-mono">{st.code}</strong>
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
          </div>

          <div className="pt-4 border-t border-[#2A2D3A]/45 mt-4 text-xs font-semibold select-none">
            <div className="flex justify-between mb-1.5">
              <span className="text-slate-450">Cumulative syllabus coverage:</span>
              <strong className="text-orange-500 font-mono text-sm leading-none">{coveredCount} of {coverageList.length} ({coveragePercent}%)</strong>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 select-none">
              <div className="h-full bg-[#F97316] rounded-full transition-all duration-750" style={{ width: `${coveragePercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5 — Per-Student Pacing Cards bottom */}
      <div className="space-y-4" id="pacing-student-slider">
        <h3 className="text-base font-bold text-slate-100 font-heading">Individual Student Progress Alignments</h3>

        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin" style={{ WebkitOverflowScrolling: 'touch' }}>
          {students.map((stud) => {
            const levelColor =
              stud.riskLevel === 'At Risk'
                ? 'text-rose-500 bg-rose-500/10'
                : stud.riskLevel === 'Advanced'
                  ? 'text-blue-500 bg-blue-500/10'
                  : 'text-emerald-500 bg-emerald-500/10';

            const coveredCountMock = stud.riskLevel === 'At Risk' ? 8 : stud.riskLevel === 'Advanced' ? 17 : 12;
            const percentageMock = Math.round((coveredCountMock / 20) * 100);

            return (
              <div
                key={stud.id}
                className="flex-shrink-0 w-52 bg-[#1E2130] p-4.5 rounded-xl border border-[#2A2D3A] flex flex-col justify-between h-42 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={stud.avatar}
                    alt={stud.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#2A2D3A]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-150 truncate leading-tight w-28" title={stud.name}>
                      {stud.name}
                    </h4>
                    <span className={`px-2 py-0.2 rounded-full text-[8px] font-extrabold uppercase mt-1 inline-block ${levelColor}`}>
                      {stud.riskLevel === 'At Risk' ? 'Behind' : stud.riskLevel === 'Advanced' ? 'Ahead' : 'On Track'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 mt-3 select-none">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400">Mastery covered</span>
                    <span className="text-orange-400 font-mono">{coveredCountMock}/20</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden select-none">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-350" style={{ width: `${percentageMock}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
