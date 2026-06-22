"use client";

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import PacingCurriculumScreen from '@/components/PacingCurriculumScreen';
import { initialPacingSuggestions, initialStandardsCoverage } from '@/lib/data';

export default function PacingPage() {
  const { students } = useEduPulse();

  return (
    <PacingCurriculumScreen
      students={students}
      pacingSuggestions={initialPacingSuggestions}
      standardsCoverageList={initialStandardsCoverage}
      onApplyPacingSuggestion={() => {}}
      onToggleStandardCoverage={() => {}}
    />
  );
}
