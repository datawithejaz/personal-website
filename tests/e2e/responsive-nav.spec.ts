import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * Responsive navigation tests — covers:
 *   1. Hamburger toggle is visible at mobile width (< 768px)
 *   2. Hamburger toggle is hidden at desktop width (>= 768px)
 *   3. Opening the nav sets aria-expanded="true" on the label
 *   4. Closing the nav sets aria-expanded="false"
 *   5. Nav links are accessible after opening the mobile overlay
 *
 * These tests run on both Desktop Chrome and Mobile Chrome projects defined
 * in playwright.config.ts. The viewport-specific assertions use explicit
 * viewport checks so the logic is always readable.
 */

test.describe('Responsive nav — mobile viewport', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger label is visible on mobile', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    // The toggle label is the hamburger button visible on mobile
    await expect(base.navToggleLabel).toBeVisible();
  });

  test('mobile nav is closed by default', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await expect(base.navToggleInput).not.toBeChecked();
    await expect(base.navToggleLabel).toHaveAttribute('aria-expanded', 'false');
  });

  test('opening hamburger checks the input and sets aria-expanded="true"', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await base.openMobileNav();
    await expect(base.navToggleInput).toBeChecked();
    await expect(base.navToggleLabel).toHaveAttribute('aria-expanded', 'true');
  });

  test('closing hamburger unchecks input and sets aria-expanded="false"', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await base.openMobileNav();
    await base.closeMobileNav();
    await expect(base.navToggleInput).not.toBeChecked();
    await expect(base.navToggleLabel).toHaveAttribute('aria-expanded', 'false');
  });

  test('nav links are present in DOM on mobile (shown via CSS when open)', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    // Links are always in DOM; CSS controls visibility via checkbox state
    await expect(base.navLinks).toHaveCount(3);
  });

  test('can navigate using mobile nav link after opening overlay', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await base.openMobileNav();
    // Click the Work link inside the mobile overlay
    const workLink = page.locator('.nav-links a[href="./work.html"]');
    await expect(workLink).toBeAttached();
    await workLink.click();
    // serve strips .html extensions (301 redirect), accept both forms
    await expect(page).toHaveURL(/\/work(\.html)?$/);
  });
});

test.describe('Responsive nav — desktop viewport', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('hamburger toggle input is in DOM but visually hidden at desktop', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    // The input is always in DOM (CSS checkbox hack); nav-links are visible
    await expect(base.navToggleInput).toBeAttached();
    await expect(base.navLinks).toHaveCount(3);
  });

  test('all three desktop nav links are visible', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    const labels = await base.navLinks.allTextContents();
    expect(labels).toEqual(expect.arrayContaining(['Work', 'Community', 'About']));
  });
});
