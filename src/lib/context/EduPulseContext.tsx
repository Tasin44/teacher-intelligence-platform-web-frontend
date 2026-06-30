"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Group,
  AcademicRecord,
  BehaviorLog,
  Assignment,
  Intervention,
  AppliedModification,
  CommsHistory
} from '@/types';
import {
  initialStudents,
  initialAcademicRecords,
  initialBehaviorLogs,
  initialGroups,
  initialAssignments,
  initialInterventions,
  initialAppliedModifications,
  initialCommsHistory
} from '@/lib/data';

interface Teacher {
  name: string;
  email: string;
  school: string;
  grade: string;
  avatar: string;
}

interface NotificationItem {
  id: string;
  title: string;
  text: string;
  screen: string;
  color: string;
}

interface EduPulseContextType {
  // States
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  academicRecords: AcademicRecord[];
  setAcademicRecords: React.Dispatch<React.SetStateAction<AcademicRecord[]>>;
  behaviorLogs: BehaviorLog[];
  setBehaviorLogs: React.Dispatch<React.SetStateAction<BehaviorLog[]>>;
  interventions: Intervention[];
  setInterventions: React.Dispatch<React.SetStateAction<Intervention[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  appliedModifications: AppliedModification[];
  setAppliedModifications: React.Dispatch<React.SetStateAction<AppliedModification[]>>;
  commsHistory: CommsHistory[];
  setCommsHistory: React.Dispatch<React.SetStateAction<CommsHistory[]>>;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  loggedInTeacher: Teacher | null;
  setLoggedInTeacher: (teacher: Teacher | null) => void;
  
  // Modals / global views
  isAddStudentOpen: boolean;
  setIsAddStudentOpen: (open: boolean) => void;
  isCreateAssignmentOpen: boolean;
  setIsCreateAssignmentOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  
  // Notifications
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;

  // Functions
  login: (teacher: Teacher) => void;
  logout: () => void;
  addStudent: (studentData: {
    name: string;
    grade: string;
    riskLevel: 'At Risk' | 'On Track' | 'Advanced' | 'Developing';
    readingLevel: string;
    parentName: string;
    parentEmail: string;
    avatar?: string;
  }) => void;
  addAcademicRecord: (rec: Omit<AcademicRecord, 'id'>) => void;
  updateAcademicRecord: (rec: AcademicRecord) => void;
  deleteAcademicRecord: (id: string) => void;
  addBehaviorLog: (log: Omit<BehaviorLog, 'id'>) => void;
  addAssignment: (assign: Omit<Assignment, 'id'>) => void;
  updateAssignment: (assign: Assignment) => void;
  applyModification: (mod: Omit<AppliedModification, 'id'>) => void;
  addHistoryItem: (item: Omit<CommsHistory, 'id'>) => void;
  regenerateGroups: () => void;
}

const EduPulseContext = createContext<EduPulseContextType | undefined>(undefined);

export const EduPulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hydrated states
  const [isClient, setIsClient] = useState(false);
  const [loggedInTeacher, setLoggedInTeacherState] = useState<Teacher | null>(null);

  // Core synchronization states
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>(initialAcademicRecords);
  const [behaviorLogs, setBehaviorLogs] = useState<BehaviorLog[]>(initialBehaviorLogs);
  const [interventions, setInterventions] = useState<Intervention[]>(initialInterventions);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [appliedModifications, setAppliedModifications] = useState<AppliedModification[]>(initialAppliedModifications);
  const [commsHistory, setCommsHistory] = useState<CommsHistory[]>(initialCommsHistory);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s6');

