import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Ejaz Ahmed personal website E2E tests.
 * Serves the static site locally with `npx serve` before running tests.
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Run all tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failing tests once on CI, never locally
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI to reduce flakiness from resource contention
  workers: process.env.CI ? 1 : undefined,

  // Reporter: HTML report + JUnit XML for CI pipelines
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  use: {
    // Base URL — served locally by `npx serve . -l 3000`
    baseURL: 'http://localhost:3000',

    // Capture trace on first retry for debugging failures
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'on-first-retry',

    // Default timeout for actions
    actionTimeout: 10_000,

    // Default navigation timeout
    navigationTimeout: 30_000,
  },

  // Output folder for test artifacts (screenshots, videos, traces)
  outputDir: 'test-results/artifacts',

  // Global timeout per test
  timeout: 30_000,

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        // Ensure mobile viewport triggers the hamburger nav (< 768px)
        viewport: { width: 390, height: 844 },
      },
    },
  ],

  // Start a local server before running tests
  webServer: {
    command: 'npx serve . -l 3000 --no-clipboard',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
