import { AxiosError } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { createApiClient, normalizeApiError } from './client';

describe('API client foundation', () => {
  it('uses the endpoint without making requests on creation', () => {
    const client = createApiClient({ apiBaseUrl: 'https://api.example.test' });
    expect(client.defaults.baseURL).toBe('https://api.example.test');
  });
  it('rejects unconfigured requests before reaching the network', async () => {
    const client = createApiClient({ apiBaseUrl: undefined });
    const adapter = vi.fn();
    await expect(client.get('/documents', { adapter })).rejects.toThrow(
      'not configured',
    );
    expect(adapter).not.toHaveBeenCalled();
  });
  it('normalizes network failures without exposing raw error details', () => {
    expect(normalizeApiError(new AxiosError('private details')).message).toBe(
      'The API could not be reached.',
    );
  });
});
