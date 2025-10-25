import type { GameResult } from '@/types/game';

/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  BALANCE: 'baccarat_balance',
  HISTORY: 'baccarat_history',
} as const;

/**
 * Save player balance to localStorage
 *
 * @param {number} balance - The balance to save
 *
 * @example
 * saveBalance(5000);
 */
export function saveBalance(balance: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BALANCE, String(balance));
  } catch (error) {
    // Handle quota exceeded or other errors
    console.error('Failed to save balance to localStorage:', error);
  }
}

/**
 * Load player balance from localStorage
 *
 * @returns {number | null} The saved balance, or null if not found or invalid
 *
 * @example
 * const balance = loadBalance();
 * if (balance !== null) {
 *   console.log('Loaded balance:', balance);
 * }
 */
export function loadBalance(): number | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
    if (saved === null || saved === '') {
      return null;
    }

    const balance = parseFloat(saved);
    if (isNaN(balance)) {
      return null;
    }

    return balance;
  } catch (error) {
    console.error('Failed to load balance from localStorage:', error);
    return null;
  }
}

/**
 * Save game history to localStorage
 *
 * @param {GameResult[]} history - The game history to save
 *
 * @example
 * saveHistory([
 *   {
 *     id: '1',
 *     timestamp: '2024-01-01T00:00:00.000Z',
 *     outcome: 'player',
 *     playerHand: { cards: [...], score: 5 },
 *     bankerHand: { cards: [...], score: 3 },
 *     bets: { player: 100, banker: 0, tie: 0 },
 *     payout: 100
 *   }
 * ]);
 */
export function saveHistory(history: GameResult[]): void {
  try {
    const json = JSON.stringify(history);
    localStorage.setItem(STORAGE_KEYS.HISTORY, json);
  } catch (error) {
    // Handle quota exceeded or other errors
    console.error('Failed to save history to localStorage:', error);
  }
}

/**
 * Load game history from localStorage
 *
 * @returns {GameResult[]} The saved game history, or empty array if not found or invalid
 *
 * @example
 * const history = loadHistory();
 * console.log('Game history:', history);
 */
export function loadHistory(): GameResult[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (saved === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as GameResult[];
  } catch (error) {
    // Handle JSON parse errors or other issues
    console.error('Failed to load history from localStorage:', error);
    return [];
  }
}

/**
 * Clear all game data from localStorage
 *
 * Removes both balance and history from storage.
 *
 * @example
 * clearGameData();
 * console.log('Game data cleared');
 */
export function clearGameData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.BALANCE);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Failed to clear game data from localStorage:', error);
  }
}
