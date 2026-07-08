/**
 * Behavior Feedback API — mirrors /api/behavior-feedback/ endpoints.
 */
import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BehaviorClassification = 'positive' | 'neutral' | 'concern';

export interface CreateBehaviorPayload {
  student_roll: string;
  event_date: string;               // YYYY-MM-DD
  incident_classification: BehaviorClassification;
  engagement_rating: number;        // 1-5
  observation_note?: string;
}

export interface ApiBehaviorFeedback {
  behavior_id: number;
  event_date: string;
  incident_classification: BehaviorClassification;
  engagement_rating: number;
  observation_note: string | null;
}

export interface PaginatedBehaviorFeedback {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiBehaviorFeedback[];
}

// ─── API functions ────────────────────────────────────────────────────────────

export function createBehaviorFeedback(payload: CreateBehaviorPayload) {
  return apiClient.post<ApiBehaviorFeedback>('/api/behavior-feedback/', payload);
}

export function getBehaviorFeedback() {
  return apiClient.get<PaginatedBehaviorFeedback>('/api/behavior-feedback');
}
