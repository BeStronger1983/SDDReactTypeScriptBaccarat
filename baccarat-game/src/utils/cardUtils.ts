import type { Card } from '@/types/game';

/**
 * Get the Baccarat point value for a single card
 *
 * Baccarat card values:
 * - Ace (A) = 1 point
 * - 2-9 = face value (2-9 points)
 * - 10, J, Q, K = 0 points
 *
 * @param {Card} card - The card to evaluate
 * @returns {number} The point value (0-9)
 *
 * @example
 * getCardValue({ suit: 'hearts', rank: 'A' }) // returns 1
 * getCardValue({ suit: 'diamonds', rank: '7' }) // returns 7
 * getCardValue({ suit: 'clubs', rank: 'K' }) // returns 0
 */
export function getCardValue(card: Card): number {
  const { rank } = card;

  // Ace = 1 point
  if (rank === 'A') {
    return 1;
  }

  // Face cards and 10 = 0 points
  if (rank === 'J' || rank === 'Q' || rank === 'K' || rank === '10') {
    return 0;
  }

  // Number cards 2-9 = face value
  return parseInt(rank, 10);
}

/**
 * Calculate the Baccarat score for a hand of cards
 *
 * In Baccarat, the score is the sum of all card values modulo 10
 * (only the ones digit is used)
 *
 * @param {readonly Card[]} cards - The cards in the hand
 * @returns {number} The total score (0-9)
 *
 * @example
 * calculateScore([
 *   { suit: 'hearts', rank: '7' },
 *   { suit: 'diamonds', rank: '8' }
 * ]) // returns 5 (7 + 8 = 15 → 5)
 *
 * @example
 * calculateScore([
 *   { suit: 'hearts', rank: 'K' },
 *   { suit: 'diamonds', rank: 'Q' }
 * ]) // returns 0 (0 + 0 = 0)
 *
 * @example
 * calculateScore([
 *   { suit: 'hearts', rank: 'A' },
 *   { suit: 'diamonds', rank: '8' }
 * ]) // returns 9 (1 + 8 = 9) - Natural 9
 */
export function calculateScore(cards: readonly Card[]): number {
  // Sum all card values
  const total = cards.reduce((sum, card) => sum + getCardValue(card), 0);

  // Return only the ones digit (modulo 10)
  return total % 10;
}
