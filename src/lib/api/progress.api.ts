import { apiClient } from './client';

export interface SubjectBreakdown {
  subject: string;
  avg_score: number;
}

export interface StudentOverallProgress {
  student_id: number;
  student_name: string;
  risk_status: string;
  reading_level: string;
  avg_score: number;
  attendance_rate: number;
  recommended_group: string | null;
  subject_breakdown: SubjectBreakdown[];
}

export interface MonthlyAttendance {
  year: number;
  month: number;
  attendance_rate: number | null;
  total_days: number;
}

export interface WeeklyScore {
  week_start: string;
  week_end: string;
  avg_score: number | null;
  count: number;
}

export interface ClassAttendance {
  class_attendance_rate: number;
  total_days_recorded: number;
}

export function getStudentOverallProgress(studentId: number) {
  return apiClient.get<StudentOverallProgress>(`/api/progress/student/${studentId}/overall`);
}

export function getStudentAttendanceTrend(studentId: number) {
  return apiClient.get<MonthlyAttendance[]>(`/api/progress/student/${studentId}/attendance`);
}

export function getStudentWeeklyScores(studentId: number) {
  return apiClient.get<WeeklyScore[]>(`/api/progress/student/${studentId}/scores-weekly`);
}

export function getClassAttendance() {
  return apiClient.get<ClassAttendance>('/api/progress/class-attendance');
}
