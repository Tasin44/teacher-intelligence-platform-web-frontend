import { apiClient } from './client';

export interface StandardCoverage {
  standard: string;
  covered: boolean;
  notes: string;
}

export interface PacingRecommendation {
  pacing_id: number;
  topic: string;
  assignment_title: string;
  curriculum_adjustment: string;
  standards_coverage_checklist: StandardCoverage[];
  generated_at: string;
}

export function generatePacing(assignmentId: number) {
  return apiClient.post<PacingRecommendation>(`/api/pacing/generate/${assignmentId}`, {});
}

export function getPacingRecommendations() {
  return apiClient.get<PacingRecommendation[]>('/api/pacing/');
}
