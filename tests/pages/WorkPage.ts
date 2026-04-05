import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for work.html.
 *
 * Sections:
 *   - Case study cards
 *   - Agency experience cards
 *   - Client industry tags
 *   - Personal projects (Data with Ejaz card with internal link)
 *   - CTA section
 */
export class WorkPage extends BasePage {
  readonly caseStudyCards: Locator;
  readonly agencyCards: Locator;
  readonly clientGroups: Locator;
  readonly dataWithEjazCardLink: Locator;
  readonly sectionCtaButton: Locator;

  constructor(page: Page) {
    super(page);

    this.caseStudyCards = page.locator('.case-study-card');
    this.agencyCards = page.locator('.agency-card');
    this.clientGroups = page.locator('.client-group');
    this.dataWithEjazCardLink = page.locator('.card--dark .card-link[href="./community.html"]');
    this.sectionCtaButton = page.locator('.section-cta .btn--primary');
  }

  async goto() {
    await super.goto('/work.html');
  }
}
