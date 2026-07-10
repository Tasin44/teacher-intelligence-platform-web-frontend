import { apiClient } from './client';

export interface StudentNeedingAssistance {
  student_id: number;
  student_name: string;
  student_image: string | null;
  student_roll: string;
  student_grade: string;
  avg_score: number;
  risk_status: string;
  reading_level: string;
  parent_name: string | null;
  parent_email: string | null;
  identified_blockage: string;
}

export interface Intervention {
  intervention_id: number;
  target_type: 'individual_student' | 'individual_group';
  student_roll?: string;
  group_id?: number | null;
  student_name?: string;
  student_roll_out?: string;
  group_name?: string;
  intervention_type: string;
  reason: string;
  start_date: string;
  frequency: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export function getStudentsNeedingAssistance() {
  return apiClient.get<StudentNeedingAssistance[]>('/api/interventions/needing-assistance/');
}

export function getInterventions(targetType?: string) {
  const query = targetType ? `?target_type=${targetType}` : '';
  return apiClient.get<any>(`/api/interventions/${query}`);
}

export function createIntervention(payload: Partial<Intervention>) {
  return apiClient.post<Intervention>('/api/interventions/', payload);
}

export function updateIntervention(id: number, payload: Partial<Intervention>) {
  return apiClient.patch<Intervention>(`/api/interventions/${id}/`, payload);
}

export function deleteIntervention(id: number) {
  return apiClient.delete<void>(`/api/interventions/${id}/`);
}
