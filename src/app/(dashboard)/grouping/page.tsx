"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import StudentGroupingScreen from '@/components/StudentGroupingScreen';
import { initialGroupHistory } from '@/lib/data';

export default function GroupingPage() {
  const router = useRouter();
  const {
    students,
    groups,
    setGroups,
    regenerateGroups,
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
    <StudentGroupingScreen
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
