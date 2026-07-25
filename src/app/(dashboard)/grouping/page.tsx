"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import StudentGroupingPage from '@/components/app/grouping/StudentGroupingPage';
import { initialGroupHistory } from '@/lib/data';
import { getGenerationHistory } from '@/lib/api/grouping.api';
import { GroupHistory } from '@/types';

const page = () => {
  const router = useRouter();
  const { students, groups, setGroups, regenerateGroups, setSelectedStudentId } = useEduPulse();
  const [history, setHistory] = useState<GroupHistory[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getGenerationHistory();
        const mappedHistory: GroupHistory[] = data.map((item, index) => ({
          id: `hist-${index}`,
          date: item.date,
          groupsCreatedCount: item.groups_formed,
          trigger: "Manual",
        }));
        setHistory(mappedHistory);
      } catch (error) {
        console.error("Failed to fetch generation history:", error);
        setHistory([]);
      }
    };
    fetchHistory();
  }, []);

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
      history={history}
      onRegenerateGroups={regenerateGroups}
      onUpdateGroups={setGroups}
      onNavigate={handleNavigate}
      onSelectStudent={setSelectedStudentId}
    />
  );
}

export default page;