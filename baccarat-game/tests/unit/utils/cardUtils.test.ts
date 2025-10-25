import { describe, it, expect } from 'vitest';
import { getCardValue, calculateScore } from '@utils/cardUtils';
import type { Card, Rank } from '@/types/game';

describe('cardUtils', () => {
  describe('getCardValue', () => {
    describe('Basic Card Values', () => {
      it('should return 1 for Ace', () => {
        const card: Card = { suit: 'hearts', rank: 'A' };
        expect(getCardValue(card)).toBe(1);
      });

      it('should return correct values for numbered cards 2-9', () => {
        const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9'];

        ranks.forEach((rank, index) => {
          const card: Card = { suit: 'hearts', rank };
          expect(getCardValue(card)).toBe(index + 2);
        });
      });

      it('should return 0 for 10', () => {
        const card: Card = { suit: 'diamonds', rank: '10' };
        expect(getCardValue(card)).toBe(0);
      });

      it('should return 0 for Jack', () => {
        const card: Card = { suit: 'clubs', rank: 'J' };
        expect(getCardValue(card)).toBe(0);
      });

      it('should return 0 for Queen', () => {
        const card: Card = { suit: 'spades', rank: 'Q' };
        expect(getCardValue(card)).toBe(0);
      });

      it('should return 0 for King', () => {
        const card: Card = { suit: 'hearts', rank: 'K' };
        expect(getCardValue(card)).toBe(0);
      });
    });

    describe('Suit Independence', () => {
      it('should return same value for same rank regardless of suit', () => {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
        const rank: Rank = '5';

        suits.forEach((suit) => {
          const card: Card = { suit, rank };
          expect(getCardValue(card)).toBe(5);
        });
      });

      it('should return 0 for all face cards regardless of suit', () => {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
        const faceCards: Rank[] = ['10', 'J', 'Q', 'K'];

        suits.forEach((suit) => {
          faceCards.forEach((rank) => {
            const card: Card = { suit, rank };
            expect(getCardValue(card)).toBe(0);
          });
        });
      });
    });

    describe('All Valid Cards', () => {
      it('should handle all 52 card combinations correctly', () => {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
        const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const expectedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0];

        suits.forEach((suit) => {
          ranks.forEach((rank, index) => {
            const card: Card = { suit, rank };
            expect(getCardValue(card)).toBe(expectedValues[index]);
          });
        });
      });
    });
  });

  describe('calculateScore', () => {
    describe('Basic Score Calculation', () => {
      it('should return 0 for empty hand', () => {
        expect(calculateScore([])).toBe(0);
      });

      it('should return correct score for single card', () => {
        const card: Card = { suit: 'hearts', rank: '5' };
        expect(calculateScore([card])).toBe(5);
      });

      it('should sum two cards correctly when total < 10', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '3' },
          { suit: 'diamonds', rank: '4' },
        ];
        expect(calculateScore(cards)).toBe(7);
      });

      it('should sum three cards correctly when total < 10', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'A' },
          { suit: 'diamonds', rank: '2' },
          { suit: 'clubs', rank: '3' },
        ];
        expect(calculateScore(cards)).toBe(6);
      });
    });

    describe('Modulo 10 Rule (取個位數)', () => {
      it('should return ones digit when sum equals 10', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '6' },
          { suit: 'diamonds', rank: '4' },
        ];
        expect(calculateScore(cards)).toBe(0);
      });

      it('should return ones digit when sum equals 11', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '6' },
          { suit: 'diamonds', rank: '5' },
        ];
        expect(calculateScore(cards)).toBe(1);
      });

      it('should return ones digit when sum equals 15', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '8' },
          { suit: 'diamonds', rank: '7' },
        ];
        expect(calculateScore(cards)).toBe(5);
      });

      it('should return ones digit when sum equals 19', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '9' },
          { suit: 'diamonds', rank: '8' },
          { suit: 'clubs', rank: '2' },
        ];
        expect(calculateScore(cards)).toBe(9);
      });

      it('should return ones digit when sum equals 20', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '9' },
          { suit: 'diamonds', rank: '9' },
          { suit: 'clubs', rank: '2' },
        ];
        expect(calculateScore(cards)).toBe(0);
      });

      it('should return ones digit when sum equals 27', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '9' },
          { suit: 'diamonds', rank: '9' },
          { suit: 'clubs', rank: '9' },
        ];
        expect(calculateScore(cards)).toBe(7);
      });
    });

    describe('Face Cards (10, J, Q, K = 0 points)', () => {
      it('should calculate correctly with 10 card', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '10' },
          { suit: 'diamonds', rank: '5' },
        ];
        expect(calculateScore(cards)).toBe(5);
      });

      it('should calculate correctly with Jack', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'J' },
          { suit: 'diamonds', rank: '7' },
        ];
        expect(calculateScore(cards)).toBe(7);
      });

      it('should calculate correctly with Queen', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'Q' },
          { suit: 'diamonds', rank: '3' },
        ];
        expect(calculateScore(cards)).toBe(3);
      });

      it('should calculate correctly with King', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'K' },
          { suit: 'diamonds', rank: '9' },
        ];
        expect(calculateScore(cards)).toBe(9);
      });

      it('should return 0 for two face cards', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'K' },
          { suit: 'diamonds', rank: 'Q' },
        ];
        expect(calculateScore(cards)).toBe(0);
      });

      it('should return 0 for three face cards', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'K' },
          { suit: 'diamonds', rank: 'Q' },
          { suit: 'clubs', rank: 'J' },
        ];
        expect(calculateScore(cards)).toBe(0);
      });
    });

    describe('Ace Behavior (A = 1 point)', () => {
      it('should treat Ace as 1 point', () => {
        const cards: Card[] = [{ suit: 'hearts', rank: 'A' }];
        expect(calculateScore(cards)).toBe(1);
      });

      it('should calculate Ace + number card correctly', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'A' },
          { suit: 'diamonds', rank: '8' },
        ];
        expect(calculateScore(cards)).toBe(9);
      });

      it('should calculate Ace + Ace correctly (1 + 1 = 2)', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'A' },
          { suit: 'diamonds', rank: 'A' },
        ];
        expect(calculateScore(cards)).toBe(2);
      });

      it('should calculate Ace + face card correctly (1 + 0 = 1)', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'A' },
          { suit: 'diamonds', rank: 'K' },
        ];
        expect(calculateScore(cards)).toBe(1);
      });
    });

    describe('Natural Win Scenarios (8 or 9)', () => {
      it('should return 8 for natural 8', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '5' },
          { suit: 'diamonds', rank: '3' },
        ];
        expect(calculateScore(cards)).toBe(8);
      });

      it('should return 9 for natural 9', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'A' },
          { suit: 'diamonds', rank: '8' },
        ];
        expect(calculateScore(cards)).toBe(9);
      });

      it('should return 9 for natural 9 (alternative)', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '4' },
          { suit: 'diamonds', rank: '5' },
        ];
        expect(calculateScore(cards)).toBe(9);
      });
    });

    describe('Real Game Scenarios', () => {
      it('should calculate player hand: 6 + 3 = 9', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '6' },
          { suit: 'diamonds', rank: '3' },
        ];
        expect(calculateScore(cards)).toBe(9);
      });

      it('should calculate banker hand: K + 5 = 5', () => {
        const cards: Card[] = [
          { suit: 'clubs', rank: 'K' },
          { suit: 'spades', rank: '5' },
        ];
        expect(calculateScore(cards)).toBe(5);
      });

      it('should calculate player hand with third card: 5 + 2 + 4 = 1', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '5' },
          { suit: 'diamonds', rank: '2' },
          { suit: 'clubs', rank: '4' },
        ];
        expect(calculateScore(cards)).toBe(1);
      });

      it('should calculate banker hand with third card: 3 + 4 + 9 = 6', () => {
        const cards: Card[] = [
          { suit: 'spades', rank: '3' },
          { suit: 'hearts', rank: '4' },
          { suit: 'diamonds', rank: '9' },
        ];
        expect(calculateScore(cards)).toBe(6);
      });

      it('should calculate tie scenario: both have 7', () => {
        const playerCards: Card[] = [
          { suit: 'hearts', rank: '4' },
          { suit: 'diamonds', rank: '3' },
        ];
        const bankerCards: Card[] = [
          { suit: 'clubs', rank: '2' },
          { suit: 'spades', rank: '5' },
        ];
        expect(calculateScore(playerCards)).toBe(7);
        expect(calculateScore(bankerCards)).toBe(7);
      });
    });

    describe('Edge Cases', () => {
      it('should handle maximum possible two-card sum (9+9=18→8)', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '9' },
          { suit: 'diamonds', rank: '9' },
        ];
        expect(calculateScore(cards)).toBe(8);
      });

      it('should handle minimum possible score (all face cards = 0)', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'K' },
          { suit: 'diamonds', rank: 'Q' },
          { suit: 'clubs', rank: 'J' },
        ];
        expect(calculateScore(cards)).toBe(0);
      });

      it('should handle all Aces (1+1+1=3)', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: 'A' },
          { suit: 'diamonds', rank: 'A' },
          { suit: 'clubs', rank: 'A' },
        ];
        expect(calculateScore(cards)).toBe(3);
      });
    });

    describe('Immutability', () => {
      it('should not modify input array', () => {
        const cards: Card[] = [
          { suit: 'hearts', rank: '5' },
          { suit: 'diamonds', rank: '7' },
        ];
        const original = [...cards];

        calculateScore(cards);

        expect(cards).toEqual(original);
      });
    });

    describe('Type Safety', () => {
      it('should work with readonly arrays', () => {
        const cards: readonly Card[] = [
          { suit: 'hearts', rank: '3' },
          { suit: 'diamonds', rank: '6' },
        ];
        expect(calculateScore(cards)).toBe(9);
      });
    });
  });

  describe('Integration: getCardValue + calculateScore', () => {
    it('should produce consistent results', () => {
      const cards: Card[] = [
        { suit: 'hearts', rank: '7' },
        { suit: 'diamonds', rank: '8' },
      ];

      const manualSum = (getCardValue(cards[0]) + getCardValue(cards[1])) % 10;
      const autoSum = calculateScore(cards);

      expect(autoSum).toBe(manualSum);
      expect(autoSum).toBe(5); // 7 + 8 = 15 → 5
    });

    it('should handle all card types consistently', () => {
      const testCases: Array<{ cards: Card[]; expected: number }> = [
        {
          cards: [
            { suit: 'hearts', rank: 'A' },
            { suit: 'diamonds', rank: '9' },
          ],
          expected: 0,
        }, // 1+9=10→0
        {
          cards: [
            { suit: 'hearts', rank: '2' },
            { suit: 'diamonds', rank: '3' },
          ],
          expected: 5,
        },
        {
          cards: [
            { suit: 'hearts', rank: 'K' },
            { suit: 'diamonds', rank: 'Q' },
          ],
          expected: 0,
        },
        {
          cards: [
            { suit: 'hearts', rank: '10' },
            { suit: 'diamonds', rank: '5' },
          ],
          expected: 5,
        },
      ];

      testCases.forEach(({ cards, expected }) => {
        expect(calculateScore(cards)).toBe(expected);
      });
    });
  });
});
