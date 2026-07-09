import { apiClient } from './client';

export interface AssignmentQuestion {
  question_id: number;
  question_text: string;
  question_order: number;
}

export interface ApiAssignment {
  assignment_id: number;
  title: string;
  subject: string;
  target_type: 'all_groups' | 'individual_student' | 'individual_group';
  target_student_name: string | null;
  target_group_name: string | null;
  ai_difficulty: 'Low' | 'Medium' | 'High';
  ccss_code: string | null;
  creation_date: string;
  due_date: string | null;
  instructions: string | null;
  number_of_questions: number;
  unique_assignment_code: string;
  tag: string | null;
  ai_generation_status: 'pending' | 'completed' | 'failed';
  questions: AssignmentQuestion[];
}

export interface PaginatedAssignments {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiAssignment[];
}

export interface CreateAssignmentPayload {
  title: string;
  subject: string;
  target_type: 'all_groups' | 'individual_student' | 'individual_group';
  target_student_roll?: string;
  target_group_id?: number;
  ai_difficulty: 'Low' | 'Medium' | 'High';
  ccss_code?: string;
  due_date?: string;
  instructions?: string;
  number_of_questions: number;
}

export function createAssignment(payload: CreateAssignmentPayload) {
  return apiClient.post<ApiAssignment>('/api/assignments/', payload);
}

export function getAssignments() {
  return apiClient.get<PaginatedAssignments>('/api/assignments');
}

export function getAssignment(id: number) {
  return apiClient.get<ApiAssignment>(`/api/assignments/${id}/`);
}

export function searchAssignments(query: string) {
  return apiClient.get<ApiAssignment[]>(`/api/assignments/search?q=${encodeURIComponent(query)}`);
}
