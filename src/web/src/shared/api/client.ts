import axios from 'axios';
import { readEnvironment } from '../config/environment';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    return new ApiError(
      error.response
        ? 'The API request failed.'
        : 'The API could not be reached.',
      error.response?.status,
    );
  }
  return new ApiError('An unexpected API error occurred.');
}

export function createApiClient(
  environment = readEnvironment(import.meta.env),
) {
  const client = axios.create({
    baseURL: environment.apiBaseUrl,
    timeout: 15000,
  });
  client.interceptors.request.use((config) => {
    if (!environment.apiBaseUrl) {
      throw new ApiError('API access is not configured.');
    }
    return config;
  });
  client.interceptors.response.use(
    (response) => response,
    (error: unknown) =>
      Promise.reject(
        error instanceof ApiError ? error : normalizeApiError(error),
      ),
  );
  return client;
}
