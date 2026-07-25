"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, X, CheckCircle } from 'lucide-react';
import { Student, Group } from '@/types';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import AssignmentsSearchAndFilter from './AssignmentsSearchAndFilter';
import ClassAssignmentsTab from './ClassAssignmentsTab';
import EditAssignmentModal from '@/components/modal/EditAssignmentModal';
import AssignmentDetailsModal from '@/components/modal/AssignmentDetailsModal';
import { Button } from '@/components/ui/button';
import SubmissionsListModal from '@/components/modal/SubmissionsListModal';
import { ApiAssignment, getAssignments, searchAssignments, createAssignment, updateAssignment, CreateAssignmentPayload } from '@/lib/api/assignment.api';

interface AssignmentsScreenProps {
  students: Student[];
  groups: Group[];
  onAddAssignment?: (assignment: any) => void;
  onUpdateAssignment?: (assignment: any) => void;
  isCreateModalOpenByDefault?: boolean;
  onCloseDefaultModal?: () => void;
}

const AssignmentsPage = ({ students, groups, isCreateModalOpenByDefault = false, onCloseDefaultModal }: AssignmentsScreenProps) => {
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);

  // Filters
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(isCreateModalOpenByDefault);
  const [selectedAssignment, setSelectedAssignment] = useState<ApiAssignment | null>(null);

  // New Details Modal Control
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState<ApiAssignment | null>(null);

  // Submissions Modal Control
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [submissionsAssignmentId, setSubmissionsAssignmentId] = useState<number | null>(null);

  // Error Toast Control
  const [errorToast, setErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState('');

  const showErrorToast = (message: string) => {
    setErrorToastMessage(message);
    setErrorToast(true);
    setTimeout(() => {
      setErrorToast(false);
      setErrorToastMessage('');
    }, 4000);
  };

  // Success Toast Control
  const [successToast, setSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState('');

  const showSuccessToast = (message: string) => {
    setSuccessToastMessage(message);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      setSuccessToastMessage('');
    }, 4000);
  };

  // Fetch initial assignments
  const loadAssignments = async () => {
    try {
      const res = await getAssignments() as any;
      // Handle both paginated response and direct array response
      if (Array.isArray(res)) {
        setAssignments(res);
      } else if (res && res.results) {
        setAssignments(res.results);
      } else {
        setAssignments([]);
      }
    } catch (error) {
      console.error("Failed to load assignments", error);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  // Handle search dynamically
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        loadAssignments();
        return;
      }
      try {
        const res = await searchAssignments(searchQuery);
        setAssignments(res);
      } catch (err) {
        console.error("Failed to search assignments", err);
      }
    };

    // Add small debounce
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  const handleOpenEditModal = (assignment: ApiAssignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleOpenDetailsModal = (assignment: ApiAssignment) => {
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

  const handleSave = async (formData: {
    title: string;
    subject: string;
    difficulty: 'Low' | 'Medium' | 'High';
    targetType: 'all_groups' | 'individual_student' | 'individual_group';
    targetStudentRoll?: string;
    targetGroupId?: number;
    dueDate: string;
    standards: string;
    instructions: string;
    questionCount: number;
  }) => {
    const payload: Partial<CreateAssignmentPayload> = {
      title: formData.title,
      subject: formData.subject,
      target_type: formData.targetType,
      target_student_roll: formData.targetStudentRoll,
      target_group_id: formData.targetGroupId,
      ai_difficulty: formData.difficulty,
      ccss_code: formData.standards,
      due_date: formData.dueDate,
      instructions: formData.instructions,
      number_of_questions: formData.questionCount
    };

    if (selectedAssignment) {
      try {
        await updateAssignment(selectedAssignment.assignment_id, payload);
        await loadAssignments(); // refetch
        showSuccessToast("Assignment updated successfully");
      } catch (err: any) {
        console.error("Failed to update assignment", err);
        const displayMsg = err.message?.includes(' :: ') ? err.message.split(' :: ')[1] : err.message;
        showErrorToast(displayMsg || "Failed to update assignment");
      }
    } else {
      // Create new
      try {
        await createAssignment(payload as CreateAssignmentPayload);
        await loadAssignments(); // refetch
        showSuccessToast("Assignment generated successfully");
      } catch (err: any) {
        console.error("Failed to create assignment", err);
        const displayMsg = err.message?.includes(' :: ') ? err.message.split(' :: ')[1] : err.message;
        showErrorToast(displayMsg || "Failed to create assignment");
      }
    }
    handleCloseModal();
  };

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return (assignments || []).filter((card) => {
      // We don't have a concept of type 'Assignment' vs 'Homework' in the API right now, 
      // but we can fake it or just show all.
      // For now, let's just let the search API handle the searchQuery. We can still apply client-side filtering for group/level.

      const levelBadge = card.ai_difficulty === 'Low' ? 'Below' : card.ai_difficulty === 'High' ? 'Advanced' : 'On Track';

      // Filter level
      if (filterLevel !== 'all' && levelBadge !== filterLevel) return false;

      // Filter group (if target_type === 'individual_group', check group name)
      if (filterGroup !== 'all' && card.target_group_name !== filterGroup && card.target_type === 'individual_group') return false;

      return true;
    });
  }, [assignments, filterLevel, filterGroup]);

  const actionButtons = (
    <div className="flex items-center gap-3">
      <Button
        onClick={() => {
          setSubmissionsAssignmentId(null);
          setIsSubmissionsModalOpen(true);
        }}
        className="bg-white border border-gray-400 !text-black hover:bg-gray-100 shadow-sm"
      >
        Show All Submissions
      </Button>
      <Button
        onClick={handleOpenNewModal}
      >
        <Sparkles size={16} fill="#000" />
        Generate Assignment
      </Button>
    </div>
  );

  return (
    <DashboardChildrenLayout
      title="Assignments & Homework"
      subtitle="Customize homework vectors and generate AI lesson assignments"
      actionButtons={actionButtons}
    >
      {/* Toast Notification */}
      {errorToast && (
        <div className="fixed top-5 right-5 bg-rose-500 border border-rose-400 text-slate-900 font-extrabold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-[90] animate-bounce">
          <X size={18} strokeWidth={3} />
          <span>{errorToastMessage}</span>
        </div>
      )}
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 border border-emerald-400 text-slate-900 font-extrabold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-[90] animate-bounce">
          <CheckCircle size={18} strokeWidth={3} />
          <span>{successToastMessage}</span>
        </div>
      )}

      <AssignmentsSearchAndFilter
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        filterGroup={filterGroup}
        setFilterGroup={setFilterGroup}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />


      {/* Section 4 — Assignment Cards Grid */}
      <ClassAssignmentsTab
        assignments={filteredCards}
        onViewDetails={handleOpenDetailsModal}
        onEdit={handleOpenEditModal}
      />

      {/* Section 5 — Assignment Edit/Generate Modal Overlay */}
      <EditAssignmentModal
        isOpen={isModalOpen}
        selectedAssignment={selectedAssignment}
        activeTab="Assignment"
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
          setAssignments(assignments.map((a) => (a.assignment_id === updated.assignment_id ? updated : a)));
        }}
        onViewSubmissions={(id) => {
          setSubmissionsAssignmentId(id);
          setIsSubmissionsModalOpen(true);
        }}
      />

      <SubmissionsListModal
        isOpen={isSubmissionsModalOpen}
        onClose={() => {
          setIsSubmissionsModalOpen(false);
          setSubmissionsAssignmentId(null);
        }}
        assignmentId={submissionsAssignmentId}
      />
    </DashboardChildrenLayout>
  );
}


export default AssignmentsPage;
