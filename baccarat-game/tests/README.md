# Test Directory Structure

Comprehensive test suite for the Baccarat game application.

## Directory Organization

```
tests/
├── unit/                 # Unit tests (70% of tests)
├── integration/          # Integration tests (20% of tests)
├── e2e/                  # End-to-end tests (10% of tests)
└── setup.ts              # Shared test setup and configuration
```

## Test Pyramid Strategy

Following the test pyramid principle:

- **70% Unit Tests**: Fast, isolated tests for individual functions and
  components
- **20% Integration Tests**: Tests for module interactions and data flow
- **10% E2E Tests**: Full user journey tests across the entire application

## Coverage Goals

- **Overall Coverage**: ≥ 80% (statements, branches, functions, lines)
- **Game Logic Coverage**: ≥ 95% (critical business rules)
- **UI Components**: ≥ 80%
- **Hooks**: ≥ 80%
- **Services**: ≥ 95%
- **Utils**: ≥ 95%

## Test Frameworks

- **Unit/Integration**: Vitest + React Testing Library
- **E2E**: Playwright

## Running Tests

```bash
# Unit & Integration tests
npm test                  # Watch mode
npm run test:run          # Run once
npm run test:coverage     # With coverage report
npm run test:ui           # Vitest UI

# E2E tests
npm run test:e2e          # Headless mode
npm run test:e2e:ui       # Playwright UI
npm run test:e2e:headed   # With visible browser
npm run test:e2e:debug    # Debug mode

# All tests
npm run test:run && npm run test:e2e
```

## Test File Naming Convention

- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.test.ts` or `*.test.tsx`
- E2E tests: `*.spec.ts`

## TDD Workflow (Required)

1. **Write failing test first** - Define expected behavior
2. **Run test** - Verify it fails for the right reason
3. **Write minimal code** - Make the test pass
4. **Refactor** - Improve code while keeping tests green
5. **Repeat** - For each new feature or bug fix

## Example Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should do something specific', () => {
    // Arrange
    const input = setupTestData();

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

## Best Practices

1. **Independent tests**: Each test should run independently
2. **Descriptive names**: Test names should describe what they test
3. **AAA pattern**: Arrange, Act, Assert
4. **One assertion per test**: Keep tests focused
5. **Test behavior, not implementation**: Focus on what, not how
6. **Mock external dependencies**: Keep tests isolated
7. **Clean up**: Reset state after tests

## Coverage Reports

Coverage reports are generated in:

- **HTML**: `coverage/index.html`
- **JSON**: `coverage/coverage-final.json`
- **LCOV**: `coverage/lcov.info`

## CI/CD Integration

Tests run automatically on:

- Pre-commit hook (unit tests only, fast)
- Pull request (all tests)
- Main branch merge (all tests + coverage check)

## Common Issues

### Tests not found

```bash
# Ensure you're in the project root
cd /path/to/baccarat-game
npm run test:run
```

### Coverage threshold not met

```bash
# Check coverage report
npm run test:coverage
# Open coverage/index.html to see uncovered lines
```

### E2E tests failing

```bash
# Install browsers if not done
npx playwright install
# Run in headed mode to debug
npm run test:e2e:headed
```
