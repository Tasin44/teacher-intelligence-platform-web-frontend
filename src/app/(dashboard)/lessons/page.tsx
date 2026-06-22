"use client";

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import LessonModificationScreen from '@/components/LessonModificationScreen';
import { initialLessonSuggestions } from '@/lib/data';

export default function LessonsPage() {
  const {
    appliedModifications,
    applyModification
  } = useEduPulse();

  return (
    <LessonModificationScreen
      suggestions={initialLessonSuggestions}
      appliedModifications={appliedModifications}
      onApplyModification={applyModification}
    />
  );
}
