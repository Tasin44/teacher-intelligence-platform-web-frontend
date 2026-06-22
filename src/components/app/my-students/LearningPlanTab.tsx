"use client";

import React from 'react';
import LearningPlanScreen from '@/components/app/my-students/LearningPlanScreen';
import { Student } from '@/types';

interface LearningPlanTabProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
}

export default function LearningPlanTab(props: LearningPlanTabProps) {
  return <LearningPlanScreen {...props} />;
}