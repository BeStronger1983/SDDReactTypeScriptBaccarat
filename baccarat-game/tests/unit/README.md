# Unit Tests

Unit tests for individual functions, components, and modules.

## Purpose

Test individual units of code in isolation to ensure they work correctly. Unit
tests should be fast, focused, and independent.

## What to Test

### Services (95%+ coverage required)

- **baccaratRules.ts**: All drawing rule branches
- **payoutCalculator.ts**: All payout scenarios
- **cardShoe.ts**: Deck creation, shuffling, dealing
- **storageService.ts**: localStorage operations
- **gameEngine.ts**: Game flow orchestration

### Utils (95%+ coverage required)

- **shuffle.ts**: Fisher-Yates algorithm correctness
- **cardUtils.ts**: Card value calculations
- **validators.ts**: Input validation edge cases
- **formatters.ts**: Data formatting

### Hooks (80%+ coverage)

- **useLocalStorage**: State persistence
- **useBalance**: Balance management
- **useBetting**: Betting logic
- **useGameState**: State machine transitions

### Components (80%+ coverage)

- **UI components**: Rendering, interactions, props
- **Game components**: Game-specific behavior
- **Layout components**: Display logic

## File Organization

```
tests/unit/
├── services/
│   ├── baccaratRules.test.ts
│   ├── payoutCalculator.test.ts
│   ├── cardShoe.test.ts
│   ├── storageService.test.ts
│   └── gameEngine.test.ts
├── utils/
│   ├── shuffle.test.ts
│   ├── cardUtils.test.ts
│   ├── validators.test.ts
│   └── formatters.test.ts
├── hooks/
│   ├── useLocalStorage.test.ts
│   ├── useBalance.test.ts
│   ├── useBetting.test.ts
│   └── useGameState.test.ts
└── components/
    ├── ui/
    │   ├── Button.test.tsx
    │   ├── Card.test.tsx
    │   └── Chip.test.tsx
    └── game/
        ├── BettingArea.test.tsx
        ├── CardHand.test.tsx
        └── GameTable.test.tsx
```

## Testing Services (Pure Functions)

```typescript
import { describe, it, expect } from 'vitest';
import { calculatePayout } from '@services/payoutCalculator';

describe('calculatePayout', () => {
  it('should calculate player bet payout at 1:1', () => {
    const result = calculatePayout('player', 100);
    expect(result).toBe(100);
  });

  it('should calculate banker bet payout at 1:0.95', () => {
    const result = calculatePayout('banker', 100);
    expect(result).toBe(95);
  });

  it('should calculate tie bet payout at 1:8', () => {
    const result = calculatePayout('tie', 100);
    expect(result).toBe(800);
  });
});
```

## Testing React Components

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@components/ui/Button';

describe('Button', () => {
  it('should render with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const onClick = vi.fn();
    const { user } = render(<Button label="Click" onClick={onClick} />);

    await user.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button label="Click" onClick={() => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Testing Custom Hooks

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBalance } from '@hooks/useBalance';

describe('useBalance', () => {
  it('should initialize with default balance', () => {
    const { result } = renderHook(() => useBalance());
    expect(result.current.balance).toBe(10000);
  });

  it('should deduct amount when betting', () => {
    const { result } = renderHook(() => useBalance());

    act(() => {
      result.current.deduct(100);
    });

    expect(result.current.balance).toBe(9900);
  });

  it('should add amount when winning', () => {
    const { result } = renderHook(() => useBalance());

    act(() => {
      result.current.add(200);
    });

    expect(result.current.balance).toBe(10200);
  });
});
```

## Best Practices

1. **Test one thing**: Each test should verify a single behavior
2. **Use descriptive names**: `should calculate payout correctly for banker win`
3. **Test edge cases**: Empty arrays, null values, boundary conditions
4. **Mock dependencies**: Use `vi.mock()` for external dependencies
5. **Avoid testing implementation details**: Focus on public API
6. **Keep tests simple**: Easy to read and understand
7. **Fast execution**: Unit tests should complete in milliseconds

## Coverage Requirements

- Overall: ≥ 80%
- Services: ≥ 95% (critical game logic)
- Utils: ≥ 95% (shared functionality)
- Hooks: ≥ 80%
- Components: ≥ 80%

## Running Unit Tests

```bash
# Run all unit tests
npm run test:run

# Watch mode for TDD
npm test

# With coverage
npm run test:coverage

# Specific file
npm test shuffle.test.ts
```
