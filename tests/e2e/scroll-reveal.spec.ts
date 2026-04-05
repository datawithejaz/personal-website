import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * Scroll reveal tests — covers:
 *   1. [data-reveal] elements exist on every page
 *   2. Elements above-the-fold gain .is-visible on page load
 *   3. Elements below-the-fold gain .is-visible after scrolling
 *
 * The IntersectionObserver in main.js uses threshold: 0.12, rootMargin -40px.
 * We trigger visibility by scrolling the full page height in steps.
 */

test.describe('Scroll reveal — home page', () => {
  test('page has [data-reveal] elements', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    const revealElements = page.locator('[data-reveal]');
    const count = await revealElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('hero elements become .is-visible on load (above fold)', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    // The hero-role is the first data-reveal element and sits above the fold
    const heroRole = page.locator('.hero-role[data-reveal]');
    await expect(heroRole).toBeAttached();
    // Wait for scroll reveal to fire for above-fold elements
    await expect(heroRole).toHaveClass(/is-visible/, { timeout: 5_000 });
  });

  test('stats strip becomes .is-visible after scrolling', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    const statsStrip = page.locator('.stats-strip[data-reveal]');
    await expect(statsStrip).toBeAttached();
    await base.scrollToBottom();
    await expect(statsStrip).toHaveClass(/is-visible/, { timeout: 5_000 });
  });

  test('all [data-reveal] elements gain .is-visible after full scroll', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/');
    await base.scrollToBottom();

    const allVisible = await page.evaluate(() => {
      const els = document.querySelectorAll('[data-reveal]');
      const notVisible: string[] = [];
      els.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          notVisible.push(el.tagName + '.' + Array.from(el.classList).join('.'));
        }
      });
      return notVisible;
    });

    expect(allVisible).toEqual([]);
  });
});

test.describe('Scroll reveal — work page', () => {
  test('case study cards become .is-visible after scrolling', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/work.html');
    await base.scrollToBottom();
    const cards = page.locator('.case-study-card[data-reveal]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveClass(/is-visible/, { timeout: 5_000 });
    }
  });
});

test.describe('Scroll reveal — about page', () => {
  test('bio section becomes .is-visible after scrolling', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/about.html');
    await base.scrollToBottom();
    const bioSection = page.locator('.bio-section[data-reveal]');
    await expect(bioSection).toHaveClass(/is-visible/, { timeout: 5_000 });
  });
});

test.describe('Scroll reveal — community page', () => {
  test('content pillar items become .is-visible after scrolling', async ({ page }) => {
    const base = new BasePage(page);
    await base.goto('/community.html');
    await base.scrollToBottom();
    const pillars = page.locator('.pillar-item[data-reveal]');
    const count = await pillars.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(pillars.nth(i)).toHaveClass(/is-visible/, { timeout: 5_000 });
    }
  });
});
