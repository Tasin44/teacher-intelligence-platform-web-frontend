"use client";

import React from 'react';
import {
  Users,
  AlertTriangle,
  CheckCircle,
  Star,
  Plus,
  Boxes,
  FileSpreadsheet
} from 'lucide-react';
import { Student, AcademicRecord } from '@/types';

interface DashboardScreenProps {
  students: Student[];
  academicRecords: AcademicRecord[];
  onNavigate: (screen: 'dashboard' | 'students' | 'grouping' | 'assignments' | 'interventions' | 'lessons' | 'progress' | 'parent-comms' | 'pacing' | 'settings', subtab?: 'input' | 'ilp') => void;
  onOpenAddStudent: () => void;
  onOpenCreateAssignment: () => void;
  onSelectStudent: (id: string) => void;
}

export default function DashboardScreen({
  students,
  academicRecords,
  onNavigate,
  onOpenAddStudent,
  onOpenCreateAssignment,
  onSelectStudent
}: DashboardScreenProps) {
  // Stats
  const totalStudents = students.length;
  const atRiskCount = students.filter((s) => s.riskLevel === 'At Risk').length;
  const onTrackCount = students.filter((s) => s.riskLevel === 'On Track' || s.riskLevel === 'Developing').length;
  const advancedCount = students.filter((s) => s.riskLevel === 'Advanced').length;

  const handleStudentClick = (studentId: string) => {
    onSelectStudent(studentId);
    onNavigate('students', 'ilp');
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="dashboard-container">
      {/* Welcome Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="welcome-row">
        <div>
          <h2 className="text-3xl font-bold font-heading text-slate-100 tracking-tight" id="welcome-heading">
            Good morning, Ms. Johnson 👋
          </h2>
          <p className="text-sm text-slate-400 mt-1 font-sans" id="welcome-subtext">
            Monday, June 16, 2026 — Grade 4 | Room 12
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-700/50" id="classroom-indicator">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Active Session</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="stat-cards-grid">
        {/* Card 1: Total */}
        <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] transition h-full flex flex-col justify-between hover:border-orange-500/30" id="stat-card-total">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-400">Total Students</span>
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-500">
              <Users size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-slate-100 tracking-tight">{totalStudents}</h3>
            <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
              <span>●</span> 2 new this month
            </p>
          </div>
        </div>

        {/* Card 2: At Risk */}
        <button
          onClick={() => onNavigate('students', 'input')}
          className="bg-[#1E2130] text-left p-6 rounded-xl border border-[#2A2D3A] transition h-full flex flex-col justify-between hover:border-rose-500/40 cursor-pointer"
          id="stat-card-risk"
        >
          <div className="flex justify-between items-start mb-4 w-full">
            <span className="text-sm font-medium text-slate-400">At Risk</span>
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-rose-500 tracking-tight">{atRiskCount}</h3>
            <p className="text-xs text-rose-500 mt-2 font-medium flex items-center gap-1">
              <span>●</span> Needs immediate attention
            </p>
          </div>
        </button>

        {/* Card 3: On Track */}
        <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] transition h-full flex flex-col justify-between hover:border-emerald-500/30" id="stat-card-track">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-400">On Track</span>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-emerald-500 tracking-tight">{onTrackCount}</h3>
            <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
              <span>●</span> Performing as expected
            </p>
          </div>
        </div>

        {/* Card 4: Advanced */}
        <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] transition h-full flex flex-col justify-between hover:border-blue-500/30" id="stat-card-advanced">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-400">Advanced</span>
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Star size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-500 tracking-tight">{advancedCount}</h3>
            <p className="text-xs text-blue-400 mt-2 font-medium flex items-center gap-1">
              <span>●</span> Above grade level
            </p>
          </div>
        </div>
      </div>

      {/* Row 3 - Performance & Standards Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="charts-and-table-row">
        {/* Left 60%: Class Performance (SVG Bar Chart) */}
        <div className="lg:col-span-7 bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="performance-chart-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-100">Class Performance</h3>
              <p className="text-xs text-slate-400">Average Scores across fundamental modules</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold" id="chart-legend">
              <div className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Below</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>On Track</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-500">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Advanced</span>
              </div>
            </div>
          </div>

          {/* Styled Bar Chart Widget */}
          <div className="h-68 flex flex-col justify-between" id="performance-bars-container">
            {/* Grid Y-Axis references */}
            <div className="relative flex-1 flex flex-col justify-between border-b border-[#2A2D3A] pb-2">
              <div className="absolute inset-x-0 top-0 border-t border-[#2A2D3A]/40 text-[10px] text-slate-500 pt-1 pointer-events-none">100%</div>
              <div className="absolute inset-x-0 top-1/4 border-t border-[#2A2D3A]/40 text-[10px] text-slate-500 pt-1 pointer-events-none">75%</div>
              <div className="absolute inset-x-0 top-2/4 border-t border-[#2A2D3A]/40 text-[10px] text-slate-500 pt-1 pointer-events-none">50%</div>
              <div className="absolute inset-x-0 top-3/4 border-t border-[#2A2D3A]/40 text-[10px] text-slate-500 pt-1 pointer-events-none">25%</div>

              {/* Dynamic Columns */}
              <div className="h-full flex justify-around items-end pt-5 relative z-10">
                {/* Math Column */}
                <div className="flex flex-col items-center group w-12">
                  <span className="text-xs font-bold text-orange-500 mb-1 group-hover:scale-110 duration-150">68%</span>
                  <div className="w-8 bg-orange-500 rounded-t-md transition-all duration-500 group-hover:brightness-110" style={{ height: '68%' }}></div>
                </div>
                {/* Reading Column */}
                <div className="flex flex-col items-center group w-12">
                  <span className="text-xs font-bold text-orange-500 mb-1 group-hover:scale-110 duration-150">78%</span>
                  <div className="w-8 bg-orange-500 rounded-t-md transition-all duration-500 group-hover:brightness-110" style={{ height: '78%' }}></div>
                </div>
                {/* Science Column */}
                <div className="flex flex-col items-center group w-12">
                  <span className="text-xs font-bold text-orange-500 mb-1 group-hover:scale-110 duration-150">84%</span>
                  <div className="w-8 bg-orange-500 rounded-t-md transition-all duration-500 group-hover:brightness-110" style={{ height: '84%' }}></div>
                </div>
                {/* Social Studies Column */}
                <div className="flex flex-col items-center group w-12">
                  <span className="text-xs font-bold text-orange-500 mb-1 group-hover:scale-110 duration-150">72%</span>
                  <div className="w-8 bg-orange-500 rounded-t-md transition-all duration-500 group-hover:brightness-110" style={{ height: '72%' }}></div>
                </div>
                {/* Writing Column */}
                <div className="flex flex-col items-center group w-12">
                  <span className="text-xs font-bold text-orange-500 mb-1 group-hover:scale-110 duration-150">63%</span>
                  <div className="w-8 bg-orange-500 rounded-t-md transition-all duration-500 group-hover:brightness-110" style={{ height: '63%' }}></div>
                </div>
              </div>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-around text-xs font-medium text-slate-400 mt-2 pt-1 border-t border-[#2A2D3A]/20" id="x-axis-labels">
              <span className="w-12 text-center text-[11px]">Math</span>
              <span className="w-12 text-center text-[11px]">Reading</span>
              <span className="w-12 text-center text-[11px]">Science</span>
              <span className="w-12 text-center text-[11px]">S. Studies</span>
              <span className="w-12 text-center text-[11px]">Writing</span>
            </div>
          </div>
        </div>

        {/* Right 40%: Standards Mastery */}
        <div className="lg:col-span-5 bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col justify-between" id="standards-mastery-card">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-100 mb-1">Standards Mastery</h3>
            <p className="text-xs text-slate-400 mb-4">Latest diagnostic benchmarks</p>
            
            <div className="overflow-x-auto" id="mastery-table-container">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                    <th className="pb-2">Student Name</th>
                    <th className="pb-2">Standard</th>
                    <th className="pb-2 text-right">Mastery %</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2D3A]/60">
                  <tr className="hover:bg-slate-800/25 transition">
                    <td className="py-2.5 font-medium text-slate-200">
                      <button onClick={() => handleStudentClick('s6')} className="hover:text-amber-500 transition cursor-pointer text-left font-semibold">
                        Marcus Thompson
                      </button>
                    </td>
                    <td className="py-2.5 text-slate-400">CCSS.Math.3.OA</td>
                    <td className="py-2.5 text-right font-medium">44%</td>
                    <td className="py-2.5 text-right">
                      <span className="bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Not Started
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/25 transition">
                    <td className="py-2.5 font-medium text-slate-200">
                      <button onClick={() => handleStudentClick('s11')} className="hover:text-amber-500 transition cursor-pointer text-left font-semibold">
                        Carlos Mendez
                      </button>
                    </td>
                    <td className="py-2.5 text-slate-400">CCSS.Math.3.OA</td>
                    <td className="py-2.5 text-right font-medium">76%</td>
                    <td className="py-2.5 text-right">
                      <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        In Progress
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/25 transition">
                    <td className="py-2.5 font-medium text-slate-200">
                      <button onClick={() => handleStudentClick('s1')} className="hover:text-amber-500 transition cursor-pointer text-left font-semibold">
                        Alisha Patel
                      </button>
                    </td>
                    <td className="py-2.5 text-slate-400">CCSS.Math.4.OA</td>
                    <td className="py-2.5 text-right font-medium">95%</td>
                    <td className="py-2.5 text-right">
                      <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Mastered
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/25 transition">
                    <td className="py-2.5 font-medium text-slate-200">
                      <button onClick={() => handleStudentClick('s7')} className="hover:text-amber-500 transition cursor-pointer text-left font-semibold">
                        Devon R.
                      </button>
                    </td>
                    <td className="py-2.5 text-slate-400">CCSS.ELA.RI.4.1</td>
                    <td className="py-2.5 text-right font-medium">48%</td>
                    <td className="py-2.5 text-right">
                      <span className="bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Not Started
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <button
            onClick={() => onNavigate('progress')}
            className="w-full text-center text-xs font-semibold text-orange-500 hover:text-orange-400 hover:underline pt-4 mt-2 border-t border-[#2A2D3A]/50 bg-transparent border-0 cursor-pointer"
          >
            Go to Progress Tracking →
          </button>
        </div>
      </div>

      {/* Row 4 - Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="activity-and-actions-row">
        {/* Left 60%: Recent Activity */}
        <div className="lg:col-span-7 bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="recent-activity-card">
          <h3 className="text-lg font-bold font-heading text-slate-100 mb-1">Recent Activity</h3>
          <p className="text-xs text-slate-400 mb-4">Latest administrative and AI-generated triggers</p>

          <div className="space-y-4" id="recent-activity-list">
            <div className="flex items-center gap-3 py-1.5 border-b border-[#2A2D3A]/40 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-200">
                  <strong className="text-rose-400 font-semibold">[Alert]</strong> Devon R. fell below critical score thresholds over standard CCSS.Math.3.OA
                </p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">10 mins ago</span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-1.5 border-b border-[#2A2D3A]/40 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-200">
                  <strong className="text-emerald-400 font-semibold">[Pacing]</strong> AI recommended 2 pacing modifications to alleviate Math schedule blockpages
                </p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">2 hours ago</span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-1.5 border-b border-[#2A2D3A]/40 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-200">
                  <strong className="text-blue-400 font-semibold">[Student Plan]</strong> Regulated Custom Individualized Learning Plan generated for Marcus Thompson
                </p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">1 day ago</span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-1.5 border-b border-[#2A2D3A]/40 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-200">
                  <strong className="text-amber-400 font-semibold">[Grouping]</strong> AI Groupings auto-updated: Marcus Thompson sorted to Group D (At Risk)
                </p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">2 days ago</span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0"></span>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-200">
                  <strong className="text-slate-400 font-semibold">[Parent Comms]</strong> Progress Update email template drafted for Alisha Patel
                </p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">3 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 40%: Quick Actions */}
        <div className="lg:col-span-5 bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="quick-actions-card">
          <h3 className="text-lg font-bold font-heading text-slate-100 mb-1">Quick Actions</h3>
          <p className="text-xs text-slate-400 mb-5">Common tasks with one-click routing</p>

          <div className="flex flex-col gap-3" id="quick-actions-buttons">
            <button
              onClick={onOpenAddStudent}
              className="h-12 w-full flex items-center justify-center gap-2 hover:opacity-90 transition rounded-lg font-semibold tracking-wider text-sm bg-orange-500 text-slate-900 shadow-lg shadow-orange-500/10 border-0 cursor-pointer"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add Student
            </button>

            <button
              onClick={() => onNavigate('grouping')}
              className="h-12 w-full flex items-center justify-center gap-2 hover:bg-orange-500/10 transition rounded-lg font-semibold tracking-wider text-sm bg-transparent border border-orange-500 text-orange-500 cursor-pointer"
            >
              <Boxes size={18} />
              Generate Groups
            </button>

            <button
              onClick={onOpenCreateAssignment}
              className="h-12 w-full flex items-center justify-center gap-2 hover:bg-orange-500/10 transition rounded-lg font-semibold tracking-wider text-sm bg-transparent border border-orange-500 text-orange-500 cursor-pointer"
            >
              <FileSpreadsheet size={18} />
              Create Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
