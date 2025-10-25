# Services

Business logic and utility services.

## Purpose

Services contain pure business logic, game rules, and data management that is
independent of React components.

## Expected Services

- `baccaratRules.ts` - Game rules (补牌规则)
- `payoutCalculator.ts` - Payout calculations
- `cardShoe.ts` - Card shoe management
- `storageService.ts` - LocalStorage operations
- `gameEngine.ts` - Main game flow orchestration

## Guidelines

- Keep services pure and testable
- No React dependencies
- Export pure functions or classes
- Proper error handling
- Comprehensive unit tests (95%+ coverage for game logic)

## Example

```typescript
/**
 * Calculate payout based on bet type and amount
 */
export const calculatePayout = (
  betType: 'player' | 'banker' | 'tie',
  betAmount: number
): number => {
  const payoutRates = {
    player: 1.0,
    banker: 0.95,
    tie: 8.0,
  };

  return betAmount * payoutRates[betType];
};
```
