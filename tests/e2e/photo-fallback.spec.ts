import { test, expect } from '@playwright/test';
import { AboutPage } from '../pages/AboutPage';

/**
 * Photo fallback tests — covers:
 *   1. When the profile image loads successfully, the placeholder is NOT active
 *   2. When the profile image fails to load, the placeholder becomes visible
 *   3. The fallback also fires when the image has already failed before JS runs
 *
 * The fallback logic in main.js:
 *   - Listens for 'error' on .bio-photo
 *   - Adds .is-hidden to photo, .is-active to the next sibling (.bio-photo-placeholder)
 *   - Also checks photo.complete && photo.naturalWidth === 0 (already-failed case)
 */

test.describe('Photo fallback — profile image', () => {
  test('photo element and placeholder are both present in DOM', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await expect(about.bioPhoto).toBeAttached();
    await expect(about.bioPhotoPlaceholder).toBeAttached();
  });

  test('placeholder shows fallback "E" text', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await expect(about.bioPhotoPlaceholder).toHaveText('E');
  });

  test('placeholder is NOT active when image loads successfully', async ({ page }) => {
    // Serve a valid 1×1 pixel WebP so the image never errors
    await page.route('**/assets/images/my-image.webp', async (route) => {
      // Minimal valid WebP (1x1 transparent)
      const webpBytes = Buffer.from(
        'UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoBAAEAAkA4JYgCdAEO/gKOAAD++P/+' +
          '//7//v/+//7//v/+//7//v/+//4A',
        'base64'
      );
      await route.fulfill({
        status: 200,
        contentType: 'image/webp',
        body: webpBytes,
      });
    });

    const about = new AboutPage(page);
    await about.goto();

    // Wait for image to load
    await page.waitForFunction(() => {
      const img = document.querySelector('.bio-photo') as HTMLImageElement | null;
      return img !== null && img.complete;
    });

    await expect(about.bioPhotoPlaceholder).not.toHaveClass(/is-active/);
    await expect(about.bioPhoto).not.toHaveClass(/is-hidden/);
  });

  test('placeholder becomes active when image fails to load', async ({ page }) => {
    // Force the profile image to return 404
    await page.route('**/assets/images/my-image.webp', (route) =>
      route.fulfill({ status: 404 })
    );

    const about = new AboutPage(page);
    await about.goto();

    // JS adds .is-active to placeholder on image error
    await expect(about.bioPhotoPlaceholder).toHaveClass(/is-active/, { timeout: 8_000 });
    await expect(about.bioPhoto).toHaveClass(/is-hidden/, { timeout: 8_000 });
  });

  test('already-failed image triggers fallback synchronously on DOMContentLoaded', async ({ page }) => {
    // Block the image so it never loads (browser reports naturalWidth === 0)
    await page.route('**/assets/images/my-image.webp', (route) => route.abort('failed'));

    const about = new AboutPage(page);
    await about.goto();

    await expect(about.bioPhotoPlaceholder).toHaveClass(/is-active/, { timeout: 8_000 });
  });
});
