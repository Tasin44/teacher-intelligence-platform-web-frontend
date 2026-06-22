"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { Student } from '@/types';

interface ProfileAndFilterProps {
  students: Student[];
  currentStudent: Student;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectStudent: (id: string) => void;
  filteredStudents: Student[];
}

export default function ProfileAndFilter({
  students,
  currentStudent,
  searchQuery,
  setSearchQuery,
  onSelectStudent,
  filteredStudents
}: ProfileAndFilterProps) {
  return (
    <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="student-selector-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-orange-500 transition font-sans"
          />
          {searchQuery && (
            <div className="absolute left-0 right-0 top-12 mt-1 max-h-48 overflow-y-auto bg-[#1A1D27] border border-[#2A2D3A] rounded-lg z-20 shadow-xl divide-y divide-[#2A2D3A]/50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => {
                      onSelectStudent(student.id);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-slate-800 transition flex items-center gap-3 text-xs text-slate-300 border-0 bg-transparent cursor-pointer"
                  >
                    <img src={student.avatar} alt={student.name} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex-1 font-semibold">{student.name} ({student.grade})</div>
                  </button>
                ))
              ) : (
                <div className="p-2.5 text-xs text-slate-500 text-center">No students matched</div>
              )}
            </div>
          )}
        </div>

        {/* DROPDOWN SELECTOR */}
        <div className="flex items-center justify-end gap-3">
          <span className="text-xs font-semibold text-slate-400">Selected Profile:</span>
          <select
            value={currentStudent.id}
            onChange={(e) => onSelectStudent(e.target.value)}
            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition font-semibold"
          >
            {students.map((stud) => (
              <option key={stud.id} value={stud.id}>
                {stud.name} — {stud.grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Preview Bar */}
      <div className="mt-5 pt-5 border-t border-[#2A2D3A]/60 flex flex-col sm:flex-row items-center justify-between gap-4" id="student-preview-bar">
        <div className="flex items-center gap-4">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/20"
          />
          <div>
            <h4 className="font-bold text-base text-slate-100">{currentStudent.name}</h4>
            <p className="text-xs text-slate-400 font-medium">Grade 4 | Room 12 | Reading Code: {currentStudent.readingLevel}</p>
          </div>
        </div>
        <div>
          {currentStudent.riskLevel === 'At Risk' ? (
            <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              At Risk
            </span>
          ) : currentStudent.riskLevel === 'Advanced' ? (
            <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              Advanced
            </span>
          ) : (
            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              On Track
            </span>
          )}
        </div>
      </div>
    </div>
  );
}