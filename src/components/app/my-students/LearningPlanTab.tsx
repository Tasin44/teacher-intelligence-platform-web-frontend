"use client";
import { Student } from '@/types';
import LearningPlanPage from './LearningPlanPage';

interface LearningPlanTabProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
}

export default function LearningPlanTab(props: LearningPlanTabProps) {
  return <LearningPlanPage {...props} />;
}