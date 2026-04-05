import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * Navigation tests — covers:
 *   1. All nav links are present and resolve to correct pages
 *   2. Active state (aria-current="page") is set correctly on each page
 *   3. Nav logo navigates home
 *   4. Skip link is present on every page
 */

const PAGES = [
  { path: '/',             activeLabel: null,        title: 'Ejaz Ahmed | Marketing Data Analyst' },
  { path: '/work.html',    activeLabel: 'Work',       title: 'Work | Ejaz Ahmed' },
  { path: '/community.html', activeLabel: 'Community', title: 'Content & Community | Ejaz Ahmed' },
  { path: '/about.html',   activeLabel: 'About',      title: 'About | Ejaz Ahmed' },
  { path: '/blog/',        activeLabel: null,         title: 'Blog | Coming Soon | Ejaz Ahmed' },
];

test.describe('Navigation — page titles and active state', () => {
  for (const { path, activeLabel, title } of PAGES) {
    test(`${path} has correct <title>`, async ({ page }) => {
      const base = new BasePage(page);
      await base.goto(path);
      await expect(page).toHaveTitle(title);
    });

    if (activeLabel) {
      test(`${path} marks "${activeLabel}" as active in nav`, async ({ page }) => {
        const base = new BasePage(page);
        await base.goto(path);

        // The active link should have aria-current="page"
        const activeLink = page.locator('.nav-links a[aria-current="page"]');
        await expect(activeLink).toHaveCount(1);
        await expect(activeLink).toHaveText(activeLabel);
      });
    }
  }
});

test.describe('Navigation — link destinations', () => {
  // Use desktop viewport so nav links are always visible without hamburger
  test.use({ viewport: { width: 1280, height: 800 } });

  test('Work nav link navigates to Work page', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await page.locator('.nav-links a[href="./work.html"]').click();
    // serve strips .html — accept both /work and /work.html
    await expect(page).toHaveURL(/\/work(\.html)?$/);
    await expect(page).toHaveTitle(/Work/);
  });

  test('Community nav link navigates to Community page', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await page.locator('.nav-links a[href="./community.html"]').click();
    await expect(page).toHaveURL(/\/community(\.html)?$/);
    await expect(page).toHaveTitle(/Community/);
  });

  test('About nav link navigates to About page', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await page.locator('.nav-links a[href="./about.html"]').click();
    await expect(page).toHaveURL(/\/about(\.html)?$/);
    await expect(page).toHaveTitle(/About/);
  });

  test('Nav logo navigates to home from an inner page', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/work.html');
    await base.navLogo.click();
    await expect(page).toHaveURL(/\/(index(\.html)?)?$/);
  });
});

test.describe('Navigation — skip link', () => {
  for (const { path } of PAGES) {
    test(`skip link exists on ${path}`, async ({ page }) => {
      const base = new BasePage(page);
      await base.goto(path);
      await expect(base.skipLink).toBeAttached();
      await expect(base.skipLink).toHaveAttribute('href', '#main');
    });
  }
});

test.describe('Navigation — footer links', () => {
  test('footer email link is populated on home page', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await expect(base.footerEmail).toHaveAttribute('href', 'mailto:ejazahmed.workemail@gmail.com');
  });

  test('footer social links are present on home page', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await expect(base.footerSocialLinks).toHaveCount(3);
    const hrefs = await base.footerSocialLinks.evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).href)
    );
    expect(hrefs.some((h) => h.includes('linkedin.com'))).toBe(true);
    expect(hrefs.some((h) => h.includes('tiktok.com'))).toBe(true);
    expect(hrefs.some((h) => h.includes('instagram.com'))).toBe(true);
  });
});
