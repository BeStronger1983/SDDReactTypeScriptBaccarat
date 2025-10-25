# Integration Tests

Integration tests verify that multiple modules work together correctly.

## Purpose

Test the interaction between different parts of the application to ensure they
integrate properly. These tests verify data flow, state management, and
component composition.

## What to Test

### Component Integration

- Parent-child component communication
- Context providers and consumers
- Complex component compositions
- State management across components

### Service Integration

- Game engine + rules + calculator
- Storage service + hooks
- Multiple services working together

### Data Flow

- User action → State update → UI update
- API call → Data processing → Display
- Form submission → Validation → Storage

## File Organization

```
tests/integration/
├── gameFlow.test.tsx          # Complete game round flow
├── bettingFlow.test.tsx       # Betting process integration
├── balanceManagement.test.tsx # Balance updates across game
├── stateManagement.test.tsx   # State transitions
└── storageIntegration.test.tsx # localStorage + components
```

## Example: Game Flow Integration

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameTable } from '@components/game/GameTable';

describe('Complete Game Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should complete a full game round', async () => {
    const { user } = render(<GameTable />);

    // 1. Select chip
    const chip100 = screen.getByRole('button', { name: /100/i });
    await user.click(chip100);

    // 2. Place bet on player
    const playerArea = screen.getByTestId('betting-area-player');
    await user.click(playerArea);

    // 3. Start game
    const dealButton = screen.getByRole('button', { name: /deal/i });
    await user.click(dealButton);

    // 4. Wait for game to complete
    await screen.findByText(/result/i, {}, { timeout: 5000 });

    // 5. Verify balance updated
    const balanceDisplay = screen.getByTestId('balance-display');
    expect(balanceDisplay).toBeInTheDocument();
  });
});
```

## Example: Betting Flow

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BettingArea } from '@components/game/BettingArea';
import { ChipSelector } from '@components/game/ChipSelector';

describe('Betting Flow Integration', () => {
  it('should place multiple bets across different areas', async () => {
    const { user } = render(
      <>
        <ChipSelector />
        <BettingArea />
      </>
    );

    // Select chip
    await user.click(screen.getByRole('button', { name: /50/i }));

    // Place bet on player
    await user.click(screen.getByTestId('bet-player'));
    expect(screen.getByTestId('bet-player-amount')).toHaveTextContent('50');

    // Select different chip
    await user.click(screen.getByRole('button', { name: /100/i }));

    // Place bet on banker
    await user.click(screen.getByTestId('bet-banker'));
    expect(screen.getByTestId('bet-banker-amount')).toHaveTextContent('100');

    // Total bet should be 150
    expect(screen.getByTestId('total-bet')).toHaveTextContent('150');
  });
});
```

## Example: State Management

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from '@hooks/useGameState';
import { useBetting } from '@hooks/useBetting';
import { useBalance } from '@hooks/useBalance';

describe('State Management Integration', () => {
  it('should coordinate game state, betting, and balance', () => {
    const gameState = renderHook(() => useGameState());
    const betting = renderHook(() => useBetting());
    const balance = renderHook(() => useBalance());

    // Initial state
    expect(gameState.result.current.phase).toBe('betting');
    expect(balance.result.current.balance).toBe(10000);

    // Place bet
    act(() => {
      betting.result.current.placeBet('player', 100);
      balance.result.current.deduct(100);
    });

    expect(balance.result.current.balance).toBe(9900);
    expect(betting.result.current.totalBet).toBe(100);

    // Start game
    act(() => {
      gameState.result.current.startGame();
    });

    expect(gameState.result.current.phase).toBe('dealing');
  });
});
```

## Example: Storage Integration

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameTable } from '@components/game/GameTable';

describe('Storage Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should persist and restore balance', async () => {
    // First render - use default balance
    const { unmount } = render(<GameTable />);
    expect(screen.getByTestId('balance')).toHaveTextContent('10000');

    // Modify balance
    const { user } = render(<GameTable />);
    // ... perform actions that change balance ...

    unmount();

    // Second render - should restore from localStorage
    render(<GameTable />);
    const restoredBalance = screen.getByTestId('balance');
    expect(restoredBalance).not.toHaveTextContent('10000');
  });

  it('should persist game history', async () => {
    const { user } = render(<GameTable />);

    // Play a game
    // ... game actions ...

    // Verify history was saved
    const history = JSON.parse(localStorage.getItem('gameHistory') ?? '[]');
    expect(history.length).toBe(1);
  });
});
```

## Testing Strategy

### When to Write Integration Tests

- Complex component interactions
- Data flow across multiple layers
- State synchronization
- Critical user paths
- Context provider behavior

### When NOT to Write Integration Tests

- Simple components (use unit tests)
- Pure functions (use unit tests)
- Full user journeys (use E2E tests)

## Best Practices

1. **Test realistic scenarios**: Mimic actual user behavior
2. **Test data flow**: Verify data moves correctly through the system
3. **Setup shared context**: Use test providers/wrappers
4. **Keep tests independent**: Each test should stand alone
5. **Mock external services**: Focus on internal integration
6. **Test edge cases**: Multi-step failures, race conditions
7. **Readable assertions**: Clear expected outcomes

## Coverage Goals

Integration tests should cover:

- 20% of total test suite
- Critical user paths
- Complex component compositions
- State management flows
- Data persistence

## Running Integration Tests

```bash
# Run all tests (includes integration)
npm run test:run

# Watch mode
npm test

# With coverage
npm run test:coverage

# Specific file
npm test gameFlow.test.tsx
```

## Common Patterns

### Testing with Context

```typescript
const wrapper = ({ children }) => (
  <GameContext.Provider value={mockGameState}>
    {children}
  </GameContext.Provider>
);

renderHook(() => useGameContext(), { wrapper });
```

### Testing Async Operations

```typescript
await waitFor(() => {
  expect(screen.getByText('Loading...')).not.toBeInTheDocument();
});
```

### Testing Event Sequences

```typescript
await user.click(button1);
await user.click(button2);
await user.click(button3);
expect(finalState).toBe(expectedState);
```
