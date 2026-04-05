import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * Favicon tests — covers:
 *   1. SVG favicon <link> is present with correct type on every page
 *   2. PNG favicon <link> (32×32) is present with correct type on every page
 *   3. Favicon files are served successfully (HTTP 200) by the dev server
 */

const ALL_PAGES = ['/', '/work.html', '/community.html', '/about.html', '/blog/'];

test.describe('Favicon — link elements present', () => {
  for (const path of ALL_PAGES) {
    test(`SVG and PNG favicon links present on ${path}`, async ({ page }) => {
      const base = new BasePage(page);
      await base.goto(path);

      const svgFavicon = page.locator('link[rel="icon"][type="image/svg+xml"]');
      const pngFavicon = page.locator('link[rel="icon"][type="image/png"]');

      await expect(svgFavicon).toHaveCount(1);
      await expect(pngFavicon).toHaveCount(1);
      await expect(pngFavicon).toHaveAttribute('sizes', '32x32');
    });
  }
});

test.describe('Favicon — files are accessible', () => {
  test('SVG favicon file returns 200', async ({ page }) => {
    const response = await page.request.get('/assets/images/favicon.svg');
    expect(response.status()).toBe(200);
  });

  test('PNG favicon file returns 200', async ({ page }) => {
    const response = await page.request.get('/assets/images/favicon-32.png');
    expect(response.status()).toBe(200);
  });
});
