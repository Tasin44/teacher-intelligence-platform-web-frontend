import { apiClient } from './client';

export interface LessonRecommendation {
  lesson_rec_id: number;
  assignment_title: string;
  recommendation_date: string;
  recommendation_details: string; // JSON string in DB, but treated as string here. Needs parsing in UI
  applied_demographics: string | null;
  applied_student_name: string | null;
  applied_group_name: string | null;
  status: 'pending' | 'applied' | 'dismiss';
}

export interface LessonAssignmentStatus {
  assignment_id: number;
  title: string;
  subject: string;
  ai_status: 'pending' | 'completed' | 'failed';
  rec_status: 'applied' | 'dismiss' | null;
  recommendation_id: number | null;
}

export interface AIRecommendation {
  recommendation_id: number;
  student_name: string;
  reading_level: string;
  avg_score: string;
  attendance_rate: string;
  recommended_group: string | null;
  current_strengths: string;
  recommended_activities: string;
  skill_gaps: string;
  generated_at: string;
}

export function generateLessonRecommendation(assignmentId: number) {
  return apiClient.post<LessonRecommendation>(`/api/lesson-recommendations/generate/${assignmentId}`, {});
}

export function getLessonRecommendations(assignmentId?: number) {
  const query = assignmentId ? `?assignment_id=${assignmentId}` : '';
  return apiClient.get<LessonRecommendation[]>(`/api/lesson-recommendations/${query}`);
}

export function applyLessonRecommendation(id: number, payload: { applied_target_type: 'student' | 'group', applied_student_id?: number, applied_group_id?: number }) {
  return apiClient.post<LessonRecommendation>(`/api/lesson-recommendations/${id}/apply`, payload);
}

export function dismissLessonRecommendation(id: number) {
  return apiClient.patch<LessonRecommendation>(`/api/lesson-recommendations/${id}/dismiss`, {});
}

export function getAssignmentLessonStatus() {
  return apiClient.get<LessonAssignmentStatus[]>('/api/lesson-recommendations/assignment-status');
}

export function generateAIRecommendation(studentId: number) {
  return apiClient.post<AIRecommendation>(`/api/ai-recommendations/generate/${studentId}`, {});
}

export function getAIRecommendation(studentId: number) {
  return apiClient.get<AIRecommendation>(`/api/ai-recommendations/${studentId}`);
}