  // Modal / UI states
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Notification lists
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'n1', title: 'Critical Alert', text: 'Devon R. fell under benchmark scores', screen: 'progress', color: 'text-rose-500' },
    { id: 'n2', title: 'Pacing Suggestion', text: 'AI generated 2 curriculum contractions', screen: 'pacing', color: 'text-orange-500' },
    { id: 'n3', title: 'Daily Sync Complete', text: 'All grades published out to parent emails', screen: 'parent-comms', color: 'text-emerald-500' }
  ]);

  // Handle client-side session hydration safely
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('edupulse_logged_teacher');
    if (saved) {
      try {
        setLoggedInTeacherState(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing logged in teacher session:', err);
      }
    }
  }, []);

  const login = (teacher: Teacher) => {
    setLoggedInTeacherState(teacher);
    if (typeof window !== 'undefined') {
      localStorage.setItem('edupulse_logged_teacher', JSON.stringify(teacher));
    }
  };

  const logout = () => {
    setLoggedInTeacherState(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('edupulse_logged_teacher');
    }
  };

  const addStudent = (studentData: {
    name: string;
    grade: string;
    riskLevel: 'At Risk' | 'On Track' | 'Advanced' | 'Developing';
    readingLevel: string;
    parentName: string;
    parentEmail: string;
    avatar?: string;
  }) => {
    const { name, grade, riskLevel, readingLevel, parentName, parentEmail, avatar } = studentData;
    const newStud: Student = {
      id: 's_new_' + Date.now(),
      name,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      grade,
      room: 'Room 12',
      riskLevel,
      readingLevel,
      avgScore: riskLevel === 'Advanced' ? 92 : riskLevel === 'At Risk' ? 54 : 76,
      attendanceRate: riskLevel === 'At Risk' ? 84 : 94,
      group: riskLevel === 'Advanced' ? 'A' : riskLevel === 'At Risk' ? 'D' : 'B',
      parentName: parentName || 'Parent Contact',
      parentEmail: parentEmail || 'parent@example.com',
      mathScore: riskLevel === 'At Risk' ? 44 : 76
    };

    setStudents(prev => [newStud, ...prev]);
    setSelectedStudentId(newStud.id);
  };

  const addAcademicRecord = (rec: Omit<AcademicRecord, 'id'>) => {
    const newRec: AcademicRecord = {
      id: 'ac_new_' + Date.now(),
      ...rec
    };
    setAcademicRecords(prev => {
      const updatedList = [newRec, ...prev];
      setStudents(prevStudents => prevStudents.map(s => {
        if (s.id === rec.studentId) {
          const studentRecs = updatedList.filter(r => r.studentId === s.id);
          const sum = studentRecs.reduce((acc, curr) => acc + curr.score, 0);
          const newAvg = Math.round(sum / studentRecs.length);
          return {
            ...s,
            avgScore: newAvg,
            mathScore: rec.subject === 'Math' ? rec.score : s.mathScore
          };
        }
        return s;
      }));
      return updatedList;
    });
  };

  const updateAcademicRecord = (updatedRec: AcademicRecord) => {
    setAcademicRecords(prev => {
      const updatedList = prev.map(r => r.id === updatedRec.id ? updatedRec : r);
      setStudents(prevStudents => prevStudents.map(s => {
        if (s.id === updatedRec.studentId) {
          const studentRecs = updatedList.filter(r => r.studentId === s.id);
          const sum = studentRecs.reduce((acc, curr) => acc + curr.score, 0);
          const newAvg = Math.round(sum / studentRecs.length);
          return {
            ...s,
            avgScore: newAvg,
            mathScore: updatedRec.subject === 'Math' ? updatedRec.score : s.mathScore
          };
        }
        return s;
      }));
      return updatedList;
    });
  };

  const deleteAcademicRecord = (id: string) => {
    setAcademicRecords(prev => prev.filter(r => r.id !== id));
  };

  const addBehaviorLog = (log: Omit<BehaviorLog, 'id'>) => {
    const newLog: BehaviorLog = {
      id: 'b_new_' + Date.now(),
      ...log
    };
    setBehaviorLogs(prev => [newLog, ...prev]);
  };

  const addAssignment = (assign: Omit<Assignment, 'id'>) => {
    const newAss: Assignment = {
      id: 'as_new_' + Date.now(),
      ...assign
    };
    setAssignments(prev => [newAss, ...prev]);
  };

  const updateAssignment = (assign: Assignment) => {
    setAssignments(prev => prev.map(a => a.id === assign.id ? assign : a));
  };

  const applyModification = (mod: Omit<AppliedModification, 'id'>) => {
    const newMod: AppliedModification = {
      id: 'am_new_' + Date.now(),
      ...mod
    };
    setAppliedModifications(prev => [newMod, ...prev]);
  };

  const addHistoryItem = (item: Omit<CommsHistory, 'id'>) => {
    const newHist: CommsHistory = {
      id: 'ch_new_' + Date.now(),
      ...item
    };
    setCommsHistory(prev => [newHist, ...prev]);
  };

  const regenerateGroups = () => {
    setGroups(prev => prev.map(g => ({
      ...g,
      avgScore: Math.min(100, Math.max(50, g.avgScore + Math.floor(Math.random() * 5) - 2))
    })));
  };

  // Prevent flash or SSR mismatch during hydration
  const loggedInTeacherVal = isClient ? loggedInTeacher : null;

  return (
    <EduPulseContext.Provider
      value={{
        students,
        setStudents,
        groups,
        setGroups,
        academicRecords,
        setAcademicRecords,
        behaviorLogs,
        setBehaviorLogs,
        interventions,
        setInterventions,
        assignments,
        setAssignments,
        appliedModifications,
        setAppliedModifications,
        commsHistory,
        setCommsHistory,
        selectedStudentId,
        setSelectedStudentId,
        loggedInTeacher: loggedInTeacherVal,
        setLoggedInTeacher: setLoggedInTeacherState,
        isAddStudentOpen,
        setIsAddStudentOpen,
        isCreateAssignmentOpen,
        setIsCreateAssignmentOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        notifications,
        setNotifications,
        login,
        logout,
        addStudent,
        addAcademicRecord,
        updateAcademicRecord,
        deleteAcademicRecord,
        addBehaviorLog,
        addAssignment,
        updateAssignment,
        applyModification,
        addHistoryItem,
        regenerateGroups
      }}
    >
      {children}
    </EduPulseContext.Provider>
  );
};

export const useEduPulse = () => {
  const context = useContext(EduPulseContext);
  if (context === undefined) {
    throw new Error('useEduPulse must be used within an EduPulseProvider');
  }
  return context;
};
