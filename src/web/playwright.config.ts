import { defineConfig } from '@playwright/test';

const externalUrl = process.env.PLAYWRIGHT_BASE_URL;
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: externalUrl ?? 'http://127.0.0.1:5173' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    {
      name: 'mobile',
      use: { viewport: { width: 375, height: 812 }, isMobile: true },
    },
  ],
  webServer: externalUrl
    ? undefined
    : {
        command: 'pnpm dev --host 127.0.0.1',
        url: 'http://127.0.0.1:5173',
        reuseExistingServer: false,
      },
});
