# E2E Tests

End-to-end tests using Playwright.

## Setup

Install Playwright browsers:

```bash
npx playwright install
```

Or install a specific browser:

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## Running Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# View HTML report
npm run test:e2e:report
```

## Configuration

See `playwright.config.ts` for configuration details.

- **Test directory**: `tests/e2e/`
- **Browsers**: Chromium, Firefox, WebKit
- **Base URL**: `http://localhost:5173` (auto-starts dev server)
- **Reports**: HTML report in `playwright-report/`, JSON in `test-results/`

## Writing Tests

Tests follow Playwright's test structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Hello')).toBeVisible();
  });
});
```

## CI/CD

The configuration automatically adjusts for CI environments:

- Retries failed tests 2 times on CI
- Runs tests sequentially on CI
- Requires all browsers to be installed
