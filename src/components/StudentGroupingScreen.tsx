"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  Sliders,
  Check,
  X,
  Edit2,
  Clock
} from 'lucide-react';
import { Student, Group, GroupHistory } from '@/types';

interface StudentGroupingScreenProps {
  students: Student[];
  groups: Group[];
  history: GroupHistory[];
  onRegenerateGroups: () => void;
  onUpdateGroups?: (groups: Group[]) => void;
  onNavigate: (screen: 'dashboard' | 'students' | 'grouping' | 'assignments' | 'interventions' | 'lessons' | 'progress' | 'parent-comms' | 'pacing' | 'settings', subtab?: 'input' | 'ilp') => void;
  onSelectStudent: (id: string) => void;
}

export default function StudentGroupingScreen({
  students,
  groups,
  history,
  onRegenerateGroups,
  onUpdateGroups,
  onNavigate,
  onSelectStudent
}: StudentGroupingScreenProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState('AI Engine successfully optimized student groups based on latest academic matrices!');

  // Group Edit States
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editName, setEditName] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editType, setEditType] = useState<'Advanced' | 'On Track' | 'Developing' | 'At Risk'>('On Track');
  const [editColor, setEditColor] = useState('#3B82F6');
  const [editStudentIds, setEditStudentIds] = useState<string[]>([]);

  const handleOpenEditGroup = (group: Group) => {
    setEditingGroup(group);
    setEditName(group.name);
    setEditTag(group.tag);
    setEditType(group.type);
    setEditColor(group.color);
    setEditStudentIds(group.studentIds);
  };

  const handleToggleStudentInEdit = (studentId: string) => {
    if (editStudentIds.includes(studentId)) {
      setEditStudentIds(editStudentIds.filter(id => id !== studentId));
    } else {
      setEditStudentIds([...editStudentIds, studentId]);
    }
  };

  const handleSaveGroup = () => {
    if (!editingGroup) return;
    if (!editName.trim()) return;

    const updatedGroup: Group = {
      ...editingGroup,
      name: editName,
      tag: editTag,
      type: editType,
      color: editColor,
      borderColor: editColor,
      studentIds: editStudentIds,
      avgScore: editStudentIds.length > 0
        ? Math.round(
            students
              .filter((s) => editStudentIds.includes(s.id))
              .reduce((acc, curr) => acc + curr.avgScore, 0) / editStudentIds.length
          )
        : editingGroup.avgScore
    };

    if (onUpdateGroups) {
      onUpdateGroups(groups.map((g) => (g.id === editingGroup.id ? updatedGroup : g)));
    }
    setEditingGroup(null);
    setSuccessToastMessage(`Cohort "${editName}" configurations successfully modified and saved!`);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onRegenerateGroups();
      setIsGenerating(false);
      setSuccessToastMessage('AI Engine successfully optimized student groups based on latest academic matrices!');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    }, 1500);
  };

  const handleStudentAvatarClick = (studentId: string) => {
    onSelectStudent(studentId);
    onNavigate('students', 'ilp');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="student-grouping-container">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 border border-emerald-400 text-slate-900 font-bold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-50 py-3 block animate-bounce">
          <Check size={18} strokeWidth={3} />
          <span>{successToastMessage}</span>
        </div>
      )}

      {/* Section 1 — Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="header-row">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            AI Student Grouping
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Automate student study clusters using recent scores, attendance trends, and pedagogical targets</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 font-sans hidden md:block">Last compiled: June 14, 2026</span>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-orange-500 hover:opacity-90 disabled:opacity-50 text-slate-900 font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 border-0 cursor-pointer transition shadow-lg shadow-orange-500/10"
            id="btn-generate-groups"
          >
            <Sparkles size={16} fill="#000" className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'Recalculating...' : 'Generate Groups'}
          </button>
        </div>
      </div>

      {/* Section 2 — Summary Bar */}
      <div className="bg-[#1E2130] p-4.5 rounded-xl border border-[#2A2D3A] grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#2A2D3A]/60 text-center" id="summary-bar-card">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Total Students</span>
          <strong className="text-lg font-bold text-slate-100 mt-1 block font-mono">{students.length}</strong>
        </div>
        <div className="pt-2.5 md:pt-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Groups Formed</span>
          <strong className="text-lg font-bold text-[#F97316] mt-1 block font-mono">{groups.length}</strong>
        </div>
        <div className="pt-2.5 md:pt-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Avg Group Size</span>
          <strong className="text-lg font-bold text-slate-100 mt-1 block font-mono">7 Students</strong>
        </div>
        <div className="pt-2.5 md:pt-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Diagnostic Cycle</span>
          <strong className="text-xs font-semibold text-emerald-400 mt-2 block uppercase tracking-wide">June 2026 Sync</strong>
        </div>
      </div>

      {/* Section 3 — 2x2 Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="group-cards-grid">
        {groups.map((group) => {
          // Find student objects in this group
          const groupStudents = students.filter((s) => group.studentIds.includes(s.id));
          const showingStudents = groupStudents.slice(0, 5);
          const hiddenCount = groupStudents.length - showingStudents.length;

          return (
            <div
              key={group.id}
              className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] transition hover:border-slate-700/60 flex flex-col justify-between"
              style={{ borderLeftWidth: '5px', borderLeftColor: group.color }}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-bold text-slate-100 font-heading">{group.name}</span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: `${group.color}15`, color: group.color, border: `1px solid ${group.color}25` }}
                  >
                    {group.type}
                  </span>
                </div>

                {/* Score Widget */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-slate-400 block font-sans">Avg Score Coefficient</span>
                  <strong className="text-2xl font-black mt-1 block font-mono" style={{ color: group.color }}>
                    {group.avgScore}%
                  </strong>
                </div>

                {/* Overlap Student Avatars */}
                <div className="mb-5">
                  <span className="text-xs font-semibold text-slate-400 block mb-2 font-sans">Enrolled Students ({groupStudents.length})</span>
                  <div className="flex items-center -space-x-2.5 overflow-hidden">
                    {showingStudents.map((stud) => (
                      <button
                        key={stud.id}
                        onClick={() => handleStudentAvatarClick(stud.id)}
                        className="relative z-10 w-9 h-9 rounded-full border-2 border-[#1E2130] object-cover hover:-translate-y-1 transition duration-150 inline-block p-0 cursor-pointer"
                        title={stud.name}
                      >
                        <img src={stud.avatar} alt={stud.name} referrerPolicy="no-referrer" className="w-full h-full rounded-full object-cover" />
                      </button>
                    ))}
                    {hiddenCount > 0 && (
                      <div className="relative z-0 w-9 h-9 rounded-full border-2 border-[#1E2130] bg-[#2A2D3A] text-[10px] font-mono font-bold text-slate-300 flex items-center justify-center">
                        +{hiddenCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tag & Buttons */}
              <div className="pt-4 border-t border-[#2A2D3A]/50 flex justify-between items-center mt-3">
                <span className="text-xs text-slate-400 font-mono italic">{group.tag}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleOpenEditGroup(group)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-200 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0"
                  >
                    <Edit2 size={11} />
                    Edit Group
                  </button>
                  <button
                    onClick={() => {
                      if (groupStudents[0]) {
                        onSelectStudent(groupStudents[0].id);
                        onNavigate('students', 'ilp');
                      }
                    }}
                    className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-0.5 cursor-pointer bg-transparent border-0"
                  >
                    Details
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 4 — Group History */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="group-history-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-100">Generation History</h3>
            <p className="text-xs text-slate-400 font-sans">Review past cluster triggers or audit student migration history</p>
          </div>
          <Clock size={16} className="text-slate-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                <th className="pb-2">Date</th>
                <th className="pb-2">Groups Formed</th>
                <th className="pb-2">Trigger Action</th>
                <th className="pb-2 text-right">Audit Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2D3A]/60 font-sans">
              {history.map((hist) => (
                <tr key={hist.id} className="hover:bg-slate-800/10">
                  <td className="py-3 text-slate-300 font-bold">{hist.date}</td>
                  <td className="py-3 text-slate-400">{hist.groupsCreatedCount} Clusters Built</td>
                  <td className="py-3 text-slate-200 font-semibold">{hist.trigger}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        onRegenerateGroups();
                        setSuccessToastMessage(`Successfully restored group configuration snapshot back to ${hist.date} (${hist.trigger})!`);
                        setSuccessToast(true);
                        setTimeout(() => setSuccessToast(false), 4000);
                      }}
                      className="text-xs font-semibold text-orange-500 hover:text-orange-400 border border-orange-500/30 hover:border-orange-500/60 rounded px-2.5 py-1.5 transition bg-transparent cursor-pointer"
                    >
                      Restore State
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Group Modal Overlay */}
      {editingGroup && (
        <div className="fixed inset-0 bg-[#0F1117]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleIn text-slate-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#2A2D3A] pb-3">
              <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
                <Sliders size={16} className="text-orange-500" />
                Modify Study Cohort Specifications
              </h3>
              <button
                onClick={() => setEditingGroup(null)}
                className="text-slate-400 hover:text-slate-100 bg-transparent border-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="space-y-4 text-xs font-sans">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">Cohort / Group Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Group A - Algebra Mastery"
                  className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Tactical Focus Tag</label>
                  <input
                    type="text"
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    placeholder="e.g. Multi-step equations"
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Cohort Classification</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as any)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                  >
                    <option value="Advanced">Advanced Mastery</option>
                    <option value="On Track">On Track / High Performance</option>
                    <option value="Developing">Developing Core Mechanics</option>
                    <option value="At Risk">At Risk / Intensive Target</option>
                  </select>
                </div>
              </div>

              {/* Theme Color selector */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-400">Aesthetic Accent Theme</label>
                <div className="flex items-center gap-2.5">
                  {[
                    { value: '#10B981', name: 'Emerald Green' },
                    { value: '#3B82F6', name: 'Blue Sky' },
                    { value: '#F59E0B', name: 'Zesty Amber' },
                    { value: '#EF4444', name: 'Rose Red' },
                    { value: '#8B5CF6', name: 'Royal Purple' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setEditColor(option.value)}
                      className={`w-7 h-7 rounded-full border-2 cursor-pointer transition p-0 flex items-center justify-center`}
                      style={{
                        backgroundColor: option.value,
                        borderColor: editColor === option.value ? '#FFFFFF' : 'transparent'
                      }}
                      title={option.name}
                    >
                      {editColor === option.value && <Check size={12} className="text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Enrollment Checklist */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-400">Enrolled Student Cohort Checklist</label>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">
                    {editStudentIds.length} selectees
                  </span>
                </div>

                <div className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 max-h-40 overflow-y-auto space-y-1.5 custom-scrollbar">
                  {students.map((student) => {
                    const isChecked = editStudentIds.includes(student.id);
                    return (
                      <div
                        key={student.id}
                        onClick={() => handleToggleStudentInEdit(student.id)}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition ${
                          isChecked ? 'bg-slate-800/40 text-slate-100' : 'hover:bg-slate-800/20 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold">{student.name}</span>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                          isChecked ? 'bg-orange-500 border-orange-500 text-slate-900' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[#2A2D3A]">
              <button
                type="button"
                onClick={() => setEditingGroup(null)}
                className="bg-[#2A2D3A] text-slate-300 hover:bg-[#323647] font-bold px-4 py-2 rounded-lg text-xs border-0 cursor-pointer transition"
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={handleSaveGroup}
                className="bg-orange-500 hover:opacity-90 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs border-0 cursor-pointer transition inline-flex items-center gap-1.5"
              >
                Apply Group Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
