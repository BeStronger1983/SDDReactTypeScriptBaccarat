# Types

TypeScript type definitions and interfaces.

## Purpose

Centralized type definitions for the entire application.

## Expected Files

- `game.ts` - Game-related types (will be copied from contracts/types.ts in
  T011)
- `common.ts` - Common/shared types
- `events.ts` - Event handler types

## Guidelines

- Use interfaces for object shapes
- Use type aliases for unions and complex types
- Export all types as named exports
- Document complex types with JSDoc comments
- Avoid `any` type (enforced by ESLint)

## Example

```typescript
/**
 * Represents a playing card
 */
export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank:
    | 'A'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | 'J'
    | 'Q'
    | 'K';
  value: number;
}

/**
 * Bet type for Baccarat
 */
export type BetType = 'player' | 'banker' | 'tie';

/**
 * Game state
 */
export type GameState = 'betting' | 'dealing' | 'result' | 'idle';
```
