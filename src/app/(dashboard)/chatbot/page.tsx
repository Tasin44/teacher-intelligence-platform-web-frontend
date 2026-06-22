"use client";

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import ChatbotScreen from '@/components/ChatbotScreen';

export default function ChatbotPage() {
  const { loggedInTeacher } = useEduPulse();

  return (
    <ChatbotScreen
      teacherName={loggedInTeacher?.name || 'Guest Teacher'}
      teacherEmail={loggedInTeacher?.email || 'teacher@school.edu'}
      teacherAvatar={loggedInTeacher?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
    />
  );
}
