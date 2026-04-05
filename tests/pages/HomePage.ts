import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for index.html — the home page.
 *
 * Sections:
 *   - Hero: role label, name, intro, tags, CTA buttons, hero photo
 *   - What I Do: 4 elevated cards
 *   - Stats Strip: 4 stat items
 */
export class HomePage extends BasePage {
  readonly heroRole: Locator;
  readonly heroName: Locator;
  readonly heroIntro: Locator;
  readonly heroTags: Locator;
  readonly heroCtaSeeWork: Locator;
  readonly heroCtaGetInTouch: Locator;
  readonly heroPhoto: Locator;

  readonly whatIDoCards: Locator;

  readonly statsStrip: Locator;
  readonly statItems: Locator;

  constructor(page: Page) {
    super(page);

    this.heroRole = page.locator('.hero-role');
    this.heroName = page.locator('.hero-name');
    this.heroIntro = page.locator('.hero-intro');
    this.heroTags = page.locator('.hero-tags');
    this.heroCtaSeeWork = page.locator('.hero-cta a[href="./work.html"]');
    this.heroCtaGetInTouch = page.locator('.hero-cta a[href="./about.html#contact"]');
    this.heroPhoto = page.locator('.hero-photo');

    this.whatIDoCards = page.locator('.cards-grid .card--elevated');

    this.statsStrip = page.locator('.stats-strip');
    this.statItems = page.locator('.stat-item');
  }

  async goto() {
    await super.goto('/');
  }
}
