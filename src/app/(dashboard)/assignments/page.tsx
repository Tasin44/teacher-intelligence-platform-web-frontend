"use client";
import AssignmentsPage from '@/components/app/assignments/AssignmentsPage';
import { useEduPulse } from '@/lib/context/EduPulseContext';

const page = () => {
  const { students, assignments, groups, addAssignment, updateAssignment, isCreateAssignmentOpen, setIsCreateAssignmentOpen } = useEduPulse();

  return (
    <AssignmentsPage
      students={students}
      groups={groups}
      isCreateModalOpenByDefault={isCreateAssignmentOpen}
      onCloseDefaultModal={() => setIsCreateAssignmentOpen(false)}
    />
  );
}

export default page;