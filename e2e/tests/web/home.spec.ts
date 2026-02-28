import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the site title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('GPA-MN');
  });
});
