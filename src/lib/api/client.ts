/**
 * Low-level HTTP client for the EduPulse Django backend.
 * - Automatically prefixes NEXT_PUBLIC_API_BASE_URL
 * - Attaches Bearer token from localStorage when available
 * - Returns the parsed JSON `data` field on success
 * - Throws an Error with the backend's `message` string on failure
 */

import { getAccessToken } from '@/lib/auth/token';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export class ApiError extends Error {
  statusCode: number;
  data: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type to application/json if the body is a string
  // If it's FormData, the browser will set it automatically with the boundary
  if (!headers['Content-Type'] && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Parse body regardless of status so we can read the `message` field
  let body: ApiResponse<T>;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(
      `Server returned non-JSON response (${response.status})`,
      response.status,
    );
  }

  if (!response.ok || !body.success) {
    throw new ApiError(body.message, body.statusCode ?? response.status, body.data);
  }

  return body.data;
}

export const apiClient = {
  get: <T>(path: string) =>
    request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
};
