import { expect, test } from '@playwright/test';

test('upload page works without API traffic or a backend', async ({ page }) => {
  const apiRequests: string[] = [];
  const errors: string[] = [];

  page.on('request', (request) => {
    if (['fetch', 'xhr'].includes(request.resourceType())) {
      apiRequests.push(request.url());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/upload');
  await expect(
    page.getByRole('heading', { name: 'Upload Documents', level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Choose files', exact: true }),
  ).toBeVisible();
  await expect(page.locator('input[type="file"]')).toBeHidden();
  expect(apiRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('files accumulate across selections and can be removed', async ({
  page,
}) => {
  await page.goto('/upload');
  const picker = page.locator('input[type="file"]');
  await picker.setInputFiles([
    { name: 'first.txt', mimeType: 'text/plain', buffer: Buffer.from('abc') },
    {
      name: 'second.md',
      mimeType: 'text/markdown',
      buffer: Buffer.from('hello'),
    },
  ]);
  await picker.setInputFiles({
    name: 'third.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('pdf'),
  });
  await expect(
    page.getByRole('heading', { name: 'Selected files (3)' }),
  ).toBeVisible();
  await expect(page.getByText('Total size: 11 B')).toBeVisible();
  await page
    .getByRole('button', { name: 'Remove second.md', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Selected files (2)' }),
  ).toBeVisible();
  await expect(page.getByText('Total size: 6 B')).toBeVisible();
  await expect(page.getByText('second.md', { exact: true })).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Remove first.txt', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Remove third.pdf', exact: true })
    .click();
  await expect(page.getByText('No files selected yet.')).toBeVisible();
});

test('selected file bytes and removals survive refresh', async ({ page }) => {
  await page.goto('/upload');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'session.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('session content'),
  });
  await expect(page.getByText('session.txt', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('session.txt', { exact: true })).toBeVisible();
  await expect(page.getByText('Total size: 15 B')).toBeVisible();
  const contents = await page.evaluate(
    () =>
      new Promise<string>((resolve, reject) => {
        const open = indexedDB.open('rag-upload-sessions', 1);
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const database = open.result;
          const request = database
            .transaction('sessions')
            .objectStore('sessions')
            .get(sessionStorage.getItem('rag-upload-session')!);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            const file = request.result[0].file as File;
            database.close();
            file.text().then(resolve, reject);
          };
        };
      }),
  );
  expect(contents).toBe('session content');
  await page
    .getByRole('button', { name: 'Remove session.txt', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('No files selected yet.')).toBeVisible();
});
