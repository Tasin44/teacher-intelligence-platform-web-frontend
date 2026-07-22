import { apiClient } from './client';

export interface GroupStudentMini {
  student_id: number;
  student_name: string;
  student_roll: string;
}

export interface ApiGroup {
  group_id: number;
  group_name: string;
  classification: 'advance' | 'on_track' | 'developing' | 'risk';
  tag: 'above_grade_level' | 'at_grade_level' | 'approaching_grade_level' | 'below_grade_level';
  avg_score: string;
  total_students: number;
  generated_by_ai: boolean;
  generated_at: string;
  students: GroupStudentMini[];
}

export interface PaginatedGroups {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiGroup[];
}

export interface GroupStats {
  total_students: number;
  total_groups: number;
  avg_group_size: number;
  last_group_formed: string | null;
}

export function generateGroups() {
  return apiClient.post<ApiGroup[]>('/api/groups/generate');
}

export function getGroupStats() {
  return apiClient.get<GroupStats>('/api/groups/stats');
}

export function getGroups() {
  return apiClient.get<PaginatedGroups>('/api/groups');
}

export function updateGroup(groupId: number, data: Partial<ApiGroup>) {
  return apiClient.patch<ApiGroup>(`/api/groups/${groupId}/`, data);
}

export interface GroupGenerationHistoryItem {
  date: string;
  groups_formed: number;
}

export function getGenerationHistory() {
  return apiClient.get<GroupGenerationHistoryItem[]>('/api/groups/generate/history');
}
