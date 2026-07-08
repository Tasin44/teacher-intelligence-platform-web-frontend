/**
 * Attendance API — mirrors /api/attendance/ endpoints.
 */
import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface MarkAttendancePayload {
  student_roll: string;
  attendance_date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface MarkAttendanceResponse {
  attendance_id: number;
  student_id: number;
  attendance_date: string;
  status: AttendanceStatus;
  monthly_attendance_rate: number;
}

export interface OffDayPayload {
  off_date: string; // YYYY-MM-DD
}

export interface OffDayResponse {
  off_day_id: number;
  off_date: string;
}

export interface AttendanceDay {
  date: string;
  status: AttendanceStatus;
}

export interface MonthlyAttendanceResponse {
  student_id: number;
  year: number;
  month: number;
  attendance_rate: number;
  days: AttendanceDay[];
}

// ─── API functions ────────────────────────────────────────────────────────────

export function markAttendance(payload: MarkAttendancePayload) {
  return apiClient.post<MarkAttendanceResponse>('/api/attendance/mark', payload);
}

export function createOffDay(payload: OffDayPayload) {
  return apiClient.post<OffDayResponse>('/api/attendance/off-day', payload);
}

export function getMonthlyAttendance(studentId: number, year: number, month: number) {
  return apiClient.get<MonthlyAttendanceResponse>(
    `/api/attendance/student/${studentId}/monthly?year=${year}&month=${month}`
  );
}
