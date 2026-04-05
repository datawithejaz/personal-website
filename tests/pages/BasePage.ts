import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — shared selectors and helpers used by every page on the site.
 *
 * The site uses a CSS checkbox hack for mobile nav (#nav-toggle checkbox),
 * has a skip-link, and loads main.js deferred (so JS features initialise
 * after DOMContentLoaded).
 */
export class BasePage {
  readonly page: Page;

  // Navigation
  readonly navLogo: Locator;
  readonly navLinks: Locator;
  readonly navToggleInput: Locator;
  readonly navToggleLabel: Locator;

  // Skip link
  readonly skipLink: Locator;

  // Footer
  readonly footerEmail: Locator;
  readonly footerSocialLinks: Locator;
  readonly footerCopy: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navLogo = page.locator('.nav-logo');
    this.navLinks = page.locator('.nav-links a');
    this.navToggleInput = page.locator('#nav-toggle');
    this.navToggleLabel = page.locator('.nav-toggle-label');

    this.skipLink = page.locator('.skip-link');

    this.footerEmail = page.locator('footer [data-eml]');
    this.footerSocialLinks = page.locator('.footer-social a');
    this.footerCopy = page.locator('.footer-copy');
  }

  /**
   * Wait for main.js DOMContentLoaded initialisation to complete.
   * We detect this by waiting for at least one [data-eml] element to have
   * its href populated (email protection runs synchronously on DOMContentLoaded).
   */
  async waitForJsInit() {
    await this.page.waitForFunction(() => {
      const eml = document.querySelector('[data-eml]');
      return eml !== null && (eml as HTMLAnchorElement).href.startsWith('mailto:');
    }, { timeout: 10_000 });
  }

  /**
   * Returns true when the mobile hamburger menu is visually open.
   * The CSS checkbox hack shows .nav-links when #nav-toggle is checked.
   */
  async isMobileNavOpen(): Promise<boolean> {
    return this.navToggleInput.isChecked();
  }

  /**
   * Open the mobile nav by clicking the hamburger label.
   */
  async openMobileNav() {
    await this.navToggleLabel.click();
    await expect(this.navToggleInput).toBeChecked();
  }

  /**
   * Close the mobile nav by clicking the hamburger label again.
   */
  async closeMobileNav() {
    await this.navToggleLabel.click();
    await expect(this.navToggleInput).not.toBeChecked();
  }

  /**
   * Scroll to the bottom of the page to trigger scroll reveal on all elements.
   * Uses a step-wise scroll to satisfy the IntersectionObserver threshold (0.12),
   * then also uses scrollIntoView on every [data-reveal] element to ensure
   * elements near the viewport edge are intersected.
   */
  async scrollToBottom() {
    await this.page.evaluate(async () => {
      // Step 1: slow scroll to allow IntersectionObserver to fire at each step
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 200;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 60);
      });

      // Step 2: scroll each [data-reveal] element into view for any missed ones
      const revealEls = document.querySelectorAll('[data-reveal]');
      revealEls.forEach((el) => {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
    });
    // Allow all IntersectionObserver callbacks to fire
    await this.page.waitForTimeout(600);
  }

  /**
   * Convenience: navigate to a path and wait for JS initialisation.
   */
  async goto(path: string) {
    await this.page.goto(path);
    await this.waitForJsInit();
  }
}
