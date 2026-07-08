/**
 * Academic Feedback API — mirrors /api/feedback/ endpoints.
 */
import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateFeedbackPayload {
  student_roll: string;
  subject: string;
  title: string;
  score: number;
  areas_for_improvement?: string;
  assessment_date: string;   // YYYY-MM-DD
  teacher_notes?: string;
}

export interface ApiFeedback {
  feedback_id: number;
  subject: string;
  title: string;
  score: string;            // decimal string e.g. "85.50"
  ccss_code: string | null;
  assessment_date: string;
  status: 'graded' | 'pending';
}

export interface PaginatedFeedback {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiFeedback[];
}

// ─── API functions ────────────────────────────────────────────────────────────

export function createFeedback(payload: CreateFeedbackPayload) {
  return apiClient.post<ApiFeedback>('/api/feedback/', payload);
}

export function getFeedback() {
  return apiClient.get<PaginatedFeedback>('/api/feedback');
}
