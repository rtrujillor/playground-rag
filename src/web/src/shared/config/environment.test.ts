import { describe, expect, it } from 'vitest';
import { readEnvironment } from './environment';

describe('public API configuration', () => {
  it.each([{}, { VITE_API_BASE_URL: '' }])(
    'allows missing configuration: %j',
    (input) => {
      expect(readEnvironment(input).apiBaseUrl).toBeUndefined();
    },
  );
  it('accepts an HTTP endpoint', () => {
    expect(
      readEnvironment({ VITE_API_BASE_URL: 'https://api.example.test/v1' })
        .apiBaseUrl,
    ).toBe('https://api.example.test/v1');
  });
  it.each(['invalid', '/api', 'ftp://example.test'])('rejects %s', (value) => {
    expect(() => readEnvironment({ VITE_API_BASE_URL: value })).toThrow(
      'HTTP or HTTPS',
    );
  });
});
