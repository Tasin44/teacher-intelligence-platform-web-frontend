"use client";
import LessonModificationPage from '@/components/app/lesson-plans/LessonModificationPage';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { initialLessonSuggestions } from '@/lib/data';

const page = () => {
  const { appliedModifications, applyModification } = useEduPulse();

  return (
    <LessonModificationPage
      suggestions={initialLessonSuggestions}
      appliedModifications={appliedModifications}
      onApplyModification={applyModification}
    />
  );
}

export default page;
