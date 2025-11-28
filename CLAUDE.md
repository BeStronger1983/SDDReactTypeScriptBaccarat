# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Code Preferences

**IMPORTANT:** Always respond in Traditional Chinese (Taiwan) / 繁體中文(台灣) / zh-TW.

## Project Overview

This is a monorepo containing a Baccarat (百家樂) casino game implementation. The main application is in the `baccarat-game/` directory and is built as a client-side React + TypeScript + Vite application with no backend or network connectivity.

**Key Characteristics:**
- Single-player 2D baccarat game
- NPC dealer (automated dealing and settlement)
- Client-side game logic (no server required)
- 8-deck shoe (416 cards total)
- All game state managed in-browser with localStorage persistence

## Working Directory

**IMPORTANT:** The working directory is `/Users/ponpon/Documents/SDDReactLiveCasino/baccarat-game`

All npm commands must be run from the `baccarat-game/` directory. The root directory contains project specs and documentation, but the actual codebase is in `baccarat-game/`.

## Commands Reference

### Development
```bash
cd baccarat-game
npm run dev              # Start dev server at http://localhost:5173
npm run build            # TypeScript compile + Vite production build
npm run preview          # Preview production build at http://localhost:4173
```

### Code Quality
```bash
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format all files with Prettier
npm run format:check     # Check formatting without modifying
npm run type-check       # TypeScript type validation (no emit)
npm run validate         # Run lint + type-check + test:run
```

### Testing

**Unit/Integration Tests (Vitest):**
```bash
npm test                 # Watch mode (default for development)
npm run test:run         # Run once (for CI/CD)
npm run test:ui          # Vitest UI at http://localhost:51204/__vitest__/
npm run test:coverage    # Generate coverage report (≥80% required)
npm run test:watch       # Explicit watch mode

# Run specific test file
npm test -- src/services/baccaratRules.test.ts

# Run tests matching pattern
npm test -- --grep "should calculate"
```

**E2E Tests (Playwright):**
```bash
npm run test:e2e         # Headless mode (Chrome, Firefox, Safari)
npm run test:e2e:ui      # Playwright UI
npm run test:e2e:headed  # Visible browser
npm run test:e2e:debug   # Debug mode with Playwright Inspector
npm run test:e2e:report  # View HTML report

# Debug specific E2E test
npm run test:e2e:debug -- tests/e2e/betting.spec.ts
```

### Git Hooks
```bash
npm run prepare          # Setup Husky hooks (runs on npm install)
```

Pre-commit hook runs:
1. lint-staged (ESLint + Prettier on staged files)
2. type-check

## Architecture

### Directory Structure

```
baccarat-game/
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI components (Card, Chip, Button)
│   │   ├── layout/      # Layout components (Header, BalanceDisplay)
│   │   └── game/        # Game-specific components (CardHand, GameTable)
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Core game logic (pure functions)
│   │   ├── baccaratRules.ts     # Third card drawing rules
│   │   ├── cardShoe.ts          # Deck management & shuffling
│   │   ├── gameEngine.ts        # Game round execution
│   │   ├── payoutCalculator.ts  # Payout calculation
│   │   └── storageService.ts    # localStorage wrapper
│   ├── utils/           # Utility functions (cardUtils, validators, shuffle)
│   ├── types/           # TypeScript type definitions
│   ├── constants/       # Game configuration constants
│   └── styles/          # CSS/styling
└── tests/
    ├── unit/            # 70% - Fast, isolated tests
    ├── integration/     # 20% - Module interaction tests
    └── e2e/             # 10% - Full user journey tests
```

### Core Architecture Patterns

**1. Pure Service Layer**

All game logic is implemented as pure functions in `src/services/`:
- `baccaratRules.ts`: Implements official baccarat third-card drawing rules
  - `shouldPlayerDraw(playerScore)`: Determines if player draws (0-5 → draw, 6-7 → stand, 8-9 → natural)
  - `shouldBankerDraw(bankerScore, playerThirdCardValue)`: Complex banker drawing logic based on player's third card
- `gameEngine.ts`: Orchestrates complete game rounds
  - `executeGameRound(shoe, bets)`: Executes full game flow (deal 4 cards, check naturals, draw third cards, determine outcome, calculate payout)
  - `determineOutcome(playerHand, bankerHand)`: Determines winner (player/banker/tie)
- `cardShoe.ts`: Manages 8-deck shoe (416 cards)
  - Creates, shuffles, and deals cards
  - Tracks dealt cards and reshuffling
- `payoutCalculator.ts`: Calculates payouts based on bets and outcome
  - Player: 1:1
  - Banker: 1:0.95 (5% commission)
  - Tie: 1:8

**2. React State Management**

- Uses React hooks for state management (no Redux/external state library)
- Custom hooks in `src/hooks/`:
  - `useGameState`: Main game state reducer
  - `useBetting`: Bet management
  - `useBalance`: Balance tracking with localStorage persistence
  - `useLocalStorage`: Generic localStorage hook

**3. Type System**

Comprehensive TypeScript types in `src/types/game.ts`:
- Domain types: `Card`, `Suit`, `Rank`, `Hand`, `Bet`, `Shoe`
- Game state: `GamePhase`, `GameOutcome`, `GameState`, `GameResult`
- Actions: `GameAction` (for useReducer)
- Type guards: `isValidCard()`, `isValidBet()`, etc.

