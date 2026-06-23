"use client";
import AssignmentsPage from '@/components/app/assignments/AssignmentsPage';
import { useEduPulse } from '@/lib/context/EduPulseContext';

const page = () => {
  const { students, assignments, groups, addAssignment, updateAssignment, isCreateAssignmentOpen, setIsCreateAssignmentOpen } = useEduPulse();

  return (
    <AssignmentsPage
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

export default page;