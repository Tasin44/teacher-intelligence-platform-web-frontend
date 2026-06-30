export type Screen =
  | 'dashboard'
  | 'students' // has subviews 'input' and 'ilp'
  | 'grouping'
  | 'assignments'
  | 'interventions'
  | 'lessons'
  | 'progress'
  | 'parent-comms'
  | 'pacing'
  | 'chatbot'
  | 'settings';

export type StudentSubtab = 'input' | 'ilp';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  room: string;
  riskLevel: 'At Risk' | 'On Track' | 'Advanced' | 'Developing';
  readingLevel: string;
  avgScore: number;
  attendanceRate: number;
  group: 'A' | 'B' | 'C' | 'D';
  parentName: string;
  parentEmail: string;
  mathScore: number;
  scoreDeclineAlert?: boolean;
}

export interface AcademicRecord {
  id: string;
  studentId: string;
  subject: string;
  testName: string;
  score: number;
  date: string;
  readingLevel?: string;
  standards: string[];
}

export interface BehaviorLog {
  id: string;
  studentId: string;
  date: string;
  type: 'Positive' | 'Neutral' | 'Concern';
  notes: string;
  rating: number; // 1-5 stars
}

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late';
}

export interface Group {
  id: 'A' | 'B' | 'C' | 'D';
  name: string;
  type: 'Advanced' | 'On Track' | 'Developing' | 'At Risk';
  avgScore: number;
  studentIds: string[];
  tag: string;
  color: string;
  borderColor: string;
}

export interface GroupHistory {
  id: string;
  date: string;
  groupsCreatedCount: number;
  trigger: string;
}

export interface Assignment {
  id: string;
  title: string;
  type: 'Assignment' | 'Homework';
  difficulty: 'Low' | 'Medium' | 'High';
  targetType: 'Student' | 'Group' | 'Level';
  targetValue: string; // e.g. "Marcus Thompson" or "Group D" or "Below"
  dueDate: string;
  standards: string[];
  instructions: string;
  levelBadge: 'Below' | 'On Track' | 'Advanced';
  questionCount?: number;
  questions?: string[];
  subject?: string;
}

export interface Intervention {
  id: string;
  studentId: string;
  strategy: '1:1 Support' | 'Small Group' | 'Peer Support';
  activities: string[];
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  status: 'Active' | 'Completed';
  targetType?: 'student' | 'group';
  targetName?: string;
  groupId?: string;
}

export interface ReteachPlan {
  id: string;
  standard: string;
  studentCount: number;
  method: string;
}

export interface LessonSuggestion {
  id: string;
  type: 'struggling' | 'advanced';
  tag: string; // Scaffolding, Visual Aid, Simplified Text / Extension, Challenge, Enrichment
  description: string;
  standards: string[];
}

export interface AppliedModification {
  id: string;
  date: string;
  lessonName: string;
  modType: string;
  appliedFor: string;
  status: 'Applied' | 'In Progress';
}

export interface ParentCommsTemplate {
  id: string;
  studentId: string;
  type: 'Progress Update' | 'Concern' | 'Achievement';
  tone: 'Formal' | 'Friendly';
  message: string;
  aiGenerated: boolean;
}

export interface CommsHistory {
  id: string;
  date: string;
  studentId: string;
  type: 'Progress Update' | 'Concern' | 'Achievement';
  tone: 'Formal' | 'Friendly';
  sentBy: string;
}

export interface PacingSuggestion {
  id: string;
  priority: 'High' | 'Medium';
  suggestion: string;
  standardsImpacted: string;
}

export interface StandardsCoverage {
  code: string;
  name: string;
  covered: boolean;
  status: 'Mastered' | 'In Progress' | 'Not Started';
}
