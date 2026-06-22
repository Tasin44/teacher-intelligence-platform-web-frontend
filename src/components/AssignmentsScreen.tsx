"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  FileSpreadsheet,
  Sparkles,
  Search,
  Calendar,
  X,
  Edit,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Assignment, Student, Group } from '@/types';

interface AssignmentsScreenProps {
  assignments: Assignment[];
  students: Student[];
  groups: Group[];
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  isCreateModalOpenByDefault?: boolean;
  onCloseDefaultModal?: () => void;
}

export default function AssignmentsScreen({
  assignments: initialAssignmentsList,
  students,
  groups,
  onAddAssignment,
  onUpdateAssignment,
  isCreateModalOpenByDefault = false,
  onCloseDefaultModal
}: AssignmentsScreenProps) {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignmentsList);
  const [activeTab, setActiveTab] = useState<'Assignment' | 'Homework'>('Assignment');

  // Filters
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(isCreateModalOpenByDefault);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // New Details Modal Control
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);

  // Form Fields for Modal
  const [formTitle, setFormTitle] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [formTargetType, setFormTargetType] = useState<'Student' | 'Group' | 'Level'>('Level');
  const [formTargetValue, setFormTargetValue] = useState('Below');
  const [formDueDate, setFormDueDate] = useState('2026-06-20');
  const [formStandards, setFormStandards] = useState('CCSS.Math.3.OA.A.1');
  const [formInstructions, setFormInstructions] = useState('');

  // Sync state if props change (e.g. from context)
  useEffect(() => {
    setAssignments(initialAssignmentsList);
  }, [initialAssignmentsList]);

  useEffect(() => {
    if (isCreateModalOpenByDefault) {
      setIsModalOpen(true);
      setFormTitle('Unified Fractions Modeling Workbook');
      setFormDifficulty('Medium');
      setFormTargetType('Group');
      setFormTargetValue('Group D');
      setFormDueDate('2026-06-24');
      setFormStandards('CCSS.Math.3.NF.A.1');
      setFormInstructions('Students will paint visual grid blocks corresponding to target fractions (1/2, 1/4, 1/8). Support with tactile fraction strips as needed.');
    }
  }, [isCreateModalOpenByDefault]);

  // Reset modal values
  const handleOpenNewModal = () => {
    setSelectedAssignment(null);
    setFormTitle('Unified Fractions Modeling Workbook');
    setFormDifficulty('Medium');
    setFormTargetType('Group');
    setFormTargetValue('Group D');
    setFormDueDate('2026-06-24');
    setFormStandards('CCSS.Math.3.NF.A.1');
    setFormInstructions('Students will paint visual grid blocks corresponding to target fractions (1/2, 1/4, 1/8). Support with tactile fraction strips as needed.');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormTitle(assignment.title);
    setFormDifficulty(assignment.difficulty);
    setFormTargetType(assignment.targetType);
    setFormTargetValue(assignment.targetValue);
    setFormDueDate(assignment.dueDate);
    setFormStandards(assignment.standards.join(', '));
    setFormInstructions(assignment.instructions);
    setIsModalOpen(true);
  };

  const handleOpenDetailsModal = (assignment: Assignment) => {
    setViewingAssignment(assignment);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setViewingAssignment(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
    if (onCloseDefaultModal) onCloseDefaultModal();
  };

  const handleSave = () => {
    if (!formTitle) return;

    const levelBadge: 'Below' | 'On Track' | 'Advanced' =
      formTargetValue === 'Group D' || formTargetValue === 'Below'
        ? 'Below'
        : formTargetValue === 'Group A' || formTargetValue === 'Advanced'
        ? 'Advanced'
        : 'On Track';

    if (selectedAssignment) {
      // Edit
      const updated = {
        ...selectedAssignment,
        title: formTitle,
        difficulty: formDifficulty,
        targetType: formTargetType,
        targetValue: formTargetValue,
        dueDate: formDueDate,
        standards: formStandards.split(',').map((s) => s.trim()),
        instructions: formInstructions,
        levelBadge
      };
      setAssignments(assignments.map((a) => (a.id === selectedAssignment.id ? updated : a)));
      onUpdateAssignment(updated);
    } else {
      // Create new
      const newAssign: Assignment = {
        id: 'as_new_' + Date.now(),
        title: formTitle,
        type: activeTab,
        difficulty: formDifficulty,
        targetType: formTargetType,
        targetValue: formTargetValue,
        dueDate: formDueDate,
        standards: formStandards.split(',').map((s) => s.trim()),
        instructions: formInstructions,
        levelBadge
      };
      setAssignments([newAssign, ...assignments]);
      onAddAssignment(newAssign);
    }
    handleCloseModal();
  };

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return assignments.filter((card) => {
      // Tab matching
      if (card.type !== activeTab) return false;

      // Filter level
      if (filterLevel !== 'all' && card.levelBadge !== filterLevel) return false;

      // Filter group
      if (filterGroup !== 'all' && card.targetValue !== filterGroup) return false;

      // Search match
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          card.title.toLowerCase().includes(query) ||
          card.instructions.toLowerCase().includes(query) ||
          card.standards.some((s) => s.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [assignments, activeTab, filterLevel, filterGroup, searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="assignments-root-container">
      {/* Section 1 — Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slideIn">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            Assignments & Homework
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Customize homework vectors and generate AI lesson assignments</p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="bg-orange-500 text-slate-900 hover:opacity-90 font-bold px-4 py-2.5 rounded-lg text-sm tracking-wide shadow-md shadow-orange-500/10 flex items-center gap-2 border-0 cursor-pointer"
          id="btn-generate-assignment"
        >
          <Sparkles size={16} fill="#000" />
          Generate Assignment
        </button>
      </div>

      {/* Section 2 — Tabs */}
      <div className="flex border-b border-[#2A2D3A]" id="assignments-hw-tab-row">
        {[
          { id: 'Assignment', label: 'Class Assignments' },
          { id: 'Homework', label: 'Homework Trackers' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`cursor-pointer px-6 py-3.5 text-sm font-semibold border-b-2 transition font-sans ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-500 bg-orange-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 3 — Filter Bar */}
      <div className="bg-[#1E2130] p-5 rounded-xl border border-[#2A2D3A] flex flex-col md:flex-row items-center justify-between gap-4" id="assignments-filter-bar">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-300">Filters:</span>
          </div>

          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="all">All Growth Levels</option>
            <option value="Below">Below (Needs Scaffolding)</option>
            <option value="On Track">On Track (At Grade level)</option>
            <option value="Advanced">Advanced (Enrichment)</option>
          </select>

          {/* Group Filter */}
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="all">All Groups</option>
            <option value="Group A">Group A (Advanced)</option>
            <option value="Group B">Group B (On Track)</option>
            <option value="Group C">Group C (Developing)</option>
            <option value="Group D">Group D (At Risk)</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search details or standards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500 transition font-sans"
          />
        </div>
      </div>

      {/* Grid Status count */}
      <p className="text-xs text-slate-400" id="assignments-display-count">
        Showing <strong>{filteredCards.length}</strong> {activeTab.toLowerCase()}(s) matching current query thresholds.
      </p>

      {/* Section 4 — Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="assignments-cards-grid">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => {
            const avatarChar = card.targetValue.charAt(0);
            return (
              <div
                key={card.id}
                className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  {/* Badge top */}
                  <div className="flex justify-between items-center mb-4.5">
                    {card.levelBadge === 'Below' ? (
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                        Below
                      </span>
                    ) : card.levelBadge === 'Advanced' ? (
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                        Advanced
                      </span>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                        On Track
                      </span>
                    )}

                    <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono">
                      Diff: {card.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold font-heading text-slate-100 leading-tight mb-2 tracking-tight group-hover:text-orange-500">
                    {card.title}
                  </h3>

                  {/* Student/Group Target block */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] text-orange-500 font-bold uppercase font-mono">
                      {avatarChar}
                    </div>
                    <span className="text-xs font-semibold text-slate-350">{card.targetValue}</span>
                  </div>

                  {/* Due Date & Standards */}
                  <div className="space-y-2 mb-5 pt-3 border-t border-[#2A2D3A]/40 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={13} />
                      <span className="font-semibold text-[11px]">Due: {card.dueDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {card.standards.map((stan, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                          {stan}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom detail action links */}
                <div className="flex items-center justify-between border-t border-[#2A2D3A]/40 pt-4 mt-2">
                  <button
                    onClick={() => handleOpenDetailsModal(card)}
                    className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 cursor-pointer bg-transparent border-0"
                  >
                    View Details
                    <ExternalLink size={11} />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(card)}
                    className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition cursor-pointer bg-transparent border-0"
                    title="Edit Assignment"
                  >
                    <Edit size={13} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 bg-[#1E2130] rounded-xl border border-[#2A2D3A] flex flex-col items-center justify-center gap-2">
            <HelpCircle size={32} className="text-slate-600 block mb-2" />
            <p className="text-sm font-semibold">No worksheets match your active filter settings.</p>
            <p className="text-xs text-slate-600">Try selecting "All Growth Levels" or searching standard keywords.</p>
          </div>
        )}
      </div>

      {/* Section 5 — Assignment Detail Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-xl w-full max-w-xl shadow-2xl p-6 relative flex flex-col justify-between animate-slideUp">
            {/* Modal Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-5 top-5 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer bg-transparent border-0"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-5">
              <span className="text-[10px] uppercase font-extrabold text-orange-500 tracking-widest block mb-1">
                EduPulse AI Lesson Assigner
              </span>
              <h3 className="text-lg font-bold font-heading text-slate-100 pr-8">
                {selectedAssignment ? 'Edit Task Specifications' : 'Draft AI Lesson Assignment'}
              </h3>
            </div>

            {/* Fields Grid */}
            <div className="space-y-4 text-xs font-sans">
              {/* Title input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">Assignment / Homework Title</label>
                <input
                  type="text"
                  placeholder="e.g. Fractions Circle Segment Modeling"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3.5 py-2 text-xs text-slate-250 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              {/* Targets and Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Target Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Target Type</label>
                  <select
                    value={formTargetType}
                    onChange={(e) => setFormTargetType(e.target.value as any)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="Level">Performance Level</option>
                    <option value="Group">AI Student Group</option>
                    <option value="Student">Individual Student</option>
                  </select>
                </div>

                {/* Target Value */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Target Parameter</label>
                  <input
                    type="text"
                    placeholder="e.g. Group D or Marcus T"
                    value={formTargetValue}
                    onChange={(e) => setFormTargetValue(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2.5 py-2 text-xs text-slate-205 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                {/* Difficulty level toggle */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">AI Difficulty Rating</label>
                  <div className="flex bg-[#0F1117] rounded-lg border border-[#2A2D3A] p-0.5">
                    {['Low', 'Medium', 'High'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormDifficulty(lvl as any)}
                        className={`flex-1 text-center py-1.5 rounded-md text-[10px] font-bold cursor-pointer border-0 transition duration-150 ${
                          formDifficulty === lvl
                            ? 'bg-orange-500 text-slate-900 shadow'
                            : 'text-slate-400 hover:text-slate-205 bg-transparent'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Standards and Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">CCSS Standards Linked</label>
                  <input
                    type="text"
                    placeholder="CCSS.Math.3.OA.A.1, CCSS.Math.3.OA.A.3"
                    value={formStandards}
                    onChange={(e) => setFormStandards(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2.5 py-1.5 text-xs text-slate-250 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">Lesson Task Instructions</label>
                <textarea
                  rows={5}
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  placeholder="Record step-by-step procedural directions, required physical blocks, or homework validation checkpoints..."
                  className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-sans resize-none leading-relaxed"
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-[#2A2D3A]/60 flex justify-end gap-3.5">
              <button
                onClick={handleCloseModal}
                className="px-4.5 py-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-lg transition bg-transparent border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-orange-500 hover:opacity-90 text-slate-900 font-bold text-xs rounded-lg transition border-0 cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle size={14} strokeWidth={2.5} />
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 6 — Assignment Read-Only Detail Modal */}
      {isDetailsModalOpen && viewingAssignment && (() => {
        // Compute assigned students dynamically
        const assignedStudents = students.filter((student) => {
          const type = viewingAssignment.targetType;
          const val = viewingAssignment.targetValue;
          if (type === 'Student') {
            return student.name.toLowerCase().includes(val.toLowerCase()) || val.toLowerCase().includes(student.name.toLowerCase());
          } else if (type === 'Group') {
            const matchGroupId = val.replace('Group ', '').trim();
            return student.group === matchGroupId || student.group === val;
          } else if (type === 'Level') {
            const level = viewingAssignment.levelBadge;
            if (level === 'Below') {
              return student.riskLevel === 'At Risk' || student.riskLevel === 'Developing';
            } else if (level === 'Advanced') {
              return student.riskLevel === 'Advanced';
            } else {
              return student.riskLevel === 'On Track';
            }
          }
          return false;
        });

        return (
          <div className="fixed inset-0 z-50 bg-[#0F1117]/85 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative flex flex-col justify-between animate-scaleIn text-slate-200 font-sans">
              {/* Modal Close Button */}
              <button
                onClick={handleCloseDetailsModal}
                className="absolute right-5 top-5 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer bg-transparent border-0"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="mb-6 pb-4 border-b border-[#2A2D3A]/60">
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500 block mb-1">
                  {viewingAssignment.type === 'Assignment' ? '🎒 CLASSROOM LEARNING TASK' : '🏠 HOMEWORK DISCOVERY TASK'}
                </span>
                <h3 className="text-xl font-bold font-heading text-slate-100 leading-snug">
                  {viewingAssignment.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {/* Level badge */}
                  {viewingAssignment.levelBadge === 'Below' ? (
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                      scaffolding recommended
                    </span>
                  ) : viewingAssignment.levelBadge === 'Advanced' ? (
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                      enrichment focus
                    </span>
                  ) : (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                      on track progression
                    </span>
                  )}

                  <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
                    DIFFICULTY: {viewingAssignment.difficulty}
                  </span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold ml-auto">
                    <Calendar size={12} className="text-orange-500" />
                    Due date: {viewingAssignment.dueDate}
                  </span>
                </div>
              </div>

              {/* Main Content Sections */}
              <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar text-xs">

                {/* Linked Standards */}
                <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A]">
                  <h4 className="font-bold text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                    📌 Curricular Target & Linked CCSS Standards
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingAssignment.standards.map((stan, idx) => (
                      <span key={idx} className="bg-[#1E2130] text-slate-200 border border-[#2A2D3A] px-2.5 py-1 rounded font-mono text-xs font-bold shadow-sm">
                        {stan}
                      </span>
                    ))}
                    {viewingAssignment.standards.length === 0 && (
                      <span className="text-slate-500 italic">No exact standards linked to this homework module.</span>
                    )}
                  </div>
                </div>

                {/* Task Instructions */}
                <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A] space-y-2">
                  <h4 className="font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                    📝 Homework & Lesson Instructions
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-xs font-medium whitespace-pre-wrap">
                    {viewingAssignment.instructions || "No specific instructions provided for this lesson module."}
                  </p>
                </div>

                {/* Targeted cohort submission status */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      👥 Enrolled Cohort Growth Progression ({assignedStudents.length} Students)
                    </h4>
                    <div className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full font-semibold">
                      Target: {viewingAssignment.targetType} ({viewingAssignment.targetValue})
                    </div>
                  </div>

                  <div className="bg-[#151722] rounded-xl border border-[#2A2D3A] divide-y divide-[#2A2D3A]/50 overflow-hidden text-xs">
                    {assignedStudents.length > 0 ? (
                      assignedStudents.map((student) => {
                        const scoreHash = student.avgScore;
                        let status: 'Completed' | 'In Progress' | 'Not Started' = 'Completed';
                        let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                        let detailText = `Graded: ${Math.round(student.avgScore)}% | Submitted 2 days ago`;

                        if (scoreHash >= 80) {
                          status = 'Completed';
                          statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                          detailText = `Graded: ${Math.min(100, Math.round(student.avgScore + (student.avgScore % 5)))}% | Submitted online`;
                        } else if (scoreHash >= 70 && scoreHash < 80) {
                          status = 'In Progress';
                          statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                          detailText = 'Draft saved | Standard scaffolding tools in-use';
                        } else {
                          status = 'Not Started';
                          statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                          detailText = 'No online draft found | Offline intervention scheduled';
                        }

                        return (
                          <div key={student.id} className="flex items-center justify-between p-3 hover:bg-[#1C1F2E]/30 transition text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 rounded-full object-cover border border-[#2A2D3A]"
                              />
                              <div>
                                <p className="font-bold text-slate-200">{student.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono">
                                  Math Score: {student.mathScore}% | Grade {student.grade} (Room {student.room})
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className={`inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${statusColor} mb-1`}>
                                {status}
                              </span>
                              <p className="text-[10px] text-slate-400 font-medium">{detailText}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-slate-500 italic text-xs">
                        No active students are currently targeted in this specialized cohort level/group vector.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="mt-6 pt-4 border-t border-[#2A2D3A]/60 flex justify-end gap-3">
                <button
                  onClick={() => {
                    handleCloseDetailsModal();
                    handleOpenEditModal(viewingAssignment);
                  }}
                  className="px-4 py-2 hover:bg-[#2A2D3A] text-orange-500 font-bold text-xs rounded-lg border border-orange-500/30 hover:border-orange-500/60 bg-transparent cursor-pointer transition flex items-center gap-1.5"
                >
                  <Edit size={12} />
                  Edit Task Specs
                </button>

                <button
                  onClick={handleCloseDetailsModal}
                  className="px-5 py-2.5 bg-orange-500 hover:opacity-90 text-slate-900 font-bold text-xs rounded-lg transition border-0 cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
