import { z } from 'zod';

const environmentSchema = z.object({
  VITE_API_BASE_URL: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.url({ protocol: /^https?$/ }).optional(),
  ),
});

export function readEnvironment(input: Record<string, unknown>) {
  const parsed = environmentSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error('VITE_API_BASE_URL must be an absolute HTTP or HTTPS URL.');
  }
  return { apiBaseUrl: parsed.data.VITE_API_BASE_URL };
}