**4. Path Aliases**

Configured in `tsconfig.app.json` and `vitest.config.ts`:
```typescript
import { Card } from '@/types/game';
import { shouldPlayerDraw } from '@services/baccaratRules';
import { calculateScore } from '@utils/cardUtils';
import Button from '@components/ui/Button';
```

### Game Logic Flow

1. **Betting Phase**: Player places bets on player/banker/tie
2. **Dealing Phase**: NPC deals 4 initial cards (player-banker-player-banker)
3. **Drawing Phase**: Apply third-card rules based on initial scores
4. **Calculating Phase**: Determine outcome and calculate payout
5. **Result Phase**: Display results and update balance/history

### Test Requirements

**Coverage Thresholds:**
- Overall: ≥80% (statements, branches, functions, lines)
- Services: ≥95% (critical business logic)
- Utils: ≥95%

**TDD Workflow (Required):**
1. Write failing test first
2. Run test to verify it fails correctly
3. Write minimal code to pass test
4. Refactor while keeping tests green
5. Repeat

**Test Organization:**
- `tests/unit/`: Individual function/component tests (70% of tests)
- `tests/integration/`: Module interaction tests (20% of tests)
- `tests/e2e/`: Full user journey tests (10% of tests)

## Code Standards

### ESLint Rules (Enforced)

Key rules from `eslint.config.js`:
- `@typescript-eslint/no-explicit-any`: error
- `@typescript-eslint/explicit-function-return-type`: warn (allow expressions)
- `@typescript-eslint/consistent-type-definitions`: Use `interface` over `type`
- `no-console`: warn (except console.warn/error)
- `complexity`: max 10 cyclomatic complexity
- `max-lines-per-function`: max 100 lines (excluding blanks/comments)

### TypeScript Configuration

Strict mode enabled with:
- `noUnusedLocals`, `noUnusedParameters`: Prevent unused variables
- `noImplicitReturns`: All code paths must return
- `noUncheckedIndexedAccess`: Index access returns `T | undefined`
- Type-aware linting with `recommendedTypeChecked` and `stylisticTypeChecked`

### Code Review Requirements

From `.github/prompts/CodeReview.prompt.md`:

**Critical Review Areas:**
1. **Correctness**: Logical errors, edge cases, null checks, runtime safety
2. **Code Quality**: No dead code, console logs, or unnecessary complexity
3. **React Best Practices**: Proper hooks usage, avoid inline functions, correct keys, no direct state mutation
4. **Performance**: Asset size, lazy loading, memoization when needed
5. **Testing**: Tests added/updated for logic changes
6. **Tooling**: Validate package.json changes, check dependency categorization

**File Modification Rule:**
- Never create/update/delete files without explicit user confirmation
- Always ask: "Do you want me to save this to a file?"

## Game Specification

Reference: `Baccarat_Spec_zh-TW.md`

**Key Rules:**
- 8 decks (416 cards)
- Card values: A=1, 2-9=face value, 10/J/Q/K=0
- Scores: Sum mod 10 (only ones digit counts)
- Natural: 8 or 9 on first two cards (no third card)
- Player draws on 0-5, stands on 6-7
- Banker drawing depends on banker score AND player's third card value

**Payouts:**
- Player win: 1:1
- Banker win: 1:0.95 (5% commission)
- Tie: 1:8

## Slash Commands

From `AGENTS.md`: Use slash commands from `.github/prompts/`

Key commands:
- `/code-review`: Linus Torvalds-style strict code review (see `.gemini/commands/code-review.toml`)
- Speckit commands: `/specify`, `/implement`, `/tasks`, `/checklist`, `/clarify`, `/plan`, `/analyze`

## Development Workflow

### Before Committing
```bash
npm run format       # Format code
npm run lint:fix     # Fix linting
npm run validate     # Run all checks (lint + type-check + tests)
git add .
git commit -m "feat: description"
```

### Pre-deployment
```bash
npm run validate     # All quality checks
npm run build        # Production build
npm run preview      # Test production build
```

### CI/CD Pipeline
```bash
npm ci               # Clean install
npm run lint         # Lint check
npm run type-check   # Type check
npm run test:run     # Unit/integration tests
npm run test:e2e     # E2E tests
npm run build        # Production build
```

## Important Notes

1. **No Backend**: All game logic runs client-side. No API calls or WebSocket connections.

2. **localStorage**: Balance and game history persist in browser localStorage via `storageService.ts`.

3. **Randomness**: Uses client-side PRNG (Math.random() with Fisher-Yates shuffle). Not cryptographically secure, suitable for single-player entertainment only.

4. **No Hot Module Replacement for Tests**: Tests do not auto-reload on file changes in watch mode due to Vitest configuration.

5. **Git Hooks**: Pre-commit runs linting, formatting, and type-check. Does NOT run unit tests for speed (run manually).

6. **Path Resolution**: Use path aliases (`@/`, `@components/`, etc.) consistently. Avoid relative imports like `../../`.

7. **Coverage Reports**: Generated in `coverage/` directory. Open `coverage/index.html` to view detailed coverage.

8. **Playwright Browsers**: Run `npx playwright install` if E2E tests fail due to missing browsers.
