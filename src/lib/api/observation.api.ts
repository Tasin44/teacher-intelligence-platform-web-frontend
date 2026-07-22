/**
 * Observations API — mirrors /api/observations/ endpoints.
 */
import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SettingTag = 'small_group' | 'one_to_one' | 'whole_class';

export interface CreateObservationPayload {
  student_roll: string;
  observation_date: string;  // YYYY-MM-DD
  setting_tag: SettingTag;
  notes?: string;
}

export interface ApiObservation {
  observation_id: number;
  observation_date: string;
  setting_tag: SettingTag;
  notes: string | null;
}

export interface PaginatedObservations {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiObservation[];
}

// ─── API functions ────────────────────────────────────────────────────────────

export function createObservation(payload: CreateObservationPayload) {
  return apiClient.post<ApiObservation>('/api/observations/', payload);
}

export function getObservations(student_roll?: string) {
  const query = student_roll ? `?student_roll=${encodeURIComponent(student_roll)}` : '';
  return apiClient.get<PaginatedObservations>(`/api/observations${query}`);
}
