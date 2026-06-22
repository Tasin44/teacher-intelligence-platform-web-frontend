"use client";

import React, { useState, useMemo } from 'react';
import { Plus, Check } from 'lucide-react';
import { Student, AcademicRecord, BehaviorLog } from '@/types';
import ProfileAndFilter from './ProfileAndFilter';
import AcademicTab from './AcademicTab';
import BehaviorTab from './BehaviorTab';
import AttendanceTab from './AttendanceTab';
import ObservationsTab from './ObservationsTab';

interface StudentDataInputScreenProps {
  students: Student[];
  academicRecords: AcademicRecord[];
  behaviorLogs: BehaviorLog[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onAddAcademicRecord: (record: Omit<AcademicRecord, 'id'>) => void;
  onUpdateAcademicRecord?: (record: AcademicRecord) => void;
  onDeleteAcademicRecord: (id: string) => void;
  onAddBehaviorLog: (log: Omit<BehaviorLog, 'id'>) => void;
  onOpenAddStudent: () => void;
}

export default function StudentDataInputScreen({
  students,
  academicRecords,
  behaviorLogs,
  selectedStudentId,
  onSelectStudent,
  onAddAcademicRecord,
  onUpdateAcademicRecord,
  onDeleteAcademicRecord,
  onAddBehaviorLog,
  onOpenAddStudent
}: StudentDataInputScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'academic' | 'behavior' | 'attendance' | 'observations'>('academic');

  // Observations State
  const [observationsList, setObservationsList] = useState<Array<{id: string, studentId: string, date: string, tag: string, text: string}>>([
    {
      id: 'o1',
      studentId: 's1',
      date: '2026-06-14',
      tag: '1:1',
      text: 'Demonstrates improved multiplication fluency when using base-ten manipulatives directly.'
    },
    {
      id: 'o2',
      studentId: 's1',
      date: '2026-06-10',
      tag: 'small group',
      text: 'Actively participating in Reading Circle today, but hesitant to make verbal peer hypotheses.'
    },
    {
      id: 'o3',
      studentId: 's2',
      date: '2026-06-12',
      tag: '1:1',
      text: 'Exceptional visual mapping capability observed during advanced geometry drills.'
    },
    {
      id: 'o4',
      studentId: 's3',
      date: '2026-06-13',
      tag: 'whole class',
      text: 'Shows amazing peer assistance leadership qualities during STEM design experiments.'
    }
  ]);

  // Toast Notification States
  const [successToast, setSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState('');

  // Last saved timestamp
  const [lastSaved, setLastSaved] = useState('Just now');

  // Selected Student computed
  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Filtered Students list based on search
  const filteredStudentsForSearch = useMemo(() => {
    if (!searchQuery) return students;
    return students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [students, searchQuery]);

  // Selected Student's records
  const studentAcademicRecords = useMemo(() => {
    return academicRecords.filter((r) => r.studentId === currentStudent.id);
  }, [academicRecords, currentStudent]);

  const studentBehaviorLogs = useMemo(() => {
    return behaviorLogs.filter((l) => l.studentId === currentStudent.id);
  }, [behaviorLogs, currentStudent]);

  const studentObservations = useMemo(() => {
    return observationsList.filter((obs) => obs.studentId === currentStudent.id);
  }, [observationsList, currentStudent]);

  const triggerSuccessToast = (message: string) => {
    setSuccessToastMessage(message);
    setLastSaved('1 sec ago');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  const handleAddObservation = (obs: { date: string; tag: string; text: string }) => {
    setObservationsList([
      {
        id: 'o_new_' + Date.now(),
        studentId: currentStudent.id,
        date: obs.date,
        tag: obs.tag,
        text: obs.text
      },
      ...observationsList
    ]);
    triggerSuccessToast(`Pinned teacher observation to ${currentStudent.name}'s diagnostic profile folder!`);
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn" id="students-data-input-container">
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 border border-emerald-400 text-slate-900 font-extrabold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-[90] block animate-bounce">
          <Check size={18} strokeWidth={3} />
          <span>{successToastMessage}</span>
        </div>
      )}

      {/* Section 1 — Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="header-row">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-100" id="header-title">Student Data Input</h2>
          <p className="text-sm text-slate-400 font-sans" id="header-subtext">Enter and manage individual student academic, behavioral, and diagnostic records</p>
        </div>
        <button
          onClick={onOpenAddStudent}
          className="bg-orange-500 text-slate-900 font-semibold px-4 py-2.5 rounded-lg text-sm tracking-wide shadow-md shadow-orange-500/10 hover:opacity-90 flex items-center gap-2 border-0 cursor-pointer"
          id="btn-add-student"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add New Student
        </button>
      </div>

      {/* Section 2 — Student Selector Card */}
      <ProfileAndFilter
        students={students}
        currentStudent={currentStudent}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectStudent={onSelectStudent}
        filteredStudents={filteredStudentsForSearch}
      />

      {/* Section 3 — Tabs Selector */}
      <div className="flex border-b border-[#2A2D3A]" id="diagnostic-tabs-row">
        {[
          { id: 'academic', label: 'Academic' },
          { id: 'behavior', label: 'Behavior' },
          { id: 'attendance', label: 'Attendance' },
          { id: 'observations', label: 'Observations' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`cursor-pointer px-6 py-3.5 text-sm font-semibold tracking-wide border-b-2 transition font-sans ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-500 bg-orange-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="min-h-96" id="diagnostic-tabs-view">
        {activeTab === 'academic' && (
          <AcademicTab
            currentStudent={currentStudent}
            academicRecords={studentAcademicRecords}
            onAddAcademicRecord={onAddAcademicRecord}
            onUpdateAcademicRecord={onUpdateAcademicRecord}
            onDeleteAcademicRecord={onDeleteAcademicRecord}
            onSuccess={triggerSuccessToast}
          />
        )}

        {activeTab === 'behavior' && (
          <BehaviorTab
            currentStudent={currentStudent}
            behaviorLogs={studentBehaviorLogs}
            onAddBehaviorLog={onAddBehaviorLog}
            onSuccess={triggerSuccessToast}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTab
            currentStudent={currentStudent}
          />
        )}

        {activeTab === 'observations' && (
          <ObservationsTab
            currentStudent={currentStudent}
            observations={studentObservations}
            onAddObservation={handleAddObservation}
          />
        )}
      </div>

      {/* Bottom Sticky Saved Bar */}
      <div className="fixed bottom-0 left-0 md:left-60 right-0 bg-[#1A1D27] border-t border-[#2A2D3A] px-6 py-4.5 flex justify-between items-center z-40 shadow-2xl" id="bottom-sticky-bar">
        <span className="text-xs font-semibold text-slate-400 font-sans flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Auto-synchronized with EduPulse Core • Last saved {lastSaved}
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('academic')}
            className="px-4 py-2 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-lg transition bg-transparent border-0 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setLastSaved('Just now');
              triggerSuccessToast(`Successfully synchronized and published student records for ${currentStudent.name}!`);
            }}
            className="px-5 py-2 hover:opacity-90 text-slate-900 font-semibold text-xs rounded-lg transition bg-[#F97316] shadow-lg shadow-orange-500/10 cursor-pointer border-0"
          >
            Save & Update
          </button>
        </div>
      </div>
    </div>
  );
}
