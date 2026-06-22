"use client";

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import AssignmentsScreen from '@/components/AssignmentsScreen';

export default function AssignmentsPage() {
  const {
    assignments,
    students,
    groups,
    addAssignment,
    updateAssignment,
    isCreateAssignmentOpen,
    setIsCreateAssignmentOpen
  } = useEduPulse();

  return (
    <AssignmentsScreen
      assignments={assignments}
      students={students}
      groups={groups}
      onAddAssignment={addAssignment}
      onUpdateAssignment={updateAssignment}
      isCreateModalOpenByDefault={isCreateAssignmentOpen}
      onCloseDefaultModal={() => setIsCreateAssignmentOpen(false)}
    />
  );
}
