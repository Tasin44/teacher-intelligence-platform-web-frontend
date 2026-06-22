"use client";

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import InterventionsScreen from '@/components/InterventionsScreen';
import { initialReteachPlans } from '@/lib/data';

export default function InterventionsPage() {
  const {
    students,
    interventions,
    setInterventions
  } = useEduPulse();

  // Adapter for context addition call
  const handleAddIntervention = (item: any) => {
    setInterventions((prev: any) => [item, ...prev]);
  };

  return (
    <InterventionsScreen
      students={students}
      interventions={interventions}
      reteachPlans={initialReteachPlans}
      onAddIntervention={handleAddIntervention}
      onUpdateIntervention={setInterventions}
    />
  );
}
