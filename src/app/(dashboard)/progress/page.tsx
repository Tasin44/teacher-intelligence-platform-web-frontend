"use client";
import { useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import ProgressTrackingPage from '@/components/app/progress/ProgressTrackingPage';

const page = () => {
  const router = useRouter();
  const { students, selectedStudentId, setSelectedStudentId } = useEduPulse();

  const handleNavigate = (screen: string, subtab?: string) => {
    let path = screen === 'dashboard' ? '/' : `/${screen}`;
    if (subtab) {
      path += `?subtab=${subtab}`;
    }
    router.push(path);
  };

  return (
    <ProgressTrackingPage
      students={students}
      selectedStudentId={selectedStudentId}
      onSelectStudent={setSelectedStudentId}
      onNavigate={handleNavigate}
    />
  );
};

export default page;
