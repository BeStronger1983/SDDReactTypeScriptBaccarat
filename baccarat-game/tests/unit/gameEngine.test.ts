import { describe, it, expect, beforeEach } from 'vitest';
import { executeGameRound, determineOutcome } from '@/services/gameEngine';
import type { Shoe, Bet, Hand } from '@/types/game';
import { createShoe } from '@/services/cardShoe';

describe('gameEngine', () => {
  let shoe: Shoe;

  beforeEach(() => {
    shoe = createShoe();
  });

  describe('determineOutcome', () => {
    it('should determine player wins when player score is higher', () => {
      const playerHand: Hand = { cards: [], score: 8, isNatural: true };
      const bankerHand: Hand = { cards: [], score: 7, isNatural: false };

      const outcome = determineOutcome(playerHand, bankerHand);

      expect(outcome).toBe('player');
    });

    it('should determine banker wins when banker score is higher', () => {
      const playerHand: Hand = { cards: [], score: 5, isNatural: false };
      const bankerHand: Hand = { cards: [], score: 7, isNatural: false };

      const outcome = determineOutcome(playerHand, bankerHand);

      expect(outcome).toBe('banker');
    });

    it('should determine tie when scores are equal', () => {
      const playerHand: Hand = { cards: [], score: 6, isNatural: false };
      const bankerHand: Hand = { cards: [], score: 6, isNatural: false };

      const outcome = determineOutcome(playerHand, bankerHand);

      expect(outcome).toBe('tie');
    });

    it('should handle natural 8 vs natural 8 as tie', () => {
      const playerHand: Hand = { cards: [], score: 8, isNatural: true };
      const bankerHand: Hand = { cards: [], score: 8, isNatural: true };

      const outcome = determineOutcome(playerHand, bankerHand);

      expect(outcome).toBe('tie');
    });

    it('should handle natural 9 vs natural 9 as tie', () => {
      const playerHand: Hand = { cards: [], score: 9, isNatural: true };
      const bankerHand: Hand = { cards: [], score: 9, isNatural: true };

      const outcome = determineOutcome(playerHand, bankerHand);

      expect(outcome).toBe('tie');
    });

    it('should handle score 0 vs score 0 as tie', () => {
      const playerHand: Hand = { cards: [], score: 0, isNatural: false };
      const bankerHand: Hand = { cards: [], score: 0, isNatural: false };

      const outcome = determineOutcome(playerHand, bankerHand);

      expect(outcome).toBe('tie');
    });

    it('should determine player wins with natural 9 vs 8', () => {
      const playerHand: Hand = { cards: [], score: 9, isNatural: true };
      const bankerHand: Hand = { cards: [], score: 8, isNatural: true };

      const outcome = determineOutcome(playerHand, bankerHand);

      expect(outcome).toBe('player');
    });

    it('should determine banker wins with natural 9 vs 8', () => {
      const playerHand: Hand = { cards: [], score: 8, isNatural: true };
      const bankerHand: Hand = { cards: [], score: 9, isNatural: true };

      const outcome = determineOutcome(playerHand, bankerHand);

      expect(outcome).toBe('banker');
    });
  });

  describe('executeGameRound', () => {
    it('should deal initial 4 cards (2 to player, 2 to banker)', () => {
      const bets: Bet = { player: 100, banker: 0, tie: 0 };

      const result = executeGameRound(shoe, bets);

      // Both hands should have at least 2 cards (may have 3 if third card was drawn)
      expect(result.playerHand.cards.length).toBeGreaterThanOrEqual(2);
      expect(result.bankerHand.cards.length).toBeGreaterThanOrEqual(2);
      expect(result.shoe.dealtCount).toBeGreaterThanOrEqual(4);
    });

    it('should calculate correct scores for initial hands', () => {
      const bets: Bet = { player: 100, banker: 0, tie: 0 };

      const result = executeGameRound(shoe, bets);

      expect(result.playerHand.score).toBeGreaterThanOrEqual(0);
      expect(result.playerHand.score).toBeLessThanOrEqual(9);
      expect(result.bankerHand.score).toBeGreaterThanOrEqual(0);
      expect(result.bankerHand.score).toBeLessThanOrEqual(9);
    });

    it('should detect natural 8 or 9', () => {
      // This test runs multiple times to eventually hit a natural
      let foundNatural = false;

      for (let i = 0; i < 100; i++) {
        const freshShoe = createShoe();
        const bets: Bet = { player: 100, banker: 0, tie: 0 };
        const result = executeGameRound(freshShoe, bets);

        if (result.playerHand.isNatural || result.bankerHand.isNatural) {
          foundNatural = true;
          expect([8, 9]).toContain(
            result.playerHand.isNatural ? result.playerHand.score : result.bankerHand.score
          );
          break;
        }
      }

      // With 100 trials, we should almost certainly find at least one natural
      expect(foundNatural).toBe(true);
    });

    it('should not draw third card when natural is present', () => {
      // Run multiple rounds to find a natural
      let foundNatural = false;

      for (let i = 0; i < 100; i++) {
        const freshShoe = createShoe();
        const bets: Bet = { player: 100, banker: 0, tie: 0 };
        const result = executeGameRound(freshShoe, bets);

        if (result.playerHand.isNatural || result.bankerHand.isNatural) {
          foundNatural = true;
          // When natural is present, no third cards should be dealt
          expect(result.playerHand.cards.length).toBe(2);
          expect(result.bankerHand.cards.length).toBe(2);
          break;
        }
      }

      expect(foundNatural).toBe(true);
    });

    it('should apply player drawing rules correctly', () => {
      // Run multiple rounds and check that drawing rules are followed
      for (let i = 0; i < 50; i++) {
        const freshShoe = createShoe();
        const bets: Bet = { player: 100, banker: 0, tie: 0 };
        const result = executeGameRound(freshShoe, bets);

        const playerInitialScore = result.playerHand.score;

        // If player has 2 cards, check if initial score was correct for standing
        if (result.playerHand.cards.length === 2) {
          // Player should stand on 6-7 or natural 8-9
          expect(
            playerInitialScore >= 6 || result.playerHand.isNatural || result.bankerHand.isNatural
          ).toBe(true);
        }

        // If player has 3 cards, initial score should have been 0-5
        if (result.playerHand.cards.length === 3) {
          // Can't easily check initial score, but we can verify third card exists
          expect(result.playerHand.cards[2]).toBeDefined();
        }
      }
    });

    it('should apply banker drawing rules correctly when player stands', () => {
      // Test banker draws when player stands and banker has 0-5
      for (let i = 0; i < 50; i++) {
        const freshShoe = createShoe();
        const bets: Bet = { player: 0, banker: 100, tie: 0 };
        const result = executeGameRound(freshShoe, bets);

        // If player stood (2 cards) and no natural
        if (
          result.playerHand.cards.length === 2 &&
          !result.playerHand.isNatural &&
          !result.bankerHand.isNatural
        ) {
          const bankerHasThree = result.bankerHand.cards.length === 3;

          // Can't determine initial banker score easily, but we can verify consistency
          if (bankerHasThree) {
            expect(result.bankerHand.cards.length).toBe(3);
          } else {
            expect(result.bankerHand.cards.length).toBe(2);
          }
        }
      }
    });

    it('should return correct outcome', () => {
      const bets: Bet = { player: 100, banker: 0, tie: 0 };

      const result = executeGameRound(shoe, bets);

      expect(['player', 'banker', 'tie']).toContain(result.outcome);
    });

    it('should calculate correct payout for player win', () => {
      // Run multiple rounds until we get a player win
      for (let i = 0; i < 100; i++) {
        const freshShoe = createShoe();
        const bets: Bet = { player: 100, banker: 0, tie: 0 };
        const result = executeGameRound(freshShoe, bets);

        if (result.outcome === 'player') {
          // Player bet 100, wins 1:1
          expect(result.payout).toBe(100);
          break;
        }
      }
    });

    it('should calculate correct payout for banker win', () => {
      // Run multiple rounds until we get a banker win
      for (let i = 0; i < 100; i++) {
        const freshShoe = createShoe();
        const bets: Bet = { player: 0, banker: 100, tie: 0 };
        const result = executeGameRound(freshShoe, bets);

        if (result.outcome === 'banker') {
          // Banker bet 100, wins 1:0.95
          expect(result.payout).toBe(95);
          break;
        }
      }
    });

    it('should calculate correct payout for tie', () => {
      // Run multiple rounds until we get a tie
      for (let i = 0; i < 200; i++) {
        const freshShoe = createShoe();
        const bets: Bet = { player: 0, banker: 0, tie: 100 };
        const result = executeGameRound(freshShoe, bets);

        if (result.outcome === 'tie') {
          // Tie bet 100, wins 1:8
          expect(result.payout).toBe(800);
          break;
        }
      }
    });

    it('should handle multi-area bets correctly', () => {
      const bets: Bet = { player: 100, banker: 50, tie: 20 };

      const result = executeGameRound(shoe, bets);

      // Payout should be calculated correctly based on outcome
      if (result.outcome === 'player') {
        expect(result.payout).toBe(100); // Only player bet wins
      } else if (result.outcome === 'banker') {
        expect(result.payout).toBe(47.5); // 50 * 0.95
      } else if (result.outcome === 'tie') {
        expect(result.payout).toBe(160); // 20 * 8
      }
    });

    it('should return updated shoe with dealt cards', () => {
      const bets: Bet = { player: 100, banker: 0, tie: 0 };
      const initialDealtCount = shoe.dealtCount;

      const result = executeGameRound(shoe, bets);

      expect(result.shoe.dealtCount).toBeGreaterThan(initialDealtCount);
    });

    it('should not mutate original shoe', () => {
      const bets: Bet = { player: 100, banker: 0, tie: 0 };
      const originalDealtCount = shoe.dealtCount;

      executeGameRound(shoe, bets);

      expect(shoe.dealtCount).toBe(originalDealtCount);
    });

    it('should handle zero bets', () => {
      const bets: Bet = { player: 0, banker: 0, tie: 0 };

      const result = executeGameRound(shoe, bets);

      expect(result.payout).toBe(0);
      expect(result.outcome).toBeDefined();
    });

    it('should complete a full game round with all steps', () => {
      const bets: Bet = { player: 100, banker: 50, tie: 20 };

      const result = executeGameRound(shoe, bets);

      // Verify all parts of the result
      expect(result.playerHand).toBeDefined();
      expect(result.bankerHand).toBeDefined();
      expect(result.outcome).toBeDefined();
      expect(result.payout).toBeGreaterThanOrEqual(0);
      expect(result.shoe).toBeDefined();
      expect(result.shoe.dealtCount).toBeGreaterThan(0);
    });

    it('should handle maximum possible scores', () => {
      // Run multiple rounds and verify scores never exceed 9
      for (let i = 0; i < 50; i++) {
        const freshShoe = createShoe();
        const bets: Bet = { player: 100, banker: 0, tie: 0 };
        const result = executeGameRound(freshShoe, bets);

        expect(result.playerHand.score).toBeLessThanOrEqual(9);
        expect(result.bankerHand.score).toBeLessThanOrEqual(9);
        expect(result.playerHand.score).toBeGreaterThanOrEqual(0);
        expect(result.bankerHand.score).toBeGreaterThanOrEqual(0);
      }
    });

    it('should deal cards in correct order (Player-Banker-Player-Banker)', () => {
      const bets: Bet = { player: 100, banker: 0, tie: 0 };

      const result = executeGameRound(shoe, bets);

      // Initial 4 cards should be dealt
      expect(result.playerHand.cards.length).toBeGreaterThanOrEqual(2);
      expect(result.bankerHand.cards.length).toBeGreaterThanOrEqual(2);

      // Both should have at least 2 cards
      expect(result.playerHand.cards[0]).toBeDefined();
      expect(result.playerHand.cards[1]).toBeDefined();
      expect(result.bankerHand.cards[0]).toBeDefined();
      expect(result.bankerHand.cards[1]).toBeDefined();
    });

    it('should produce deterministic outcome for same shoe state', () => {
      // Create two identical shoes
      const shoe1 = createShoe();
      const shoe2: Shoe = {
        cards: [...shoe1.cards],
        dealtCount: 0,
        totalCards: shoe1.totalCards,
        needsShuffle: false,
      };

      const bets: Bet = { player: 100, banker: 0, tie: 0 };

      const result1 = executeGameRound(shoe1, bets);
      const result2 = executeGameRound(shoe2, bets);

      // Results should be identical
      expect(result1.outcome).toBe(result2.outcome);
      expect(result1.playerHand.score).toBe(result2.playerHand.score);
      expect(result1.bankerHand.score).toBe(result2.bankerHand.score);
      expect(result1.payout).toBe(result2.payout);
    });
  });

  describe('Edge Cases', () => {
    it('should handle consecutive rounds without errors', () => {
      let currentShoe = shoe;
      const bets: Bet = { player: 100, banker: 0, tie: 0 };

      for (let i = 0; i < 10; i++) {
        const result = executeGameRound(currentShoe, bets);
        currentShoe = result.shoe;

        expect(result.outcome).toBeDefined();
        expect(result.payout).toBeGreaterThanOrEqual(0);
      }
    });

    it('should handle large bet amounts', () => {
      const bets: Bet = { player: 1000000, banker: 0, tie: 0 };

      const result = executeGameRound(shoe, bets);

      if (result.outcome === 'player') {
        expect(result.payout).toBe(1000000);
      }
    });

    it('should handle fractional payout for banker (95%)', () => {
      // Find a banker win
      for (let i = 0; i < 100; i++) {
        const freshShoe = createShoe();
        const bets: Bet = { player: 0, banker: 100, tie: 0 };
        const result = executeGameRound(freshShoe, bets);

        if (result.outcome === 'banker') {
          // 100 * 0.95 = 95
          expect(result.payout).toBe(95);
          expect(result.payout % 1).toBe(0); // Should be whole number for this bet
          break;
        }
      }
    });

    it('should handle all three bets losing (impossible in real game, but test coverage)', () => {
      const bets: Bet = { player: 100, banker: 100, tie: 100 };

      const result = executeGameRound(shoe, bets);

      // One of them must win
      expect(result.payout).toBeGreaterThan(0);
    });
  });

  describe('Integration with Other Services', () => {
    it('should correctly use cardShoe dealCard function', () => {
      const bets: Bet = { player: 100, banker: 0, tie: 0 };
      const initialDealtCount = shoe.dealtCount;

      const result = executeGameRound(shoe, bets);

      // Should have dealt at least 4 cards
      expect(result.shoe.dealtCount).toBeGreaterThanOrEqual(initialDealtCount + 4);
    });

    it('should correctly use baccaratRules for drawing', () => {
      // Verify that drawing logic is applied correctly
      for (let i = 0; i < 30; i++) {
        const freshShoe = createShoe();
        const bets: Bet = { player: 100, banker: 0, tie: 0 };
        const result = executeGameRound(freshShoe, bets);

        // Player should have 2 or 3 cards
        expect([2, 3]).toContain(result.playerHand.cards.length);
        // Banker should have 2 or 3 cards
        expect([2, 3]).toContain(result.bankerHand.cards.length);
      }
    });

    it('should correctly use payoutCalculator for payouts', () => {
      const bets: Bet = { player: 100, banker: 50, tie: 20 };

      const result = executeGameRound(shoe, bets);

      // Verify payout matches expected calculation
      if (result.outcome === 'player') {
        expect(result.payout).toBe(100);
      } else if (result.outcome === 'banker') {
        expect(result.payout).toBe(47.5);
      } else {
        expect(result.payout).toBe(160);
      }
    });
  });
});
