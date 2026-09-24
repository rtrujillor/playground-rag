import { expect, test } from '@playwright/test';

test('home works without API traffic or a backend', async ({ page }) => {
  const apiRequests: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (['fetch', 'xhr'].includes(request.resourceType()))
      apiRequests.push(request.url());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'RAG Playground', level: 1 }),
  ).toBeVisible();
  await expect(page.locator('input, form')).toHaveCount(0);
  await expect(
    page.getByRole('navigation', { name: 'Main navigation' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'RAG Playground' }),
  ).toBeVisible();
  expect(apiRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('users can navigate between home, upload, and search', async ({
  page,
}) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await navigation.getByRole('link', { name: 'Upload', exact: true }).click();
  await expect(page).toHaveURL(/\/upload$/);
  await expect(
    page.getByRole('heading', { name: 'Upload Documents' }),
  ).toBeVisible();
  await navigation.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'RAG Playground' }),
  ).toBeVisible();
  await navigation.getByRole('link', { name: 'Search', exact: true }).click();
  await expect(page).toHaveURL(/\/search$/);
  await expect(
    page.getByRole('heading', { name: 'Search', exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Search', exact: true }),
  ).toBeVisible();
  await navigation.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});
