# Source Directory Structure

This directory contains all the source code for the Baccarat game application.

## Directory Organization

```
src/
├── components/         # React components
│   ├── ui/            # Reusable UI components (Button, Card, Chip)
│   ├── game/          # Game-specific components (BettingArea, CardHand, GameTable)
│   └── layout/        # Layout components (Header, BalanceDisplay)
├── hooks/             # Custom React hooks
├── services/          # Business logic and game rules
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and helpers
├── constants/         # Application constants and configuration
├── styles/            # Global styles and CSS modules
└── assets/            # Static assets (images, icons)
```

## Architecture Principles

1. **Separation of Concerns**: UI components are separate from business logic
2. **Type Safety**: Strict TypeScript with no `any` types
3. **Testability**: Pure functions in services and utils for easy testing
4. **Reusability**: Shared hooks and UI components
5. **Single Responsibility**: Each module has a clear, focused purpose

## Import Aliases

The following import aliases are configured (see `vitest.config.ts`):

- `@/` → `src/`
- `@components/` → `src/components/`
- `@hooks/` → `src/hooks/`
- `@services/` → `src/services/`
- `@types/` → `src/types/`
- `@utils/` → `src/utils/`
- `@constants/` → `src/constants/`
- `@styles/` → `src/styles/`

## Usage Example

```typescript
// Instead of relative paths
import { Button } from '../../../components/ui/Button';
import { useBalance } from '../../../hooks/useBalance';

// Use aliases
import { Button } from '@components/ui/Button';
import { useBalance } from '@hooks/useBalance';
```

## Development Guidelines

- Follow the README guidelines in each subdirectory
- Write tests for all new code (target: 80% overall, 95% for game logic)
- Use TypeScript strict mode (no `any` types)
- Run `npm run lint` and `npm run format` before committing
- Document complex logic with JSDoc comments
