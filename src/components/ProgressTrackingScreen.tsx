"use client";

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  AlertOctagon,
  Award,
  Activity
} from 'lucide-react';
import { Student } from '@/types';

interface ProgressTrackingScreenProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onNavigate: (screen: 'dashboard' | 'students' | 'grouping' | 'assignments' | 'interventions' | 'lessons' | 'progress' | 'parent-comms' | 'pacing' | 'settings', subtab?: 'input' | 'ilp') => void;
}

export default function ProgressTrackingScreen({
  students,
  selectedStudentId,
  onSelectStudent,
  onNavigate
}: ProgressTrackingScreenProps) {
  const [dateRange, setDateRange] = useState('June 1 - June 15, 2026');

  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="progress-tracking-container">
      {/* Section 1 — Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            Progress Tracking
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Audit student performance trends, standards mastery progressions, and attendance cycles</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Student Selector */}
          <select
            value={currentStudent.id}
            onChange={(e) => onSelectStudent(e.target.value)}
            className="bg-[#1E2130] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-orange-500 font-sans"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} — Progress Report
              </option>
            ))}
          </select>

          {/* Date Range Picker */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#1E2130] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-orange-500 font-sans"
          >
            <option value="June 1 - June 15, 2026">June 1 - June 15, 2026</option>
            <option value="May 1 - May 30, 2026">May 1 - May 30, 2026</option>
            <option value="Full Semester">Full Semester 2026</option>
          </select>
        </div>
      </div>

      {/* Section 2 — Alert Banner */}
      <div className="bg-[#EF4444]/10 border border-[#EF4444]/40 p-4.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold" id="progress-risk-banner">
        <div className="flex items-center gap-3 text-rose-400 font-sans">
          <AlertOctagon size={18} className="text-rose-500 shrink-0" />
          <p className="leading-relaxed">
            <strong>Devon R.</strong> has shown a serious <strong>12% score decline</strong> over the last 3 weeks — Intervention and review recommended.
          </p>
        </div>
        <button
          onClick={() => onNavigate('interventions')}
          className="text-orange-500 hover:text-orange-400 font-bold hover:underline self-end sm:self-auto uppercase tracking-wider text-[11px] bg-transparent border-0 cursor-pointer"
        >
          Create Intervention →
        </button>
      </div>

      {/* Section 3 — Progress Summary Cards (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="progress-summary-cards">
        {/* Card 1: Overall Growth Rate */}
        <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="progress-card-trend">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Overall Growth Rate</span>
            <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wide flex items-center gap-1">
              <TrendingUp size={11} /> Improved
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-100 font-mono tracking-tight">+8.2%</h3>
            <p className="text-xs text-slate-400 mt-2">Class improvement average this month</p>
          </div>
        </div>

        {/* Card 2: Standards Mastered */}
        <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="progress-card-standards">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 font-sans">Standards Mastered</span>
            <span className="bg-orange-500/10 text-orange-400 font-bold px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wide">
              12 of 20 Max
            </span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold mb-1 mr-1">
              <span className="text-slate-300">Completion Coefficient</span>
              <strong className="text-orange-500 font-mono text-sm leading-none">60%</strong>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1.5Box">
              <div className="h-full bg-orange-500 rounded-full transition-all duration-750" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 3: Attendance Rate */}
        <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="progress-card-attendance">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Class Attendance Rate</span>
            <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-0.5 rounded text-[10px] font-mono">
              Grade 4 Target
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-emerald-400 font-mono tracking-tight">89.4%</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">Compliance guidelines met successfully</p>
          </div>
        </div>
      </div>

      {/* Section 4 — Multi-Line Score Progress Chart (Custom SVG) */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="score-chart-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-100">Score Over Time ({currentStudent.name})</h3>
            <p className="text-xs text-slate-400">Interactive weekly diagnostic benchmarks across fundamental modules</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold" id="subject-chart-legend">
            <div className="flex items-center gap-1.5 text-orange-500">
              <span className="w-3 h-1.5 rounded-full bg-orange-500"></span>
              <span>Math ({currentStudent.mathScore}%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-500">
              <span className="w-3 h-1.5 rounded-full bg-blue-500"></span>
              <span>Reading ({currentStudent.id === 's1' ? 95 : 68}%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-3 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Science ({currentStudent.id === 's1' ? 92 : 74}%)</span>
            </div>
          </div>
        </div>

        {/* Custom SVG MultiLine Chart Widget */}
        <div className="h-72 w-full flex flex-col justify-between" id="visual-polyline-canvas">
          <div className="flex-1 relative border-b border-[#2A2D3A] pb-2">
            {/* Grid references background */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
              <div className="border-t border-[#2A2D3A]/30 w-full text-[9px] text-slate-505 pt-0.5">100%</div>
              <div className="border-t border-[#2A2D3A]/30 w-full text-[9px] text-slate-505 pt-0.5">75%</div>
              <div className="border-t border-[#2A2D3A]/30 w-full text-[9px] text-slate-505 pt-0.5">50%</div>
              <div className="border-t border-[#2A2D3A]/30 w-full text-[9px] text-slate-505 pt-0.5">25%</div>
              <div className="border-t border-[#2A2D3A]/30 w-full text-[9px] text-slate-505 pt-0.5">0%</div>
            </div>

            {/* SVG plotting lines */}
            <svg className="absolute inset-0 w-full h-full overflow-visible z-10" id="visual-svg-canvas">
              <polyline
                fill="none"
                stroke="#F97316"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={
                  currentStudent.riskLevel === 'At Risk'
                    ? "20,180 80,165 140,190 200,175 260,160 320,185 380,170 440,195 500,210"
                    : currentStudent.riskLevel === 'Advanced'
                    ? "20,30 80,25 140,35 200,20 260,40 320,30 380,25 440,30 500,20"
                    : "20,120 80,110 140,125 200,95 260,105 320,115 380,85 440,95 500,90"
                }
                style={{ vectorEffect: 'non-scaling-stroke' }}
                className="transition-all duration-500 drop-shadow-[0_2px_4px_rgba(249,115,22,0.15)]"
              />
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={
                  currentStudent.riskLevel === 'At Risk'
                    ? "20,150 80,155 140,140 200,145 260,130 320,145 380,135 440,150 500,160"
                    : currentStudent.riskLevel === 'Advanced'
                    ? "20,50 80,45 140,40 200,35 260,50 320,30 380,45 440,30 500,40"
                    : "20,110 80,105 140,95 200,100 260,85 320,90 380,80 440,85 500,75"
                }
                style={{ vectorEffect: 'non-scaling-stroke' }}
                className="transition-all duration-500"
              />
              <polyline
                fill="none"
                stroke="#22C55E"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={
                  currentStudent.riskLevel === 'At Risk'
                    ? "15,160 80,140 140,150 200,130 260,145 320,120 380,135 440,125 500,140"
                    : currentStudent.riskLevel === 'Advanced'
                    ? "15,40 80,30 140,35 200,45 260,25 320,35 380,20 440,30 500,20"
                    : "15,100 80,95 140,90 200,105 260,80 320,85 380,70 440,65 500,60"
                }
                style={{ vectorEffect: 'non-scaling-stroke' }}
                className="transition-all duration-500"
              />

              <circle cx="260" cy={currentStudent.riskLevel === 'At Risk' ? "160" : currentStudent.riskLevel === 'Advanced' ? "40" : "105"} r="6" fill="#F97316" stroke="#1E2130" strokeWidth="2" className="animate-pulse" />
              
              <g transform={`translate(${currentStudent.riskLevel === 'At Risk' ? '250, 110' : '230, 65'})`} className="font-sans">
                <rect width="90" height="36" rx="4" fill="#1A1D27" stroke="#F97316" strokeWidth="1" />
                <text x="8" y="15" fill="#94A3B8" fontSize="8" fontWeight="bold">Week 5 Core Math</text>
                <text x="8" y="27" fill="#F1F5F9" fontSize="10" fontWeight="bold">Score: {currentStudent.riskLevel === 'At Risk' ? '51%' : currentStudent.riskLevel === 'Advanced' ? '89%' : '76%'}</text>
              </g>
            </svg>
          </div>

          {/* X Axis labels */}
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2.5 z-10" id="progress-weeks-labels">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
            <span className="text-orange-500 font-bold border-b border-orange-500/40">Week 5 (Marker)</span>
            <span>Week 6</span>
            <span>Week 7</span>
            <span>Week 8</span>
            <span>Week 9 (Est)</span>
          </div>
        </div>
      </div>

      {/* Section 5 — Two Columns: Standards Mastery vs Attendance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="progress-footer-row">
        {/* Left Column 60%: Standards Mastery Progress */}
        <div className="lg:col-span-7 bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="standards-progress-card">
          <h3 className="text-base font-bold font-heading text-slate-100 mb-1.5 flex items-center gap-1.5">
            <Award size={16} className="text-orange-500" />
            Standards Mastery Progress
          </h3>
          <p className="text-xs text-slate-400 mb-4 font-sans">Latest individual benchmarks tracked across current unit modules</p>

          <div className="space-y-4" id="standards-progress-list">
            {[
              { code: 'CCSS.Math.3.OA.A.1', desc: 'Interpret multiplication grids and grouping sequences', progress: 85, status: 'Mastered', color: 'bg-emerald-500' },
              { code: 'CCSS.Math.3.OA.A.3', desc: 'Solve word problems involving products and divisions', progress: 70, status: 'Mastered', color: 'bg-emerald-500' },
              { code: 'CCSS.Math.3.NF.A.1', desc: 'Understand fundamental unit shares as fraction components', progress: 45, status: 'In Progress', color: 'bg-blue-500' },
              { code: 'CCSS.Math.3.NF.A.2', desc: 'Represent fractions on visual standard horizontal number lines', progress: 20, status: 'In Progress', color: 'bg-blue-500' },
              { code: 'CCSS.ELA.RI.4.1', desc: 'Formulate paragraph summaries connecting reading inferences', progress: 60, status: 'Mastered', color: 'bg-emerald-500' },
              { code: 'NGSS.4-LS1-1', desc: 'Define internal vascular plant and animal ecosystem organs', progress: 95, status: 'Mastered', color: 'bg-emerald-500' }
            ].map((st, idx) => (
              <div key={idx} className="space-y-1 bg-[#0F1117]/30 p-2.5 rounded-lg border border-[#2A2D3A]/40">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{st.code}</span>
                    <span className="text-[10px] text-slate-550 max-w-xs truncate font-medium hidden md:block">
                      ({st.desc})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-300">{st.progress}%</span>
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${st.status === 'Mastered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {st.status}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1 select-none">
                  <div className={`h-full ${st.color} rounded-full transition-all`} style={{ width: `${st.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column 40%: Attendance Trend */}
        <div className="lg:col-span-5 bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col justify-between" id="attendance-trend-card">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-100 mb-1 flex items-center gap-1.5">
              <Activity size={16} className="text-orange-500" />
              Attendance Trend
            </h3>
            <p className="text-xs text-slate-400 mb-5 font-sans">Calculated ratios and weekday trend variations</p>

            {/* Attendance Mini bar chart */}
            <div className="h-32 flex justify-around items-end gap-3 px-4 border-b border-[#2A2D3A]/40 pb-3" id="attendance-bar-chart">
              {[
                { week: 'Wk 1', ratio: 92, color: 'bg-emerald-500/80 hover:bg-emerald-500' },
                { week: 'Wk 2', ratio: 88, color: 'bg-emerald-500/80 hover:bg-emerald-500' },
                { week: 'Wk 3', ratio: 79, color: 'bg-rose-500/70 hover:bg-rose-500 animate-pulse' },
                { week: 'Wk 4', ratio: 95, color: 'bg-emerald-500/80 hover:bg-emerald-500' }
              ].map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer">
                  <span className="text-[10px] font-bold text-[#F1F5F9] mb-1 group-hover:scale-110 duration-150 font-mono">
                    {b.ratio}%
                  </span>
                  <div className={`w-8 ${b.color} rounded-sm transition-all duration-350`} style={{ height: `${b.ratio}%` }}></div>
                  <span className="text-[9px] text-slate-500 mt-2 font-semibold uppercase">{b.week}</span>
                </div>
              ))}
            </div>

            {/* Summary statistics */}
            <div className="grid grid-cols-3 gap-2 text-center pt-5 text-xs font-semibold" id="attendance-trend-legend">
              <div>
                <span className="text-[10px] text-emerald-400 block font-bold">Present Rate</span>
                <strong className="text-sm font-bold text-slate-200 mt-1 block font-mono">72%</strong>
              </div>
              <div>
                <span className="text-[10px] text-rose-550 block font-bold">Absent Rate</span>
                <strong className="text-sm font-bold text-slate-200 mt-1 block font-mono">11%</strong>
              </div>
              <div>
                <span className="text-[10px] text-amber-550 block font-bold">Late Rate</span>
                <strong className="text-sm font-bold text-slate-200 mt-1 block font-mono">17%</strong>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 text-center leading-relaxed mt-4 pt-4 border-t border-[#2A2D3A]/30 font-medium">
            Calculated across Grade 4 classroom logs. Flag triggers are distributed instantly to counseling administrators.
          </p>
        </div>
      </div>
    </div>
  );
}
