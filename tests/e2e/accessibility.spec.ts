import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { AboutPage } from '../pages/AboutPage';

/**
 * Accessibility tests — covers:
 *   1. Skip link is present and targets #main on every page
 *   2. <main id="main"> exists on every page
 *   3. <nav aria-label="Main navigation"> is present
 *   4. Mobile hamburger label has aria-label and role="button"
 *   5. aria-expanded on hamburger reflects open/closed state
 *   6. Footer social icons have aria-label (no empty links)
 *   7. Bio photo has non-empty alt text
 *   8. <html lang="en"> is set on every page
 *   9. Decorative SVG icons have aria-hidden="true"
 *  10. Contact section has id="contact" anchor
 */

const ALL_PAGES = ['/', '/work.html', '/community.html', '/about.html', '/blog/'];

test.describe('Accessibility — fundamental landmarks', () => {
  for (const path of ALL_PAGES) {
    test(`<main id="main"> exists on ${path}`, async ({ page }) => {
      const base = new BasePage(page);
      await base.goto(path);
      await expect(page.locator('main#main')).toHaveCount(1);
    });

    test(`<html lang="en"> is set on ${path}`, async ({ page }) => {
      const base = new BasePage(page);
      await base.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });

    test(`<nav aria-label> is present on ${path}`, async ({ page }) => {
      const base = new BasePage(page);
      await base.goto(path);
      await expect(page.locator('nav[aria-label]')).toHaveCount(1);
    });
  }
});

test.describe('Accessibility — skip link', () => {
  for (const path of ALL_PAGES) {
    test(`skip link targets #main on ${path}`, async ({ page }) => {
      const base = new BasePage(page);
      await base.goto(path);
      await expect(base.skipLink).toHaveAttribute('href', '#main');
    });
  }

  test('skip link moves focus to main content when activated', async ({ page }) => {
    // NOTE: This test requires <main id="main" tabindex="-1"> in the HTML for
    // programmatic focus to work. Without tabindex="-1", browsers do not allow
    // focus to be set on a non-interactive element via anchor navigation.
    // This is currently a known accessibility gap — the test is quarantined
    // until tabindex="-1" is added to all <main> elements.
    test.fixme(true, 'Known gap: <main> needs tabindex="-1" to be programmatically focusable via skip link. Tracked for HTML fix.');

    const base = new BasePage(page);
    await base.goto('/');
    await page.keyboard.press('Tab');
    await expect(base.skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    const main = page.locator('main#main');
    await expect(main).toBeFocused();
  });
});

test.describe('Accessibility — hamburger toggle', () => {
  // The hamburger is only visible on mobile viewports (< 768px)
  // Use mobile viewport for all hamburger-related accessibility checks
  test.use({ viewport: { width: 390, height: 844 } });

  test('toggle label has aria-label and role="button"', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await expect(base.navToggleLabel).toHaveAttribute('aria-label', 'Toggle menu');
    await expect(base.navToggleLabel).toHaveAttribute('role', 'button');
  });

  test('initial aria-expanded is "false"', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await expect(base.navToggleLabel).toHaveAttribute('aria-expanded', 'false');
  });

  test('aria-expanded changes to "true" on open', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await base.openMobileNav();
    await expect(base.navToggleLabel).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('Accessibility — footer social links', () => {
  for (const path of ALL_PAGES) {
    test(`footer social links have aria-label on ${path}`, async ({ page }) => {
      const base = new BasePage(page);
      await base.goto(path);
      const socialLinks = base.footerSocialLinks;
      const count = await socialLinks.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const ariaLabel = await socialLinks.nth(i).getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
    });
  }
});

test.describe('Accessibility — images', () => {
  test('bio photo has non-empty alt attribute', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    const alt = await about.bioPhoto.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt!.length).toBeGreaterThan(0);
  });

  test('decorative SVG icons in footer use aria-hidden="true"', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    const footerSvgs = page.locator('footer .footer-social svg');
    const count = await footerSvgs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(footerSvgs.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });
});

test.describe('Accessibility — contact anchor', () => {
  test('about.html has #contact section anchor', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await expect(about.contactSection).toBeAttached();
    await expect(about.contactSection).toHaveAttribute('id', 'contact');
  });

  test('navigating to about.html#contact scrolls to contact section', async ({ page }) => {
    await page.goto('/about.html#contact');
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport({ ratio: 0.1 });
  });
});
