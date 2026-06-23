"use client";
import { useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import StudentGroupingPage from '@/components/app/grouping/StudentGroupingPage';
import { initialGroupHistory } from '@/lib/data';

const page = () => {
  const router = useRouter();
  const { students, groups, setGroups, regenerateGroups, setSelectedStudentId } = useEduPulse();

  const handleNavigate = (screen: string, subtab?: string) => {
    let path = screen === 'dashboard' ? '/' : `/${screen}`;
    if (subtab) {
      path += `?subtab=${subtab}`;
    }
    router.push(path);
  };

  return (
    <StudentGroupingPage
      students={students}
      groups={groups}
      history={initialGroupHistory}
      onRegenerateGroups={regenerateGroups}
      onUpdateGroups={setGroups}
      onNavigate={handleNavigate}
      onSelectStudent={setSelectedStudentId}
    />
  );
}

export default page;