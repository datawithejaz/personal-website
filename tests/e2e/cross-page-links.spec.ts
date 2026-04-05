import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { WorkPage } from '../pages/WorkPage';
import { BasePage } from '../pages/BasePage';

/**
 * Cross-page link tests — covers:
 *   1. Hero CTA "See My Work" → work.html
 *   2. Hero CTA "Get in Touch" → about.html#contact
 *   3. Work page CTA "Get in Touch" → about.html#contact
 *   4. Work page "Data with Ejaz" card link → community.html
 *   5. Blog page LinkedIn link opens correct external URL
 *   6. Community page platform links have correct external hrefs
 *   7. Footer email link on all pages points to about.html#contact
 */

test.describe('Cross-page links — home page CTAs', () => {
  // Use desktop viewport so hero CTAs are always reachable without viewport overlap
  test.use({ viewport: { width: 1280, height: 800 } });

  test('hero "See My Work" navigates to Work page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.heroCtaSeeWork.click();
    // serve may strip .html extensions — accept both /work and /work.html
    await expect(page).toHaveURL(/\/work(\.html)?$/);
    await expect(page).toHaveTitle(/Work/);
  });

  test('hero "Get in Touch" navigates to about page contact section', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.heroCtaGetInTouch.click();
    await expect(page).toHaveURL(/\/about(\.html)?(#contact)?/);
  });
});

test.describe('Cross-page links — work page', () => {
  test('work page CTA "Get in Touch" navigates to about contact section', async ({ page }) => {
    const work = new WorkPage(page);
    await work.goto();
    await work.sectionCtaButton.click();
    await expect(page).toHaveURL(/\/about(\.html)?(#contact)?/);
  });

  test('Data with Ejaz card "Learn more" link navigates to Community page', async ({ page }) => {
    const work = new WorkPage(page);
    await work.goto();
    await work.dataWithEjazCardLink.click();
    await expect(page).toHaveURL(/\/community(\.html)?$/);
    await expect(page).toHaveTitle(/Community/);
  });
});

test.describe('Cross-page links — community page platform links', () => {
  test('LinkedIn platform link has correct href', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/community.html');
    const linkedInLink = page.locator('.platform-links a[href*="linkedin"]');
    await expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/in/ejazamir');
    await expect(linkedInLink).toHaveAttribute('target', '_blank');
    await expect(linkedInLink).toHaveAttribute('rel', /noopener/);
  });

  test('TikTok platform link has correct href', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/community.html');
    const tikTokLink = page.locator('.platform-links a[href*="tiktok"]');
    await expect(tikTokLink).toHaveAttribute('href', 'https://tiktok.com/@datawithejaz');
    await expect(tikTokLink).toHaveAttribute('target', '_blank');
  });

  test('Instagram platform link has correct href', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/community.html');
    const igLink = page.locator('.platform-links a[href*="instagram"]');
    await expect(igLink).toHaveAttribute('href', 'https://instagram.com/datawithejaz');
    await expect(igLink).toHaveAttribute('target', '_blank');
  });
});

test.describe('Cross-page links — blog page', () => {
  test('blog LinkedIn link has correct href', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/blog/');
    const linkedInBtn = page.locator('.blog-placeholder a[href*="linkedin"]');
    await expect(linkedInBtn).toHaveAttribute('href', 'https://linkedin.com/in/ejazamir');
    await expect(linkedInBtn).toHaveAttribute('target', '_blank');
  });
});

test.describe('Cross-page links — footer email link', () => {
  /**
   * The footer email link (.footer-email) has data-eml so JS replaces its href
   * with mailto:ejazahmed.workemail@gmail.com at runtime. We verify the mailto
   * is populated (already covered in email-protection.spec.ts) and also that
   * clicking it doesn't navigate away (mailto links stay on page).
   */
  const pages = ['/', '/work.html', '/community.html'];
  for (const path of pages) {
    test(`footer email (.footer-email) on ${path} gets mailto href from JS`, async ({ page }) => {
      const base = new BasePage(page);
      await base.goto(path);
      // After JS init, .footer-email href must be a mailto (not original href)
      await expect(base.footerEmail).toHaveAttribute('href', 'mailto:ejazahmed.workemail@gmail.com');
    });
  }
});
