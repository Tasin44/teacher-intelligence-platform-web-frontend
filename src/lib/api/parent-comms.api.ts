import { apiClient } from './client';

export interface ParentMessage {
  message_id: number;
  student_name: string;
  student_roll: string;
  classification: string;
  tone: string;
  parent_email: string;
  message_text: string;
  status: 'draft' | 'sent';
  sent_at: string | null;
  created_at: string;
}

export interface GenerateMessagePayload {
  student_roll: string;
  classification: string;
  tone: string;
}

export function generateParentMessage(payload: GenerateMessagePayload) {
  return apiClient.post<ParentMessage>('/api/parent-messages/generate', payload);
}

export function getParentMessages() {
  return apiClient.get<ParentMessage[]>('/api/parent-messages/');
}

export function sendParentMessage(id: number) {
  return apiClient.post<ParentMessage>(`/api/parent-messages/${id}/send`, {});
}

export function updateParentMessage(id: number, message_text: string) {
  return apiClient.patch<ParentMessage>(`/api/parent-messages/${id}/`, { message_text });
}

export function downloadParentMessagePdf(id: number) {
  return apiClient.downloadPdf(`/api/parent-messages/${id}/download-pdf`, `parent_message_${id}.pdf`);
}
