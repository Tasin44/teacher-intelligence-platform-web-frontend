"use client";
import { useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import DashboardScreen from '@/components/DashboardScreen';


export default function DashboardPage() {
  const router = useRouter();
  const {
    students,
    academicRecords,
    setIsAddStudentOpen,
    setIsCreateAssignmentOpen,
    setSelectedStudentId
  } = useEduPulse();

  const handleNavigate = (screen: string, subtab?: string) => {
    let path = screen === 'dashboard' ? '/' : `/${screen}`;
    if (subtab) {
      path += `?subtab=${subtab}`;
    }
    router.push(path);
  };

  return (
    <DashboardScreen
      students={students}
      academicRecords={academicRecords}
      onNavigate={handleNavigate}
      onOpenAddStudent={() => setIsAddStudentOpen(true)}
      onOpenCreateAssignment={() => {
        setIsCreateAssignmentOpen(true);
        router.push('/assignments');
      }}
      onSelectStudent={setSelectedStudentId}
    />
  );
}
