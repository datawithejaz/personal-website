import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for about.html.
 *
 * Sections:
 *   - Bio: photo, placeholder, bio text
 *   - Contact: email link (data-eml), social buttons
 */
export class AboutPage extends BasePage {
  readonly bioPhoto: Locator;
  readonly bioPhotoPlaceholder: Locator;
  readonly bioSection: Locator;

  readonly contactSection: Locator;
  readonly contactEmailLink: Locator;
  readonly linkedInButton: Locator;
  readonly tikTokButton: Locator;
  readonly instagramButton: Locator;

  constructor(page: Page) {
    super(page);

    this.bioPhoto = page.locator('.bio-photo');
    this.bioPhotoPlaceholder = page.locator('.bio-photo-placeholder');
    this.bioSection = page.locator('.bio-section');

    this.contactSection = page.locator('#contact');
    this.contactEmailLink = page.locator('.contact-email-link[data-eml]');
    this.linkedInButton = page.locator('.contact-socials a[href*="linkedin"]');
    this.tikTokButton = page.locator('.contact-socials a[href*="tiktok"]');
    this.instagramButton = page.locator('.contact-socials a[href*="instagram"]');
  }

  async goto() {
    await super.goto('/about.html');
  }
}
