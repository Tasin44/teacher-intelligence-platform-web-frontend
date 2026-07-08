"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Loader2, Edit2, Eye } from 'lucide-react';
import { ApiStudent, getStudents, RiskStatus } from '@/lib/api/student.api';
import EditStudentModal from '@/components/modal/EditStudentModal';

interface AllStudentsPageProps {
  onBack: () => void;
  onSelectStudent: (id: string) => void;
}

export default function AllStudentsPage({ onBack, onSelectStudent }: AllStudentsPageProps) {
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskStatus | ''>('');
  
  const [editingStudent, setEditingStudent] = useState<ApiStudent | null>(null);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await getStudents({
        search: search || undefined,
        risk_status: riskFilter || undefined
      });
      setStudents(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadStudents();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, riskFilter]);

  const getRiskBadge = (risk: RiskStatus) => {
    switch (risk) {
      case 'at_risk':
        return <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">At Risk</span>;
      case 'advance':
        return <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Advanced</span>;
      case 'developing':
        return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Developing</span>;
      default:
        return <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">On Track</span>;
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center gap-4 border-b border-[#2A2D3A] pb-4">
        <button
          onClick={onBack}
          className="p-2 bg-[#1E2130] hover:bg-slate-800 border border-[#2A2D3A] rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-100 font-heading">Student Directory</h2>
          <p className="text-xs text-slate-400">Comprehensive list of all enrolled students</p>
        </div>
      </div>

      <div className="bg-[#1E2130] p-5 rounded-xl border border-[#2A2D3A] flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search by name or roll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="text-slate-500 shrink-0" size={16} />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskStatus | '')}
            className="w-full sm:w-auto bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-orange-500 transition font-semibold"
          >
            <option value="">All Risk Tiers</option>
            <option value="on_track">On Track</option>
            <option value="at_risk">At Risk</option>
            <option value="advance">Advanced</option>
            <option value="developing">Developing</option>
          </select>
        </div>
      </div>

      <div className="bg-[#1E2130] rounded-xl border border-[#2A2D3A] overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 size={32} className="animate-spin text-orange-500" />
            <span className="text-sm font-semibold">Loading student directory...</span>
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto w-full max-w-full">
            <table className="w-full text-left text-xs text-slate-300 min-w-[800px]">
              <thead className="bg-[#0F1117] text-slate-400 font-semibold border-b border-[#2A2D3A]">
                <tr>
                  <th className="py-4 px-5">Student Name</th>
                  <th className="py-4 px-4">Roll No</th>
                  <th className="py-4 px-4">Grade</th>
                  <th className="py-4 px-4">Risk Level</th>
                  <th className="py-4 px-4">Avg Score</th>
                  <th className="py-4 px-4">Attendance</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2D3A]/60">
                {students.map((student) => (
                  <tr key={student.student_id} className="hover:bg-slate-800/20 transition group">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.student_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.student_name)}&background=2A2D3A&color=fff`} 
                          alt={student.student_name}
                          className="w-8 h-8 rounded-full object-cover border border-[#2A2D3A]"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200">{student.student_name}</span>
                          <span className="text-[10px] text-slate-500">Parent: {student.parent_name || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-orange-400/80">{student.student_roll}</td>
                    <td className="py-3 px-4 font-semibold">{student.student_grade}</td>
                    <td className="py-3 px-4">{getRiskBadge(student.risk_status)}</td>
                    <td className="py-3 px-4">
                      {student.avg_score ? (
                        <span className="font-bold text-slate-200">{parseFloat(student.avg_score).toFixed(1)}%</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {student.attendance_rate ? (
                        <span className="font-bold text-slate-200">{parseFloat(student.attendance_rate).toFixed(1)}%</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="inline-flex items-center gap-1.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 border border-slate-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer opacity-0 group-hover:opacity-100 mr-2"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => onSelectStudent(String(student.student_id))}
                        className="inline-flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Eye size={14} />
                        View Dashboard
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Search size={32} className="mb-3 opacity-20" />
            <span className="text-sm font-semibold">No students found matching your filters.</span>
          </div>
        )}
      </div>

      {editingStudent && (
        <EditStudentModal
          isOpen={true}
          onClose={() => setEditingStudent(null)}
          student={editingStudent}
          onSuccess={(updatedStudent) => {
            setStudents(prev => prev.map(s => s.student_id === updatedStudent.student_id ? updatedStudent : s));
          }}
        />
      )}
    </div>
  );
}
