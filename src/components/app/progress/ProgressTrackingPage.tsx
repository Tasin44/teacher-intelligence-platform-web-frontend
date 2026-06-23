"use client";

import React, { useState, useMemo } from 'react';
import { AlertOctagon } from 'lucide-react';
import { Student } from '@/types';
import ProgressTrackingStats from './ProgressTrackingStats';
import ScoreOverTimeChart from './ScoreOverTimeChart';
import StandardsMasteryProgress from './StandardsMasteryProgress';
import AttendanceTrend from './AttendanceTrend';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';

interface ProgressTrackingScreenProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onNavigate: (screen: 'dashboard' | 'students' | 'grouping' | 'assignments' | 'interventions' | 'lessons' | 'progress' | 'parent-comms' | 'pacing' | 'settings', subtab?: 'input' | 'ilp') => void;
}

const ProgressTrackingPage = ({
  students,
  selectedStudentId,
  onSelectStudent,
  onNavigate
}: ProgressTrackingScreenProps) => {
  const [dateRange, setDateRange] = useState('June 1 - June 15, 2026');

  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  return (
    <DashboardChildrenLayout title='Progress Tracking' subtitle='Audit student performance trends, standards mastery progressions, and attendance cycles'>
      {/* Section 1 — Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Student Selector */}
          <select
            value={currentStudent.id}
            onChange={(e) => onSelectStudent(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
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
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-650 focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
          >
            <option value="June 1 - June 15, 2026">June 1 - June 15, 2026</option>
            <option value="May 1 - May 30, 2026">May 1 - May 30, 2026</option>
            <option value="Full Semester">Full Semester 2026</option>
          </select>
        </div>
      </div>

      {/* Section 2 — Alert Banner */}
      <div className="bg-[#FEF2F2] border border-[#FEE2E2] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold text-[#991B1B] rounded-lg" id="progress-risk-banner">
        <div className="flex items-center gap-3">
          <AlertOctagon size={18} className="text-[#EF4444] shrink-0" />
          <p className="leading-relaxed">
            Student is below critical 40% class decline (for the last 5 weeks — intervention will be recommended).
          </p>
        </div>
        <button
          onClick={() => onNavigate('interventions')}
          className="bg-[#EF4444] hover:bg-red-650 text-white font-extrabold px-4 py-2 rounded-md uppercase tracking-wider text-[11px] cursor-pointer shadow-sm border-0 shrink-0 transition"
        >
          Create Intervention
        </button>
      </div>

      {/* Section 3 — Progress Summary Cards (3 cards) */}
      <ProgressTrackingStats studentName={currentStudent.name} />

      {/* Section 4 — Charts Row (Score Over Time & Attendance Trend) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="progress-charts-row">
        {/* Left Column 67%: Score Over Time Chart */}
        <div className="lg:col-span-8">
          <ScoreOverTimeChart studentName={currentStudent.name} />
        </div>

        {/* Right Column 33%: Attendance Trend */}
        <div className="lg:col-span-4">
          <AttendanceTrend />
        </div>
      </div>

      {/* Section 5 — Standards Mastery Progress (Full width) */}
      <StandardsMasteryProgress />
    </DashboardChildrenLayout>
  );
};

export default ProgressTrackingPage;
