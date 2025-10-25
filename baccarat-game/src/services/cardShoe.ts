import type { Card, Shoe, Suit, Rank } from '@/types/game';
import { TOTAL_DECKS, TOTAL_CARDS, SHUFFLE_THRESHOLD } from '@/types/game';
import { shuffle } from '@/utils/shuffle';

/**
 * Create a new shuffled 8-deck shoe for Baccarat
 *
 * Creates a shoe containing 8 standard decks (416 cards total),
 * shuffled using the Fisher-Yates algorithm.
 *
 * @returns {Shoe} A new shuffled shoe with 0 dealt cards
 *
 * @example
 * const shoe = createShoe();
 * console.log(shoe.cards.length); // 416
 * console.log(shoe.dealtCount); // 0
 */
export function createShoe(): Shoe {
  const cards: Card[] = [];
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Create 8 decks
  for (let deck = 0; deck < TOTAL_DECKS; deck++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push({ suit, rank });
      }
    }
  }

  // Shuffle the cards
  const shuffledCards = shuffle(cards);

  return {
    cards: shuffledCards,
    dealtCount: 0,
    totalCards: TOTAL_CARDS,
    needsShuffle: false,
  };
}

/**
 * Deal a card from the shoe
 *
 * Returns the next card from the shoe and a new shoe object
 * with incremented dealt count. The original shoe is not mutated.
 *
 * @param {Shoe} shoe - The current shoe
 * @returns {{ card: Card, shoe: Shoe }} The dealt card and updated shoe
 *
 * @example
 * let shoe = createShoe();
 * const result = dealCard(shoe);
 * console.log(result.card); // { suit: 'hearts', rank: 'A' }
 * console.log(result.shoe.dealtCount); // 1
 */
export function dealCard(shoe: Shoe): { card: Card; shoe: Shoe } {
  const card = shoe.cards[shoe.dealtCount];
  const newDealtCount = shoe.dealtCount + 1;
  const remaining = TOTAL_CARDS - newDealtCount;

  const newShoe: Shoe = {
    cards: shoe.cards,
    dealtCount: newDealtCount,
    totalCards: TOTAL_CARDS,
    needsShuffle: remaining <= SHUFFLE_THRESHOLD,
  };

  return {
    card: card!,
    shoe: newShoe,
  };
}

/**
 * Check if the shoe needs to be shuffled
 *
 * Returns true when the remaining cards are at or below
 * the shuffle threshold (52 cards).
 *
 * @param {Shoe} shoe - The shoe to check
 * @returns {boolean} True if shuffle is needed, false otherwise
 *
 * @example
 * const shoe = createShoe();
 * console.log(needsShuffle(shoe)); // false
 *
 * // After dealing many cards...
 * console.log(needsShuffle(shoe)); // true when <= 52 cards remain
 */
export function needsShuffle(shoe: Shoe): boolean {
  const remaining = getRemainingCards(shoe);
  return remaining <= SHUFFLE_THRESHOLD;
}

/**
 * Get the number of remaining cards in the shoe
 *
 * @param {Shoe} shoe - The shoe to check
 * @returns {number} Number of cards remaining
 *
 * @example
 * const shoe = createShoe();
 * console.log(getRemainingCards(shoe)); // 416
 *
 * const result = dealCard(shoe);
 * console.log(getRemainingCards(result.shoe)); // 415
 */
export function getRemainingCards(shoe: Shoe): number {
  return TOTAL_CARDS - shoe.dealtCount;
}
