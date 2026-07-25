"use client";

import React, { useState, useMemo } from 'react';
import { Plus, Check } from 'lucide-react';
import { Student, AcademicRecord, BehaviorLog } from '@/types';
import ProfileAndFilter from './ProfileAndFilter';
import AcademicTab from './AcademicTab';
import BehaviorTab from './BehaviorTab';
import AttendanceTab from './AttendanceTab';
import ObservationsTab from './ObservationsTab';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import { Button } from '@/components/ui/button';
import { MyStudentsHeaderAction } from './MyStudentsHeaderAction';
import AllStudentsPage from './AllStudentsPage';

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

const StudentDataInputPage = ({
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
}: StudentDataInputScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'academic' | 'behavior' | 'attendance' | 'observations'>('academic');
  const [showAllStudents, setShowAllStudents] = useState(false);

  // Observations State
  const [observationsList, setObservationsList] = useState<Array<{ id: string, studentId: string, date: string, tag: string, text: string }>>([
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
    if (!currentStudent) return [];
    return academicRecords.filter((r) => r.studentId === currentStudent.id);
  }, [academicRecords, currentStudent]);

  const studentBehaviorLogs = useMemo(() => {
    if (!currentStudent) return [];
    return behaviorLogs.filter((l) => l.studentId === currentStudent.id);
  }, [behaviorLogs, currentStudent]);

  const studentObservations = useMemo(() => {
    if (!currentStudent) return [];
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
    <DashboardChildrenLayout
      title='Student Data Input'
      subtitle='Enter and manage individual student academic, behavioral, and diagnostic records'
      actionButtons={<MyStudentsHeaderAction onOpenAddStudent={onOpenAddStudent} />}
    >
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 border border-emerald-400 text-slate-900 font-extrabold px-4 py-3 rounded-lg items-center gap-2 shadow-2xl z-90 block animate-bounce">
          <Check size={18} strokeWidth={3} />
          <span>{successToastMessage}</span>
        </div>
      )}

      {showAllStudents ? (
        <AllStudentsPage 
          onBack={() => setShowAllStudents(false)}
          onSelectStudent={(id) => {
            onSelectStudent(id);
            setShowAllStudents(false);
          }}
        />
      ) : (
        <>
          <div className='flex justify-end items-center'>
            <button 
              onClick={() => setShowAllStudents(true)}
              className='text-slate-500 text-sm hover:underline underline-offset-4 hover:text-orange-500! transition-all duration-300 font-semibold cursor-pointer border-0 bg-transparent'
            >
              View All Students
            </button>
          </div>
          {/* Section 2 — Student Selector Card */}
      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#1E2130] rounded-xl border border-[#2A2D3A] shadow-lg mt-6">
          <h3 className="text-xl text-slate-200 font-bold mb-3">No Students Yet</h3>
          <p className="text-slate-400 mb-8 text-center max-w-md leading-relaxed">Your classroom is currently empty. Get started by adding a student to begin tracking their academic progress, behavior, and observations.</p>
          <Button onClick={onOpenAddStudent} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 px-8 rounded-xl shadow-md shadow-orange-500/20 text-md">
            <Plus className="w-5 h-5 mr-2" /> Add Your First Student
          </Button>
        </div>
      ) : (
        <>
          <ProfileAndFilter
            students={students}
            currentStudent={currentStudent}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectStudent={onSelectStudent}
            filteredStudents={filteredStudentsForSearch}
          />

      {/* Section 3 — Tabs Selector */}
      <div className="flex border-b border-[#2A2D3A] overflow-x-auto scrollbar-none whitespace-nowrap w-full" id="diagnostic-tabs-row">
        {[
          { id: 'academic', label: 'Academic' },
          { id: 'behavior', label: 'Behavior' },
          { id: 'attendance', label: 'Attendance' },
          { id: 'observations', label: 'Observations' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`cursor-pointer px-4 md:px-6 py-3.5 text-sm font-semibold tracking-wide border-b-2 transition shrink-0 ${activeTab === tab.id
              ? 'border-orange-500 text-orange-500 bg-orange-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/10'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="min-h-96 w-full max-w-full overflow-hidden" id="diagnostic-tabs-view">
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
            onSuccess={setSuccessToastMessage}
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
          />
        )}
      </div>
          </>
        )}
      </>
      )}
    </DashboardChildrenLayout>
  );
}


export default StudentDataInputPage;