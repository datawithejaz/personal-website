import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * Email protection tests — covers:
 *   1. All [data-eml] elements get mailto href populated by JS
 *   2. The email address constructed is correct
 *   3. Span text inside contact link is populated
 *   4. Email protection works on every page that has [data-eml] elements
 *
 * The JS protection splits the address into two parts:
 *   p = ['ejazahmed.workemail', 'gmail.com']
 *   addr = p[0] + '@' + p[1]
 * So the expected href is: mailto:ejazahmed.workemail@gmail.com
 */

const EXPECTED_EMAIL = 'ejazahmed.workemail@gmail.com';
const EXPECTED_MAILTO = `mailto:${EXPECTED_EMAIL}`;

const PAGES_WITH_EMAIL = ['/', '/work.html', '/community.html', '/about.html'];

test.describe('Email protection — [data-eml] href injection', () => {
  for (const path of PAGES_WITH_EMAIL) {
    test(`footer [data-eml] on ${path} has correct mailto href`, async ({ page }) => {
      const base = new BasePage(page);
      await base.goto(path);
      // waitForJsInit already ensures data-eml is populated
      await expect(base.footerEmail).toHaveAttribute('href', EXPECTED_MAILTO);
    });
  }

  test('contact page email link has correct mailto href', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/about.html');
    const contactLink = page.locator('.contact-email-link[data-eml]');
    await expect(contactLink).toHaveAttribute('href', EXPECTED_MAILTO);
  });

  test('contact page email link span contains the email address', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/about.html');
    const span = page.locator('.contact-email-link[data-eml] span');
    await expect(span).toHaveText(EXPECTED_EMAIL);
  });

  test('email protection runs without JS runtime errors (non-CSP/network)', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    const base = new BasePage(page);
    await base.goto('/about.html');

    // In the local test environment, GA4 and third-party analytics fire CSP
    // violations and network errors because the test server is localhost, not
    // the production domain. These are expected and should be ignored.
    // We only care about errors originating from our own code (main.js).
    const jsErrors = errors.filter((e) => {
      const isNetworkError = e.includes('Failed to load resource') || e.includes('net::ERR');
      const isCspViolation = e.includes('Content Security Policy') || e.includes('violates the following');
      const isAnalytics = e.includes('google-analytics') || e.includes('googletagmanager') ||
                          e.includes('doubleclick') || e.includes('google.co.uk') ||
                          e.includes('Connecting to') || e.includes('Fetch API cannot load');
      return !isNetworkError && !isCspViolation && !isAnalytics;
    });

    expect(jsErrors).toEqual([]);
  });

  test('multiple [data-eml] elements on a page all get the same address', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/about.html');
    const allEmlLinks = page.locator('[data-eml]');
    const count = await allEmlLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(allEmlLinks.nth(i)).toHaveAttribute('href', EXPECTED_MAILTO);
    }
  });
});
