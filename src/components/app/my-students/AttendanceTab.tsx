"use client";

import React, { useMemo } from 'react';
import { User } from 'lucide-react';
import { Student } from '@/types';

interface AttendanceTabProps {
  currentStudent: Student;
}

export default function AttendanceTab({ currentStudent }: AttendanceTabProps) {
  // Static Calendar Dates for June 2026
  const calendarDays = useMemo(() => {
    const days: Array<{ day: number; weekday: boolean; status: 'Present' | 'Absent' | 'Late' | 'Weekend' }> = [];
    const rand = (day: number) => {
      const density = currentStudent.attendanceRate / 100;
      if (density > 0.95) {
        return day % 12 === 0 ? 'Late' : 'Present';
      } else if (density > 0.88) {
        if (day % 10 === 0) return 'Late';
        if (day % 15 === 0) return 'Absent';
        return 'Present';
      } else {
        if (day % 7 === 0) return 'Absent';
        if (day % 11 === 0) return 'Late';
        return 'Present';
      }
    };

    for (let d = 1; d <= 30; d++) {
      const weekdayIndex = ((d - 1) % 7) + 1;
      const isWeekend = weekdayIndex === 6 || weekdayIndex === 7;
      days.push({
        day: d,
        weekday: !isWeekend,
        status: isWeekend ? 'Weekend' : rand(d)
      });
    }
    return days;
  }, [currentStudent]);

  const attendanceSummary = useMemo(() => {
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    calendarDays.forEach((day) => {
      if (day.status === 'Present') presentCount++;
      if (day.status === 'Absent') absentCount++;
      if (day.status === 'Late') lateCount++;
    });
    return { presentCount, absentCount, lateCount };
  }, [calendarDays]);

  return (
    <div className="space-y-6 animate-fadeIn" id="tab-attendance-content">
      {/* Calendar */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-heading">Monthly Attendance Ledger</h3>
            <p className="text-xs text-slate-400">June 2026 Academic Cycle</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500"></span>
              <span>Present ({attendanceSummary.presentCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500"></span>
              <span>Absent ({attendanceSummary.absentCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500"></span>
              <span>Late ({attendanceSummary.lateCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></span>
              <span>Weekend (8)</span>
            </div>
          </div>
        </div>

        {/* Day column headers */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 border-b border-[#2A2D3A] pb-2 mb-2 font-heading">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Monthly calendar matrix */}
        <div className="grid grid-cols-7 gap-2" id="attendance-calendar-grid">
          {calendarDays.map((day) => {
            let cellBg = 'bg-slate-800/10 text-slate-400 border border-[#2A2D3A]/50';
            let statusLabel = 'Wknd';

            if (day.status === 'Present') {
              cellBg = 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/20 hover:bg-emerald-500/15';
              statusLabel = 'P';
            } else if (day.status === 'Absent') {
              cellBg = 'bg-rose-500/10 text-rose-400 border-2 border-rose-500/20 hover:bg-rose-500/15 animate-pulse';
              statusLabel = 'A';
            } else if (day.status === 'Late') {
              cellBg = 'bg-amber-500/10 text-amber-400 border-2 border-amber-500/20 hover:bg-amber-500/15';
              statusLabel = 'L';
            }

            return (
              <div
                key={day.day}
                className={`h-16 rounded-lg p-2 flex flex-col justify-between transition text-left cursor-default ${cellBg}`}
              >
                <span className="text-xs font-bold font-mono">{day.day}</span>
                <span className="text-[10px] self-end font-bold uppercase tracking-wider">{statusLabel}</span>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="mt-6 pt-5 border-t border-[#2A2D3A]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <User size={14} className="text-slate-400" />
            <span className="font-semibold">Calculated Attendance Rate:</span>
            <strong className="text-orange-500 text-sm font-bold font-mono">
              {currentStudent.attendanceRate}%
            </strong>
          </div>
          <p className="text-slate-400 text-right leading-relaxed max-w-md">
            Calculated dynamically across the June 2026 instruction calendar day sheets. Grade 4 thresholds flags alerts under 90%.
          </p>
        </div>
      </div>
    </div>
  );
}