"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { AlertOctagon, Search, X } from 'lucide-react';
import { Student } from '@/types';
import ProgressTrackingStats from './ProgressTrackingStats';
import ScoreOverTimeChart from './ScoreOverTimeChart';
import AttendanceTrend from './AttendanceTrend';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import { 
  getStudentOverallProgress, 
  getStudentAttendanceTrend, 
  getStudentWeeklyScores, 
  getClassAttendance,
  StudentOverallProgress,
  MonthlyAttendance,
  WeeklyScore,
  ClassAttendance
} from '@/lib/api/progress.api';

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
  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const [searchQuery, setSearchQuery] = useState(currentStudent?.name || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [overallProgress, setOverallProgress] = useState<StudentOverallProgress | null>(null);
  const [attendanceTrend, setAttendanceTrend] = useState<MonthlyAttendance[]>([]);
  const [weeklyScores, setWeeklyScores] = useState<WeeklyScore[]>([]);
  const [classAttendance, setClassAttendance] = useState<ClassAttendance | null>(null);

  useEffect(() => {
    if (currentStudent) {
      setSearchQuery(currentStudent.name);
      const studentId = Number(currentStudent.id.replace(/\D/g, '')) || 1; // Fallback to 1 if NaN
      
      Promise.all([
        getStudentOverallProgress(studentId),
        getStudentAttendanceTrend(studentId),
        getStudentWeeklyScores(studentId),
        getClassAttendance()
      ]).then(([overall, trend, weekly, clsAtt]) => {
        setOverallProgress(overall);
        setAttendanceTrend(trend);
        setWeeklyScores(weekly);
        setClassAttendance(clsAtt);
      }).catch(err => console.error("Failed to fetch progress data", err));
    }
  }, [currentStudent]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    return students.filter(st =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  return (
    <DashboardChildrenLayout title='Progress Tracking' subtitle='Track student growth, standard mastery, assessment trends, and attendance to identify students who needs additional support or enrichment.'>
      {/* Section 1 — Header Row */}
        <div className="w-full max-w-2xl">
          {/* Search Student Selector */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className="bg-white border w-full border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsDropdownOpen(true);
                  }}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 bg-transparent border-0 p-0 cursor-pointer flex items-center"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto z-50 py-1">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          onSelectStudent(st.id);
                          setSearchQuery(st.name);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-orange-500/10 hover:text-orange-600 font-semibold transition cursor-pointer flex items-center justify-between border-0 ${
                          st.id === currentStudent.id ? 'bg-orange-500/5 text-orange-500' : 'text-slate-700'
                        }`}
                      >
                        <span>{st.name}</span>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                          {st.riskLevel}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-400 italic">No students found</div>
                  )}
                </div>
              </>
            )}
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
      <ProgressTrackingStats 
        overallProgress={overallProgress}
        classAttendance={classAttendance}
      />

      {/* Section 4 — Charts Row (Score Over Time & Attendance Trend) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Left Column 67%: Score Over Time Chart */}
        <div>
          <ScoreOverTimeChart 
            studentName={currentStudent.name} 
            weeklyScores={weeklyScores} 
          />
        </div>

        {/* Right Column 33%: Attendance Trend */}
        <div >
          <AttendanceTrend attendanceTrend={attendanceTrend} />
        </div>
      </div>
    </DashboardChildrenLayout>
  );
};

export default ProgressTrackingPage;
