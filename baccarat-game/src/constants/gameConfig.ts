/**
 * Game Configuration Constants
 *
 * This file contains all game-related configuration values including
 * chip denominations, shoe settings, timers, and betting limits.
 */

// ============================================================================
// Chip Configuration
// ============================================================================

/**
 * Available chip denominations for betting
 * Players can select these values when placing bets
 */
export const CHIP_DENOMINATIONS = [10, 50, 100, 500, 1000] as const;

/**
 * Type for valid chip values
 */
export type ChipDenomination = (typeof CHIP_DENOMINATIONS)[number];

// ============================================================================
// Card Shoe Configuration
// ============================================================================

/**
 * Number of standard 52-card decks in the shoe
 * Standard Baccarat uses 6 or 8 decks
 */
export const DECK_COUNT = 8;

/**
 * Number of cards in a standard deck
 */
export const CARDS_PER_DECK = 52;

/**
 * Total number of cards in the shoe
 */
export const TOTAL_CARDS = DECK_COUNT * CARDS_PER_DECK;

/**
 * Number of cards remaining that triggers a shuffle
 * When cards remaining <= SHUFFLE_THRESHOLD, shuffle is needed
 */
export const SHUFFLE_THRESHOLD = 52;

// ============================================================================
// Timer Configuration
// ============================================================================

/**
 * Betting phase duration in seconds
 * Players have this much time to place their bets
 */
export const BETTING_TIMER_SECONDS = 15;

/**
 * Delay between card deals in milliseconds
 * Creates a realistic dealing animation pace
 */
export const CARD_DEAL_DELAY_MS = 500;

/**
 * Duration to display game results in milliseconds
 */
export const RESULT_DISPLAY_DURATION_MS = 3000;

// ============================================================================
// Balance and Betting Limits
// ============================================================================

/**
 * Initial player balance when starting the game
 */
export const INITIAL_BALANCE = 10000;

/**
 * Minimum bet amount allowed
 */
export const MIN_BET = 10;

/**
 * Maximum bet amount allowed per betting area
 */
export const MAX_BET = 10000;

/**
 * Maximum total bet across all areas
 */
export const MAX_TOTAL_BET = 20000;

// ============================================================================
// Game History
// ============================================================================

/**
 * Maximum number of game results to store in history
 * Older results are removed to prevent excessive memory usage
 */
export const MAX_HISTORY_ENTRIES = 10;

// ============================================================================
// Game Configuration Object
// ============================================================================

/**
 * Centralized game configuration
 * All game settings in one place for easy modification
 */
export const GameConfig = {
  // Chip settings
  chipDenominations: CHIP_DENOMINATIONS,

  // Shoe settings
  deckCount: DECK_COUNT,
  cardsPerDeck: CARDS_PER_DECK,
  totalCards: TOTAL_CARDS,
  shuffleThreshold: SHUFFLE_THRESHOLD,

  // Timer settings
  bettingTimerSeconds: BETTING_TIMER_SECONDS,
  cardDealDelayMs: CARD_DEAL_DELAY_MS,
  resultDisplayDurationMs: RESULT_DISPLAY_DURATION_MS,

  // Balance and betting
  initialBalance: INITIAL_BALANCE,
  minBet: MIN_BET,
  maxBet: MAX_BET,
  maxTotalBet: MAX_TOTAL_BET,

  // History
  maxHistoryEntries: MAX_HISTORY_ENTRIES,
} as const;

/**
 * Type for the game configuration object
 */
export type GameConfigType = typeof GameConfig;
