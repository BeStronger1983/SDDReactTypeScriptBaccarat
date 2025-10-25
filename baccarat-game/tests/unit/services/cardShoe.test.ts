import { describe, it, expect } from 'vitest';
import { createShoe, dealCard, needsShuffle, getRemainingCards } from '@/services/cardShoe';
import type { Card, Shoe } from '@/types/game';
import { TOTAL_DECKS, CARDS_PER_DECK, TOTAL_CARDS, SHUFFLE_THRESHOLD } from '@/types/game';

describe('cardShoe', () => {
  describe('createShoe', () => {
    describe('Initialization', () => {
      it('should create a shoe with correct total number of cards', () => {
        const shoe = createShoe();
        expect(shoe.cards.length).toBe(TOTAL_CARDS); // 8 decks * 52 cards = 416
      });

      it('should create a shoe with 8 decks', () => {
        const shoe = createShoe();
        expect(shoe.cards.length).toBe(8 * 52);
      });

      it('should initialize with 0 dealt cards', () => {
        const shoe = createShoe();
        expect(shoe.dealtCount).toBe(0);
      });

      it('should create a shuffled deck (not in order)', () => {
        const shoe1 = createShoe();
        const shoe2 = createShoe();

        // Two independently created shoes should have different card orders
        const firstCardsMatch = shoe1.cards.slice(0, 10).every((card, index) => {
          const card2 = shoe2.cards[index];
          return card.suit === card2.suit && card.rank === card2.rank;
        });

        // With 416 cards and proper shuffling, first 10 cards matching is extremely unlikely
        expect(firstCardsMatch).toBe(false);
      });
    });

    describe('Card Distribution', () => {
      it('should contain exactly 4 suits', () => {
        const shoe = createShoe();
        const suits = new Set(shoe.cards.map((card) => card.suit));
        expect(suits.size).toBe(4);
        expect(suits.has('hearts')).toBe(true);
        expect(suits.has('diamonds')).toBe(true);
        expect(suits.has('clubs')).toBe(true);
        expect(suits.has('spades')).toBe(true);
      });

      it('should contain exactly 13 ranks', () => {
        const shoe = createShoe();
        const ranks = new Set(shoe.cards.map((card) => card.rank));
        expect(ranks.size).toBe(13);
      });

      it('should have 32 cards of each rank (8 decks * 4 suits)', () => {
        const shoe = createShoe();
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

        ranks.forEach((rank) => {
          const count = shoe.cards.filter((card) => card.rank === rank).length;
          expect(count).toBe(32); // 8 decks * 4 suits per rank
        });
      });

      it('should have 104 cards of each suit (8 decks * 13 ranks)', () => {
        const shoe = createShoe();
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

        suits.forEach((suit) => {
          const count = shoe.cards.filter((card) => card.suit === suit).length;
          expect(count).toBe(104); // 8 decks * 13 ranks per suit
        });
      });

      it('should have exactly 8 of each specific card (e.g., Ace of Hearts)', () => {
        const shoe = createShoe();
        const aceOfHeartsCount = shoe.cards.filter(
          (card) => card.rank === 'A' && card.suit === 'hearts'
        ).length;
        expect(aceOfHeartsCount).toBe(8); // 8 decks
      });
    });

    describe('Shoe Structure', () => {
      it('should return a valid Shoe object', () => {
        const shoe = createShoe();
        expect(shoe).toHaveProperty('cards');
        expect(shoe).toHaveProperty('dealtCount');
        expect(Array.isArray(shoe.cards)).toBe(true);
        expect(typeof shoe.dealtCount).toBe('number');
      });

      it('should create independent shoes on each call', () => {
        const shoe1 = createShoe();
        const shoe2 = createShoe();

        expect(shoe1).not.toBe(shoe2);
        expect(shoe1.cards).not.toBe(shoe2.cards);
      });
    });
  });

  describe('dealCard', () => {
    describe('Basic Dealing', () => {
      it('should deal a card and increment dealt count', () => {
        let shoe = createShoe();
        const initialCount = shoe.dealtCount;

        const result = dealCard(shoe);
        shoe = result.shoe;

        expect(result.card).toBeDefined();
        expect(shoe.dealtCount).toBe(initialCount + 1);
      });

      it('should deal different cards sequentially', () => {
        let shoe = createShoe();
        const result1 = dealCard(shoe);
        shoe = result1.shoe;
        const result2 = dealCard(shoe);

        // Cards should be from the same shoe but dealt in sequence
        expect(result2.shoe.dealtCount).toBe(2);
      });

      it('should deal all cards from the shoe', () => {
        let shoe = createShoe();

        for (let i = 0; i < TOTAL_CARDS; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
          expect(result.card).toBeDefined();
          expect(shoe.dealtCount).toBe(i + 1);
        }

        expect(shoe.dealtCount).toBe(TOTAL_CARDS);
      });

      it('should return valid card objects', () => {
        const shoe = createShoe();
        const result = dealCard(shoe);

        expect(result.card).toHaveProperty('suit');
        expect(result.card).toHaveProperty('rank');
        expect(['hearts', 'diamonds', 'clubs', 'spades']).toContain(result.card.suit);
      });
    });

    describe('Immutability', () => {
      it('should not mutate the original shoe', () => {
        const shoe = createShoe();
        const originalDealtCount = shoe.dealtCount;
        const originalCardsLength = shoe.cards.length;

        dealCard(shoe);

        expect(shoe.dealtCount).toBe(originalDealtCount);
        expect(shoe.cards.length).toBe(originalCardsLength);
      });

      it('should return a new shoe object', () => {
        const shoe = createShoe();
        const result = dealCard(shoe);

        expect(result.shoe).not.toBe(shoe);
      });
    });

    describe('Multiple Deals', () => {
      it('should handle multiple sequential deals', () => {
        let shoe = createShoe();

        for (let i = 1; i <= 10; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
          expect(shoe.dealtCount).toBe(i);
        }
      });

      it('should maintain card order across deals', () => {
        let shoe = createShoe();
        const expectedCards = shoe.cards.slice(0, 5);
        const dealtCards: Card[] = [];

        for (let i = 0; i < 5; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
          dealtCards.push(result.card);
        }

        dealtCards.forEach((card, index) => {
          expect(card.suit).toBe(expectedCards[index].suit);
          expect(card.rank).toBe(expectedCards[index].rank);
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle dealing when close to shuffle threshold', () => {
        let shoe = createShoe();

        // Deal until close to shuffle threshold
        const cardsToThreshold = TOTAL_CARDS - SHUFFLE_THRESHOLD - 5;
        for (let i = 0; i < cardsToThreshold; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
        }

        const result = dealCard(shoe);
        expect(result.card).toBeDefined();
        expect(result.shoe.dealtCount).toBe(cardsToThreshold + 1);
      });

      it('should handle dealing the last card', () => {
        let shoe = createShoe();

        // Deal all but one card
        for (let i = 0; i < TOTAL_CARDS - 1; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
        }

        // Deal the last card
        const result = dealCard(shoe);
        expect(result.card).toBeDefined();
        expect(result.shoe.dealtCount).toBe(TOTAL_CARDS);
      });
    });
  });

  describe('needsShuffle', () => {
    describe('Shuffle Threshold Logic', () => {
      it('should return false when shoe is fresh', () => {
        const shoe = createShoe();
        expect(needsShuffle(shoe)).toBe(false);
      });

      it('should return false when below shuffle threshold', () => {
        let shoe = createShoe();

        // Deal cards but stay below threshold
        const cardsToDeal = 10;
        for (let i = 0; i < cardsToDeal; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
        }

        expect(needsShuffle(shoe)).toBe(false);
      });

      it('should return true when exactly at shuffle threshold', () => {
        let shoe = createShoe();

        // Deal cards to reach threshold
        const cardsToThreshold = TOTAL_CARDS - SHUFFLE_THRESHOLD;
        for (let i = 0; i < cardsToThreshold; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
        }

        expect(shoe.dealtCount).toBe(cardsToThreshold);
        expect(getRemainingCards(shoe)).toBe(SHUFFLE_THRESHOLD);
        expect(needsShuffle(shoe)).toBe(true);
      });

      it('should return true when below shuffle threshold', () => {
        let shoe = createShoe();

        // Deal more cards than threshold
        const cardsToThreshold = TOTAL_CARDS - SHUFFLE_THRESHOLD + 10;
        for (let i = 0; i < cardsToThreshold; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
        }

        expect(needsShuffle(shoe)).toBe(true);
      });

      it('should return true when only 1 card remains', () => {
        let shoe = createShoe();

        // Deal all but one card
        for (let i = 0; i < TOTAL_CARDS - 1; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
        }

        expect(needsShuffle(shoe)).toBe(true);
      });

      it('should return true when all cards are dealt', () => {
        let shoe = createShoe();

        // Deal all cards
        for (let i = 0; i < TOTAL_CARDS; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
        }

        expect(needsShuffle(shoe)).toBe(true);
      });
    });

    describe('Boundary Testing', () => {
      it('should return false when one card above threshold', () => {
        let shoe = createShoe();

        // Deal to one card above threshold
        const cardsToDeal = TOTAL_CARDS - SHUFFLE_THRESHOLD - 1;
        for (let i = 0; i < cardsToDeal; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
        }

        expect(getRemainingCards(shoe)).toBe(SHUFFLE_THRESHOLD + 1);
        expect(needsShuffle(shoe)).toBe(false);
      });

      it('should use SHUFFLE_THRESHOLD constant correctly', () => {
        let shoe = createShoe();

        // Deal until threshold
        for (let i = 0; i < TOTAL_CARDS - SHUFFLE_THRESHOLD; i++) {
          const result = dealCard(shoe);
          shoe = result.shoe;
        }

        expect(needsShuffle(shoe)).toBe(true);
        expect(SHUFFLE_THRESHOLD).toBe(52); // Verify constant value
      });
    });
  });

  describe('getRemainingCards', () => {
    it('should return correct count of remaining cards', () => {
      const shoe = createShoe();
      expect(getRemainingCards(shoe)).toBe(TOTAL_CARDS);
    });

    it('should decrease as cards are dealt', () => {
      let shoe = createShoe();

      for (let i = 1; i <= 10; i++) {
        const result = dealCard(shoe);
        shoe = result.shoe;
        expect(getRemainingCards(shoe)).toBe(TOTAL_CARDS - i);
      }
    });

    it('should return 0 when all cards are dealt', () => {
      let shoe = createShoe();

      for (let i = 0; i < TOTAL_CARDS; i++) {
        const result = dealCard(shoe);
        shoe = result.shoe;
      }

      expect(getRemainingCards(shoe)).toBe(0);
    });

    it('should return SHUFFLE_THRESHOLD at threshold', () => {
      let shoe = createShoe();

      const cardsToDeal = TOTAL_CARDS - SHUFFLE_THRESHOLD;
      for (let i = 0; i < cardsToDeal; i++) {
        const result = dealCard(shoe);
        shoe = result.shoe;
      }

      expect(getRemainingCards(shoe)).toBe(SHUFFLE_THRESHOLD);
    });
  });

  describe('Integration: Complete Game Flow', () => {
    it('should handle a complete game round', () => {
      let shoe = createShoe();

      // Deal initial 4 cards (2 for player, 2 for banker)
      const cards: Card[] = [];
      for (let i = 0; i < 4; i++) {
        const result = dealCard(shoe);
        shoe = result.shoe;
        cards.push(result.card);
      }

      expect(cards.length).toBe(4);
      expect(shoe.dealtCount).toBe(4);
      expect(needsShuffle(shoe)).toBe(false);
    });

    it('should handle a game with third card draws', () => {
      let shoe = createShoe();

      // Deal 6 cards (max possible in one round)
      for (let i = 0; i < 6; i++) {
        const result = dealCard(shoe);
        shoe = result.shoe;
      }

      expect(shoe.dealtCount).toBe(6);
      expect(getRemainingCards(shoe)).toBe(TOTAL_CARDS - 6);
    });

    it('should handle multiple rounds until shuffle needed', () => {
      let shoe = createShoe();
      let rounds = 0;

      while (!needsShuffle(shoe)) {
        // Simulate a round with 4-6 cards
        const cardsThisRound = 4 + Math.floor(Math.random() * 3);
        for (let i = 0; i < cardsThisRound; i++) {
          if (getRemainingCards(shoe) > 0) {
            const result = dealCard(shoe);
            shoe = result.shoe;
          }
        }
        rounds++;

        // Safety break to prevent infinite loop
        if (rounds > 100) break;
      }

      expect(needsShuffle(shoe)).toBe(true);
      expect(getRemainingCards(shoe)).toBeLessThanOrEqual(SHUFFLE_THRESHOLD);
    });

    it('should allow reshuffling when threshold is reached', () => {
      let shoe = createShoe();

      // Deal until shuffle needed
      while (!needsShuffle(shoe)) {
        const result = dealCard(shoe);
        shoe = result.shoe;
      }

      expect(needsShuffle(shoe)).toBe(true);

      // Create new shoe (reshuffle)
      const newShoe = createShoe();
      expect(needsShuffle(newShoe)).toBe(false);
      expect(getRemainingCards(newShoe)).toBe(TOTAL_CARDS);
    });
  });

  describe('Constants Validation', () => {
    it('should verify TOTAL_CARDS constant', () => {
      expect(TOTAL_CARDS).toBe(416); // 8 * 52
      expect(TOTAL_CARDS).toBe(TOTAL_DECKS * CARDS_PER_DECK);
    });

    it('should verify SHUFFLE_THRESHOLD constant', () => {
      expect(SHUFFLE_THRESHOLD).toBe(52);
      expect(SHUFFLE_THRESHOLD).toBeLessThan(TOTAL_CARDS);
    });

    it('should verify TOTAL_DECKS and CARDS_PER_DECK', () => {
      expect(TOTAL_DECKS).toBe(8);
      expect(CARDS_PER_DECK).toBe(52);
    });
  });
});
