"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Student } from '@/types';
import TakeAttendanceModal from './TakeAttendanceModal';
import { getMonthlyAttendance, markAttendance, AttendanceStatus } from '@/lib/api/attendance.api';

interface AttendanceTabProps {
  currentStudent: Student;
}

const months = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' }
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 11 }, (_, i) => 1900 + i).reverse();

export default function AttendanceTab({ currentStudent }: AttendanceTabProps) {
  const [selectedMonth, setSelectedMonth] = useState(5); // June
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{ day: number; status: 'Present' | 'Absent' | 'Late' | 'Weekend' } | null>(null);
  const [attendanceOverrides, setAttendanceOverrides] = useState<Record<number, 'Present' | 'Absent' | 'Late' | 'Weekend'>>({});
  const [apiData, setApiData] = useState<Record<number, 'Present' | 'Absent' | 'Late' | 'Weekend'>>({});
  const [apiCalculatedRate, setApiCalculatedRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!currentStudent.student_id) return;
      try {
        const res = await getMonthlyAttendance(currentStudent.student_id, selectedYear, selectedMonth + 1);
        const mapped: Record<number, 'Present' | 'Absent' | 'Late' | 'Weekend'> = {};
        res.days.forEach(d => {
          const dateNum = parseInt(d.date.split('-')[2], 10);
          mapped[dateNum] = d.status === 'present' ? 'Present' : d.status === 'absent' ? 'Absent' : 'Late';
        });
        setApiData(mapped);
        setApiCalculatedRate(res.attendance_rate);
      } catch (err) {
        setApiData({});
        setApiCalculatedRate(null);
      }
    };
    fetchMonthlyData();
    setAttendanceOverrides({});
  }, [selectedMonth, selectedYear, currentStudent]);

  // Dynamic Calendar Dates based on selected Month and Year
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    
    // Day of the week for the 1st of the month
    // Date.getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
    // Our column headers are Mon, Tue, Wed, Thu, Fri, Sat, Sun.
    // Let's map it so Mon = 0, Tue = 1, ..., Sat = 5, Sun = 6.
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const days: Array<{ 
      day: number | null; 
      weekday: boolean; 
      status: 'Present' | 'Absent' | 'Late' | 'Weekend' | 'Empty' | 'None' 
    }> = [];

    // Add empty placeholders for the offset
    for (let i = 0; i < startOffset; i++) {
      days.push({
        day: null,
        weekday: false,
        status: 'Empty'
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(selectedYear, selectedMonth, d).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      let status: 'Present' | 'Absent' | 'Late' | 'Weekend' | 'None' = 'None';
      if (attendanceOverrides[d]) {
          status = attendanceOverrides[d];
      } else if (apiData[d]) {
          status = apiData[d];
      }
      
      days.push({
        day: d,
        weekday: !isWeekend,
        status: status
      });
    }
    return days;
  }, [selectedMonth, selectedYear, attendanceOverrides, apiData]);

  const attendanceSummary = useMemo(() => {
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let weekendCount = 0;
    calendarDays.forEach((day) => {
      if (day.status === 'Present') presentCount++;
      if (day.status === 'Absent') absentCount++;
      if (day.status === 'Late') lateCount++;
      if (day.status === 'Weekend') weekendCount++;
    });
    return { presentCount, absentCount, lateCount, weekendCount };
  }, [calendarDays]);

  const dateStr = selectedDay
    ? `${months[selectedMonth].label} ${selectedDay.day}, ${selectedYear}`
    : '';

  return (
    <div className="space-y-6 animate-fadeIn" id="tab-attendance-content">
      {/* Calendar */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-heading">Monthly Attendance Ledger</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2.5 py-1 text-xs text-slate-350 focus:outline-none focus:border-orange-500 transition font-semibold cursor-pointer"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2.5 py-1 text-xs text-slate-350 focus:outline-none focus:border-orange-500 transition font-semibold cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
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
              <span>Weekend ({attendanceSummary.weekendCount})</span>
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
          {calendarDays.map((day, idx) => {
            if (day.status === 'Empty' || day.day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="h-16 rounded-lg bg-transparent border border-transparent"
                />
              );
            }

            let cellBg = 'bg-[#0F1117] border border-[#2A2D3A] text-slate-400 hover:bg-slate-800/20';
            let statusLabel = '';

            if (day.status === 'Present') {
              cellBg = 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/20 hover:bg-emerald-500/15';
              statusLabel = 'P';
            } else if (day.status === 'Absent') {
              cellBg = 'bg-rose-500/10 text-rose-400 border-2 border-rose-500/20 hover:bg-rose-500/15 animate-pulse';
              statusLabel = 'A';
            } else if (day.status === 'Late') {
              cellBg = 'bg-amber-500/10 text-amber-400 border-2 border-amber-500/20 hover:bg-amber-500/15';
              statusLabel = 'L';
            } else if (day.status === 'Weekend') {
              cellBg = 'bg-slate-800/10 text-slate-400 border border-[#2A2D3A]/50';
              statusLabel = 'Wknd';
            }

            return (
              <div
                key={day.day}
                onClick={() => {
                  if (day.day !== null) {
                    setSelectedDay({ day: day.day, status: day.status as any });
                    setIsModalOpen(true);
                  }
                }}
                className={`h-16 rounded-lg p-2 flex flex-col justify-between transition text-left cursor-pointer hover:scale-[1.02] transform ${cellBg}`}
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
              {apiCalculatedRate !== null ? apiCalculatedRate.toFixed(1) : currentStudent.attendanceRate}%
            </strong>
          </div>
        </div>
      </div>

      {selectedDay && (
        <TakeAttendanceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDay(null);
          }}
          student={currentStudent}
          dateStr={dateStr}
          initialStatus={selectedDay.status === 'None' ? 'Present' : selectedDay.status as any}
          onSave={async (status, remarks) => {
            // Optimistic UI update
            setAttendanceOverrides((prev) => ({
              ...prev,
              [selectedDay.day]: status
            }));
            setIsModalOpen(false);
            
            // API Call
            if (currentStudent.student_roll && status !== 'Weekend') {
              try {
                const apiStatus = status === 'Present' ? 'present' : status === 'Absent' ? 'absent' : 'late';
                const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay.day).padStart(2, '0')}`;
                await markAttendance({
                  student_roll: currentStudent.student_roll,
                  attendance_date: formattedDate,
                  status: apiStatus as AttendanceStatus
                });
              } catch (err) {
                console.error('Failed to save attendance', err);
                // Could revert optimistic update on failure if needed
              }
            }
            setSelectedDay(null);
          }}
        />
      )}
    </div>
  );
}