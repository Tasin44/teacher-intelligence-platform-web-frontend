"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Assignment, Student, Group } from '@/types';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import AssignmentsSearchAndFilter from './AssignmentsSearchAndFilter';
import ClassAssignmentsTab from './ClassAssignmentsTab';
import HomeworkTrackersTab from './HomeworkTrackersTab';
import EditAssignmentModal from '@/components/modal/EditAssignmentModal';
import AssignmentDetailsModal from '@/components/modal/AssignmentDetailsModal';
import { Button } from '@/components/ui/button';

interface AssignmentsScreenProps {
  assignments: Assignment[];
  students: Student[];
  groups: Group[];
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  isCreateModalOpenByDefault?: boolean;
  onCloseDefaultModal?: () => void;
}

const AssignmentsPage = ({ assignments: initialAssignmentsList, students, groups, onAddAssignment, onUpdateAssignment, isCreateModalOpenByDefault = false, onCloseDefaultModal }: AssignmentsScreenProps) => {
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

  // Sync state if props change (e.g. from context)
  useEffect(() => {
    setAssignments(initialAssignmentsList);
  }, [initialAssignmentsList]);

  useEffect(() => {
    if (isCreateModalOpenByDefault) {
      setIsModalOpen(true);
    }
  }, [isCreateModalOpenByDefault]);

  // Reset modal values
  const handleOpenNewModal = () => {
    setSelectedAssignment(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
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

  const handleSave = (formData: {
    title: string;
    difficulty: 'Low' | 'Medium' | 'High';
    targetType: 'Student' | 'Group' | 'Level';
    targetValue: string;
    dueDate: string;
    standards: string;
    instructions: string;
    questionCount?: number;
  }) => {
    const levelBadge: 'Below' | 'On Track' | 'Advanced' =
      formData.targetValue === 'Group D' || formData.targetValue === 'Below'
        ? 'Below'
        : formData.targetValue === 'Group A' || formData.targetValue === 'Advanced'
          ? 'Advanced'
          : 'On Track';

    if (selectedAssignment) {
      // Edit
      const updated = {
        ...selectedAssignment,
        title: formData.title,
        difficulty: formData.difficulty,
        targetType: formData.targetType,
        targetValue: formData.targetValue,
        dueDate: formData.dueDate,
        standards: formData.standards.split(',').map((s) => s.trim()),
        instructions: formData.instructions,
        levelBadge,
        questionCount: formData.questionCount
      };
      setAssignments(assignments.map((a) => (a.id === selectedAssignment.id ? updated : a)));
      onUpdateAssignment(updated);
    } else {
      // Create new
      const newAssign: Assignment = {
        id: 'as_new_' + Date.now(),
        title: formData.title,
        type: activeTab,
        difficulty: formData.difficulty,
        targetType: formData.targetType,
        targetValue: formData.targetValue,
        dueDate: formData.dueDate,
        standards: formData.standards.split(',').map((s) => s.trim()),
        instructions: formData.instructions,
        levelBadge,
        questionCount: formData.questionCount
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

  const actionButtons = (
    <Button
      onClick={handleOpenNewModal}
    >
      <Sparkles size={16} fill="#000" />
      Generate Assignment
    </Button>
  );

  return (
    <DashboardChildrenLayout
      title="Assignments & Homework"
      subtitle="Customize homework vectors and generate AI lesson assignments"
      actionButtons={actionButtons}
    >
      {/* Section 2 — Tabs */}
      <div className="flex border-b border-[#2A2D3A]" id="assignments-hw-tab-row">
        {[
          { id: 'Assignment', label: 'Class Assignments' },
          { id: 'Homework', label: 'Homework Trackers' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`cursor-pointer px-6 py-3.5 text-sm font-semibold border-b-2 transition ${activeTab === tab.id
              ? 'border-orange-500 text-orange-500 bg-orange-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/10'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 3 — Filter Bar */}
      <AssignmentsSearchAndFilter
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        filterGroup={filterGroup}
        setFilterGroup={setFilterGroup}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />


      {/* Section 4 — Assignment Cards Grid */}
      {activeTab === 'Assignment' ? (
        <ClassAssignmentsTab
          assignments={filteredCards}
          onViewDetails={handleOpenDetailsModal}
          onEdit={handleOpenEditModal}
        />
      ) : (
        <HomeworkTrackersTab
          assignments={filteredCards}
          onViewDetails={handleOpenDetailsModal}
          onEdit={handleOpenEditModal}
        />
      )}

      {/* Section 5 — Assignment Edit/Generate Modal Overlay */}
      <EditAssignmentModal
        isOpen={isModalOpen}
        selectedAssignment={selectedAssignment}
        activeTab={activeTab}
        onClose={handleCloseModal}
        onSave={handleSave}
      />

      {/* Section 6 — Assignment Read-Only Detail Modal */}
      <AssignmentDetailsModal
        isOpen={isDetailsModalOpen}
        viewingAssignment={viewingAssignment}
        students={students}
        onClose={handleCloseDetailsModal}
        onEditClick={handleOpenEditModal}
        onUpdateAssignment={(updated) => {
          setAssignments(assignments.map((a) => (a.id === updated.id ? updated : a)));
          onUpdateAssignment(updated);
        }}
      />
    </DashboardChildrenLayout>
  );
}


export default AssignmentsPage;
