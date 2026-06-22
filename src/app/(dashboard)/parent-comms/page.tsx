"use client";

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import ParentCommsScreen from '@/components/ParentCommsScreen';

export default function ParentCommsPage() {
  const {
    students,
    commsHistory,
    addHistoryItem
  } = useEduPulse();

  return (
    <ParentCommsScreen
      students={students}
      commsHistory={commsHistory}
      onAddHistoryItem={addHistoryItem}
    />
  );
}
