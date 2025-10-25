/**
 * TypeScript Type Definitions for Baccarat Game
 *
 * This file contains all type definitions extracted from the data model.
 * These types serve as the contract between different parts of the application.
 */

// ============================================================================
// Card Types
// ============================================================================

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
}

// ============================================================================
// Game Entities
// ============================================================================

export interface Shoe {
  cards: Card[];
  dealtCount: number;
  totalCards: number;
  needsShuffle: boolean;
}

export interface Hand {
  cards: Card[];
  score: number;
  isNatural: boolean;
}

export interface Bet {
  player: number;
  banker: number;
  tie: number;
}

// ============================================================================
// Game State
// ============================================================================

export type GamePhase = 'betting' | 'dealing' | 'drawing' | 'calculating' | 'result';

export type GameOutcome = 'player' | 'banker' | 'tie';

export interface GameResult {
  id: string;
  timestamp: string;
  outcome: GameOutcome;
  playerHand: Hand;
  bankerHand: Hand;
  bets: Bet;
  payout: number;
}

export interface GameState {
  phase: GamePhase;
  shoe: Shoe;
  playerHand: Hand;
  bankerHand: Hand;
  currentBets: Bet;
  timer: number;
  balance: number;
  history: GameResult[];
  lastResult: GameResult | null;
}

// ============================================================================
// Player Account
// ============================================================================

export interface PlayerAccount {
  balance: number;
  lastUpdated: string;
  gamesPlayed: number;
  totalWagered: number;
  totalPayout: number;
}

// ============================================================================
// LocalStorage Data Structures
// ============================================================================

export interface StoredBalance {
  amount: number;
  lastUpdated: string;
}

export interface StoredHistory {
  games: GameResult[];
  maxEntries: 10;
}

export interface StoredGameState {
  phase: GamePhase;
  shoe: Shoe;
  playerHand: Hand;
  bankerHand: Hand;
  currentBets: Bet;
  savedAt: string;
}

// ============================================================================
// Game Actions (for useReducer)
// ============================================================================

export type GameAction =
  | { type: 'PLACE_BET'; area: keyof Bet; amount: number }
  | { type: 'CLEAR_BETS' }
  | { type: 'START_DEALING' }
  | { type: 'DEAL_CARD'; hand: 'player' | 'banker'; card: Card }
  | { type: 'DRAW_THIRD_CARD'; hand: 'player' | 'banker'; card: Card }
  | { type: 'CALCULATE_RESULT' }
  | { type: 'SHOW_RESULT'; result: GameResult }
  | { type: 'START_NEW_ROUND' }
  | { type: 'UPDATE_TIMER'; seconds: number }
  | { type: 'RESET_BALANCE' }
  | { type: 'LOAD_STATE'; state: Partial<GameState> };

// ============================================================================
// Component Props
// ============================================================================

export interface CardProps {
  card: Card;
  faceUp?: boolean;
  animationDelay?: number;
}

export interface ChipProps {
  value: number;
  selected?: boolean;
  onClick?: () => void;
}

export interface BettingAreaProps {
  type: keyof Bet;
  amount: number;
  onBet: (amount: number) => void;
  disabled?: boolean;
}

export interface GameHistoryProps {
  history: GameResult[];
  onSelectGame?: (game: GameResult) => void;
}

export interface TimerProps {
  seconds: number;
  onTimeout: () => void;
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UseGameStateReturn {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  placeBet: (area: keyof Bet, amount: number) => void;
  clearBets: () => void;
  startGame: () => void;
  resetBalance: () => void;
}

export interface UseBalanceReturn {
  balance: number;
  deduct: (amount: number) => boolean;
  add: (amount: number) => void;
  reset: () => void;
}

export interface UseBettingReturn {
  bets: Bet;
  totalBet: number;
  placeBet: (area: keyof Bet, amount: number) => boolean;
  clearBets: () => void;
  canBet: (area: keyof Bet, amount: number) => boolean;
}

// ============================================================================
// Service Return Types
// ============================================================================

export interface DrawDecision {
  playerShouldDraw: boolean;
  bankerShouldDraw: boolean;
  reason?: string;
}

export interface PayoutResult {
  playerPayout: number;
  bankerPayout: number;
  tiePayout: number;
  totalPayout: number;
}

// ============================================================================
// Constants
// ============================================================================

export const CHIP_VALUES = [10, 50, 100, 500, 1000] as const;
export type ChipValue = (typeof CHIP_VALUES)[number];

export const PAYOUT_RATES = {
  player: 1.0,
  banker: 0.95,
  tie: 8.0,
} as const;

export const INITIAL_BALANCE = 10000;
export const MAX_HISTORY_ENTRIES = 10;
export const TOTAL_DECKS = 8;
export const CARDS_PER_DECK = 52;
export const TOTAL_CARDS = TOTAL_DECKS * CARDS_PER_DECK;
export const SHUFFLE_THRESHOLD = 52;
export const BET_TIMER_SECONDS = 15;

// ============================================================================
// Type Guards
// ============================================================================

export function isValidCard(obj: unknown): obj is Card {
  if (typeof obj !== 'object' || obj === null) return false;
  const card = obj as Card;

  const validSuits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const validRanks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  return validSuits.includes(card.suit) && validRanks.includes(card.rank);
}

export function isValidBet(obj: unknown): obj is Bet {
  if (typeof obj !== 'object' || obj === null) return false;
  const bet = obj as Bet;

  return (
    typeof bet.player === 'number' &&
    bet.player >= 0 &&
    typeof bet.banker === 'number' &&
    bet.banker >= 0 &&
    typeof bet.tie === 'number' &&
    bet.tie >= 0
  );
}

export function isValidGameOutcome(value: unknown): value is GameOutcome {
  return value === 'player' || value === 'banker' || value === 'tie';
}

export function isValidGamePhase(value: unknown): value is GamePhase {
  return (
    value === 'betting' ||
    value === 'dealing' ||
    value === 'drawing' ||
    value === 'calculating' ||
    value === 'result'
  );
}

export function isValidGameResult(obj: unknown): obj is GameResult {
  if (typeof obj !== 'object' || obj === null) return false;
  const result = obj as GameResult;

  return (
    typeof result.id === 'string' &&
    typeof result.timestamp === 'string' &&
    isValidGameOutcome(result.outcome) &&
    typeof result.payout === 'number' &&
    isValidBet(result.bets)
  );
}
