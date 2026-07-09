import { apiClient } from './client';

export interface DashboardSummary {
  total_students: number;
  risk_students: number;
  on_track_students: number;
  advance_students: number;
  developing_students: number;
}

export interface SubjectPerformance {
  subject: string;
  avg_score: number;
}

export interface ActivityLog {
  activity_type: string;
  description: string;
  created_at: string;
}

export interface BestSubject {
  student_id: number;
  student_name: string;
  best_subject: string;
  avg_score: number;
}

export function getDashboardSummary() {
  return apiClient.get<DashboardSummary>('/api/dashboard/summary');
}

export function getSubjectPerformance() {
  return apiClient.get<SubjectPerformance[]>('/api/dashboard/subject-performance');
}

export function getRecentActivity(limit = 10) {
  return apiClient.get<ActivityLog[]>(`/api/dashboard/recent-activity?limit=${limit}`);
}

export function getBestSubject() {
  return apiClient.get<BestSubject[]>('/api/dashboard/best-subject');
}
