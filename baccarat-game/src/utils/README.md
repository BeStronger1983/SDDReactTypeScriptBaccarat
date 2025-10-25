# Utils

Utility functions and helpers.

## Purpose

Pure utility functions that provide common functionality across the application.

## Expected Files

- `shuffle.ts` - Fisher-Yates shuffle algorithm
- `cardUtils.ts` - Card value calculation and utilities
- `validators.ts` - Input validation functions
- `formatters.ts` - Data formatting utilities (numbers, currency, etc.)

## Guidelines

- All functions should be pure (no side effects)
- Fully unit tested
- Well-documented with JSDoc
- Type-safe with TypeScript
- Single responsibility principle

## Example

```typescript
/**
 * Fisher-Yates shuffle algorithm for array randomization
 * @param array - Array to shuffle
 * @returns Shuffled array (new instance)
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Calculate card value for Baccarat (10, J, Q, K = 0; A = 1; others = face value)
 */
export const getCardValue = (rank: string): number => {
  if (['10', 'J', 'Q', 'K'].includes(rank)) return 0;
  if (rank === 'A') return 1;
  return parseInt(rank, 10);
};
```
