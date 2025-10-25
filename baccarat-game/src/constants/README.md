# Constants

Application constants and configuration values.

## Purpose

Centralized location for all magic numbers, configuration values, and constants
used throughout the application.

## Expected Files

- `gameConfig.ts` - Game configuration (chip denominations, deck count, timers)
- `payoutRates.ts` - Payout rates for different bet types
- `animations.ts` - Animation variants and configurations (for Framer Motion)

## Guidelines

- Use UPPER_SNAKE_CASE for primitive constants
- Use PascalCase for object constants
- Export as named exports
- Document the purpose of each constant
- Group related constants together

## Example

```typescript
/**
 * Chip denominations available for betting
 */
export const CHIP_DENOMINATIONS = [10, 50, 100, 500, 1000] as const;

/**
 * Number of card decks in the shoe
 */
export const DECK_COUNT = 8;

/**
 * Betting phase timer in seconds
 */
export const BETTING_TIMER_SECONDS = 15;

/**
 * Game configuration
 */
export const GameConfig = {
  initialBalance: 10000,
  minBet: 10,
  maxBet: 10000,
  cardDealDelay: 500, // milliseconds
} as const;

/**
 * Payout rates for each bet type
 */
export const PayoutRates = {
  player: 1.0,
  banker: 0.95,
  tie: 8.0,
} as const;
```
