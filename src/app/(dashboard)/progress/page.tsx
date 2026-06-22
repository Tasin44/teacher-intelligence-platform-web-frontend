"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import ProgressTrackingScreen from '@/components/ProgressTrackingScreen';

export default function ProgressPage() {
  const router = useRouter();
  const {
    students,
    selectedStudentId,
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
    <ProgressTrackingScreen
      students={students}
      selectedStudentId={selectedStudentId}
      onSelectStudent={setSelectedStudentId}
      onNavigate={handleNavigate}
    />
  );
}
