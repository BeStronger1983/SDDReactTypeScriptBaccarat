# NPM Scripts Reference

Comprehensive guide to all available npm scripts in this project.

## Core Development Scripts

### `npm run dev`

Start the Vite development server with hot module replacement (HMR).

```bash
npm run dev
# Opens: http://localhost:5173
```

**Use when**: Developing features, debugging UI, testing in browser

---

### `npm run build`

Build the application for production.

```bash
npm run build
# Output: dist/
```

**Process**:

1. TypeScript compilation (`tsc -b`)
2. Vite production build
3. Assets optimization and bundling

**Use when**: Preparing for deployment, testing production build

---

### `npm run preview`

Preview the production build locally.

```bash
npm run preview
# Opens: http://localhost:4173
```

**Use when**: Testing production build before deployment

---

## Code Quality Scripts

### `npm run lint`

Check code for linting errors (ESLint).

```bash
npm run lint
# Checks all .ts, .tsx, .js files
```

**Use when**: Before committing, during code review

---

### `npm run lint:fix`

Automatically fix linting errors where possible.

```bash
npm run lint:fix
# Auto-fixes: spacing, quotes, unused imports, etc.
```

**Use when**: Cleaning up code, fixing bulk linting issues

---

### `npm run format`

Format all code with Prettier.

```bash
npm run format
# Formats: .ts, .tsx, .js, .json, .css, .md
```

**Use when**: Before committing, ensuring consistent formatting

---

### `npm run format:check`

Check if code is formatted correctly (doesn't modify files).

```bash
npm run format:check
# Exit code 0: All formatted
# Exit code 1: Some files need formatting
```

**Use when**: In CI/CD pipelines, pre-commit checks

---

### `npm run type-check`

Validate TypeScript types without emitting files.

```bash
npm run type-check
# Runs: tsc --noEmit
```

**Use when**: Before committing, checking type safety

---

### `npm run validate`

Run all quality checks (lint + type-check + tests).

```bash
npm run validate
# Runs: lint → type-check → test:run
```

**Use when**: Before pushing, comprehensive validation

---

## Testing Scripts

### Unit & Integration Tests

#### `npm test`

Run tests in watch mode (default).

```bash
npm test
# Watch mode: re-runs tests on file changes
```

**Use when**: TDD workflow, developing features

---

#### `npm run test:run`

Run all unit/integration tests once.

```bash
npm run test:run
# Runs all tests in tests/unit and tests/integration
```

**Use when**: CI/CD, pre-push validation

---

#### `npm run test:watch`

Explicitly run tests in watch mode.

```bash
npm run test:watch
# Same as: npm test
```

**Use when**: Continuous testing during development

---

#### `npm run test:ui`

Run tests with Vitest UI.

```bash
npm run test:ui
# Opens: http://localhost:51204/__vitest__/
```

**Use when**: Debugging tests, visualizing test results

---

#### `npm run test:coverage`

Run tests with coverage report.

```bash
npm run test:coverage
# Generates: coverage/ directory
# Open: coverage/index.html
```

**Requirements**:

- Overall: ≥ 80%
- Services: ≥ 95%
- Utils: ≥ 95%

**Use when**: Checking test coverage, before releases

---

### E2E Tests (Playwright)

#### `npm run test:e2e`

Run all E2E tests in headless mode.

```bash
npm run test:e2e
# Auto-starts dev server
# Tests: Chrome, Firefox, Safari
```

**Use when**: CI/CD, comprehensive testing

---

#### `npm run test:e2e:ui`

Run E2E tests with Playwright UI.

```bash
npm run test:e2e:ui
# Opens: Playwright UI
```

**Use when**: Writing E2E tests, debugging

---

#### `npm run test:e2e:headed`

Run E2E tests with visible browser.

```bash
npm run test:e2e:headed
# See browser actions in real-time
```

**Use when**: Debugging test failures, developing E2E tests

---

#### `npm run test:e2e:debug`

Run E2E tests in debug mode.

```bash
npm run test:e2e:debug
# Pauses at each step
# Playwright Inspector opens
```

**Use when**: Debugging complex E2E scenarios

---

#### `npm run test:e2e:report`

View the last E2E test report.

```bash
npm run test:e2e:report
# Opens: HTML report in browser
```

**Use when**: Reviewing test results, investigating failures

---

## Maintenance Scripts

### `npm run prepare`

Setup Husky Git hooks (runs automatically on `npm install`).

```bash
npm run prepare
# Sets up: .husky/ hooks
```

**Use when**: First setup, after cloning repository

---

## Common Workflows

### Starting Development

```bash
npm install         # Install dependencies
npm run dev        # Start dev server
```

### Before Committing

```bash
npm run format     # Format code
npm run lint:fix   # Fix linting issues
npm run validate   # Run all checks
git add .
git commit -m "feat: your changes"
```

### Running All Tests

```bash
npm run test:run        # Unit/integration tests
npm run test:coverage   # With coverage
npm run test:e2e        # E2E tests
```

### Pre-deployment

```bash
npm run validate        # All quality checks
npm run build          # Build for production
npm run preview        # Test production build
```

### CI/CD Pipeline

```bash
npm ci                 # Clean install
npm run lint           # Check linting
npm run type-check     # Check types
npm run test:run       # Run unit tests
npm run test:e2e       # Run E2E tests
npm run build          # Build for production
```

---

## Script Categories Summary

| Category          | Scripts                                                                           |
| ----------------- | --------------------------------------------------------------------------------- |
| **Development**   | `dev`, `preview`                                                                  |
| **Build**         | `build`                                                                           |
| **Linting**       | `lint`, `lint:fix`                                                                |
| **Formatting**    | `format`, `format:check`                                                          |
| **Type Checking** | `type-check`                                                                      |
| **Unit Testing**  | `test`, `test:run`, `test:watch`, `test:ui`, `test:coverage`                      |
| **E2E Testing**   | `test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:e2e:debug`, `test:e2e:report` |
| **Validation**    | `validate`                                                                        |
| **Setup**         | `prepare`                                                                         |

---

## Tips

### Speed up testing

```bash
# Run specific test file
npm test -- src/services/baccaratRules.test.ts

# Run tests matching pattern
npm test -- --grep "should calculate"
```

### Debug specific E2E test

```bash
npm run test:e2e:debug -- tests/e2e/betting.spec.ts
```

### Check what will be formatted

```bash
npm run format:check
```

### Skip Git hooks temporarily

```bash
git commit --no-verify -m "message"
```

---

## Troubleshooting

### "Command not found"

```bash
# Ensure dependencies are installed
npm install --include=dev
```

### Tests failing

```bash
# Check if dev dependencies are installed
npm ls vitest jsdom playwright

# Reinstall if needed
rm -rf node_modules package-lock.json
npm install --include=dev
```

### Lint errors

```bash
# Auto-fix what's possible
npm run lint:fix

# Then manually fix remaining issues
npm run lint
```

### Type errors

```bash
# Check which files have errors
npm run type-check

# Fix errors in IDE or manually
```
