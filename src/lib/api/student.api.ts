/**
 * Student API — mirrors /api/students/ endpoints exactly.
 */
import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RiskStatus = 'on_track' | 'at_risk' | 'advance' | 'developing';

export interface ApiStudent {
  student_id: number;
  student_name: string;
  student_roll: string;
  student_image: string | null;
  student_grade: string;
  risk_status: RiskStatus;
  reading_level: string | null;
  parent_name: string | null;
  parent_email: string | null;
  avg_score: string | null;
  attendance_rate: string | null;
  recommended_group_name: string | null;
  created_at: string;
}

export interface PaginatedStudents {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiStudent[];
}

export interface ApiStudentDiagnostic {
  student: ApiStudent;
  diagnostic: {
    current_strengths: string[];
    skill_gaps_and_blockages: string[];
    generated_at: string;
  };
}

export interface GetStudentsParams {
  search?: string;
  risk_status?: RiskStatus;
  student_grade?: string;
  recommended_group?: number;
  ordering?: string;
}

export interface DashboardSummary {
  total_students: number;
  risk_students: number;
  on_track_students: number;
  advance_students: number;
  developing_students: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQuery(params: GetStudentsParams): string {
  const q = new URLSearchParams();
  if (params.search)            q.set('search', params.search);
  if (params.risk_status)       q.set('risk_status', params.risk_status);
  if (params.student_grade)     q.set('student_grade', params.student_grade);
  if (params.recommended_group) q.set('recommended_group', String(params.recommended_group));
  if (params.ordering)          q.set('ordering', params.ordering);
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

// ─── API functions ────────────────────────────────────────────────────────────

export function getStudents(params: GetStudentsParams = {}) {
  return apiClient.get<PaginatedStudents>(`/api/students/${buildQuery(params)}`);
}

export function getStudent(studentId: number) {
  return apiClient.get<ApiStudent>(`/api/students/${studentId}/`);
}

export function deleteStudent(studentId: number) {
  return apiClient.delete<void>(`/api/students/${studentId}/`);
}

export function searchStudents(query: string) {
  return apiClient.get<ApiStudent[]>(`/api/students/search/?q=${encodeURIComponent(query)}`);
}

/** Both create and update use FormData (handles image binary) */
export function createStudent(formData: FormData) {
  return apiClient.post<ApiStudent>('/api/students/', formData);
}

export function updateStudent(studentId: number, formData: FormData) {
  return apiClient.patch<ApiStudent>(`/api/students/${studentId}/`, formData);
}

export function getDashboardSummary() {
  return apiClient.get<DashboardSummary>('/api/dashboard/summary');
}

export function getStudentDiagnostic(studentId: number | string) {
  return apiClient.getFull<ApiStudentDiagnostic>(`/api/students/${studentId}/diagnostic/`);
}
