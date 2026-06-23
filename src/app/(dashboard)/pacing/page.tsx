"use client";
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { initialPacingSuggestions, initialStandardsCoverage } from '@/lib/data';
import PacingCurriculumPage from '@/components/app/pacing/PacingCurriculumPage';

const page = () => {
  const { students } = useEduPulse();

  return (
    <PacingCurriculumPage
      students={students}
      pacingSuggestions={initialPacingSuggestions}
      standardsCoverageList={initialStandardsCoverage}
      onApplyPacingSuggestion={() => {}}
      onToggleStandardCoverage={() => {}}
    />
  );
};

export default page;
