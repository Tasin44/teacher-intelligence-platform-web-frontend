"use client";

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import StudentDataInputScreen from '@/components/StudentDataInputScreen';
import LearningPlanScreen from '@/components/LearningPlanScreen';

function StudentsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subtab = searchParams.get('subtab') || 'input';

  const {
    students,
    academicRecords,
    behaviorLogs,
    selectedStudentId,
    setSelectedStudentId,
    addAcademicRecord,
    updateAcademicRecord,
    deleteAcademicRecord,
    addBehaviorLog,
    setIsAddStudentOpen
  } = useEduPulse();

  const setSubtab = (newSubtab: 'input' | 'ilp') => {
    router.push(`/students?subtab=${newSubtab}`);
  };

  return (
    <div className="space-y-6">
      {/* Top tab panel to bridge screen 2 & screen 4 together */}
      <div className="flex bg-[#1E2130] p-1.5 rounded-xl border border-[#2A2D3A] w-fit" id="subtab-bridge">
        <button
          onClick={() => setSubtab('input')}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider transition cursor-pointer border-0 ${
            subtab === 'input'
              ? 'bg-[#F97316] text-slate-900 shadow-md shadow-orange-500/10'
              : 'text-slate-450 hover:text-slate-250 bg-transparent'
          }`}
        >
          Diagnostic Student Selector & Data Input
        </button>
        <button
          onClick={() => setSubtab('ilp')}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider transition cursor-pointer border-0 ${
            subtab === 'ilp'
              ? 'bg-[#F97316] text-slate-900 shadow-md shadow-orange-500/10'
              : 'text-slate-450 hover:text-slate-250 bg-transparent'
          }`}
        >
          Individualized Learning Plans (ILP)
        </button>
      </div>

      {subtab === 'input' ? (
        <StudentDataInputScreen
          students={students}
          academicRecords={academicRecords}
          behaviorLogs={behaviorLogs}
          selectedStudentId={selectedStudentId}
          onSelectStudent={setSelectedStudentId}
          onAddAcademicRecord={addAcademicRecord}
          onUpdateAcademicRecord={updateAcademicRecord}
          onDeleteAcademicRecord={deleteAcademicRecord}
          onAddBehaviorLog={addBehaviorLog}
          onOpenAddStudent={() => setIsAddStudentOpen(true)}
        />
      ) : (
        <LearningPlanScreen
          students={students}
          selectedStudentId={selectedStudentId}
          onSelectStudent={setSelectedStudentId}
        />
      )}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-xs">Loading profiles...</div>}>
      <StudentsPageContent />
    </Suspense>
  );
}
