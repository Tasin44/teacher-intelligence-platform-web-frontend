"use client";
import { Student, AcademicRecord, BehaviorLog } from '@/types';
import StudentDataInputPage from './StudentDataInputPage';

interface StudentDataInputTabProps {
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

export default function StudentDataInputTab(props: StudentDataInputTabProps) {
  return <StudentDataInputPage {...props} />;
}