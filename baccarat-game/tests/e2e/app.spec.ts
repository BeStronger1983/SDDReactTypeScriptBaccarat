import { test, expect } from '@playwright/test';

test.describe('Baccarat Game - Basic E2E', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');

    // Check that the page loaded
    await expect(page).toHaveTitle(/Vite \+ React/);

    // Verify main heading exists
    await expect(page.getByRole('heading', { name: /Vite \+ React/i })).toBeVisible();
  });

  test('should have interactive button', async ({ page }) => {
    await page.goto('/');

    // Find the button
    const button = page.getByRole('button', { name: /count is/i });
    await expect(button).toBeVisible();

    // Click the button
    await button.click();

    // Verify count increased
    await expect(button).toHaveText('count is 1');

    // Click again
    await button.click();
    await expect(button).toHaveText('count is 2');
  });

  test('should display React and Vite logos', async ({ page }) => {
    await page.goto('/');

    // Check for logo images
    const viteLogo = page.getByAltText('Vite logo');
    const reactLogo = page.getByAltText('React logo');

    await expect(viteLogo).toBeVisible();
    await expect(reactLogo).toBeVisible();
  });
});
