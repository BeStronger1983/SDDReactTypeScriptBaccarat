# Hooks

Custom React hooks for shared logic.

## Purpose

Custom hooks encapsulate reusable stateful logic that can be shared across
components.

## Naming Convention

All hooks must start with `use` prefix (e.g., `useBalance`, `useBetting`,
`useGameState`).

## Expected Hooks

- `useLocalStorage` - Local storage state management
- `useBalance` - Player balance management
- `useBetting` - Betting logic and state
- `useGameState` - Game state machine

## Guidelines

- Keep hooks focused on a single responsibility
- Return consistent data structures
- Document hook parameters and return values
- Include proper TypeScript types

## Example

```tsx
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
```
