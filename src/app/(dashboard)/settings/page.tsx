"use client";

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import SettingsScreen from '@/components/SettingsScreen';

export default function SettingsPage() {
  const { loggedInTeacher, setLoggedInTeacher } = useEduPulse();

  const handleUpdateTeacher = (updated: {
    name: string;
    email: string;
    school: string;
    grade: string;
    avatar: string;
  }) => {
    setLoggedInTeacher(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('edupulse_logged_teacher', JSON.stringify(updated));
    }
  };

  if (!loggedInTeacher) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)] text-slate-400">
        Loading settings...
      </div>
    );
  }

  return (
    <SettingsScreen
      teacher={loggedInTeacher}
      onUpdateTeacher={handleUpdateTeacher}
    />
  );
}
