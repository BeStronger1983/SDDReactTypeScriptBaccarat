import { describe, it, expect } from 'vitest';
import { calculatePayout, calculateTotalPayout } from '@/services/payoutCalculator';
import type { Bet, GameOutcome } from '@/types/game';
import { PAYOUT_RATES } from '@/types/game';

describe('payoutCalculator', () => {
  describe('calculatePayout', () => {
    describe('Player Wins (1:1 payout)', () => {
      it('should return correct payout when player wins with 100 bet', () => {
        const bets: Bet = { player: 100, banker: 0, tie: 0 };
        const outcome: GameOutcome = 'player';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(100); // 100 * 1.0
        expect(result.bankerPayout).toBe(0);
        expect(result.tiePayout).toBe(0);
        expect(result.totalPayout).toBe(100);
      });

      it('should return correct payout when player wins with 500 bet', () => {
        const bets: Bet = { player: 500, banker: 0, tie: 0 };
        const outcome: GameOutcome = 'player';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(500);
        expect(result.totalPayout).toBe(500);
      });

      it('should return 0 when player wins but no bet on player', () => {
        const bets: Bet = { player: 0, banker: 100, tie: 50 };
        const outcome: GameOutcome = 'player';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(0);
        expect(result.bankerPayout).toBe(0);
        expect(result.tiePayout).toBe(0);
        expect(result.totalPayout).toBe(0);
      });
    });

    describe('Banker Wins (1:0.95 payout)', () => {
      it('should return correct payout when banker wins with 100 bet', () => {
        const bets: Bet = { player: 0, banker: 100, tie: 0 };
        const outcome: GameOutcome = 'banker';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(0);
        expect(result.bankerPayout).toBe(95); // 100 * 0.95 (5% commission)
        expect(result.tiePayout).toBe(0);
        expect(result.totalPayout).toBe(95);
      });

      it('should return correct payout when banker wins with 500 bet', () => {
        const bets: Bet = { player: 0, banker: 500, tie: 0 };
        const outcome: GameOutcome = 'banker';
        const result = calculatePayout(bets, outcome);

        expect(result.bankerPayout).toBe(475); // 500 * 0.95
        expect(result.totalPayout).toBe(475);
      });

      it('should return correct payout when banker wins with 1000 bet', () => {
        const bets: Bet = { player: 0, banker: 1000, tie: 0 };
        const outcome: GameOutcome = 'banker';
        const result = calculatePayout(bets, outcome);

        expect(result.bankerPayout).toBe(950); // 1000 * 0.95
        expect(result.totalPayout).toBe(950);
      });

      it('should return 0 when banker wins but no bet on banker', () => {
        const bets: Bet = { player: 100, banker: 0, tie: 50 };
        const outcome: GameOutcome = 'banker';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(0);
        expect(result.bankerPayout).toBe(0);
        expect(result.tiePayout).toBe(0);
        expect(result.totalPayout).toBe(0);
      });
    });

    describe('Tie (1:8 payout)', () => {
      it('should return correct payout when tie with 100 bet', () => {
        const bets: Bet = { player: 0, banker: 0, tie: 100 };
        const outcome: GameOutcome = 'tie';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(0);
        expect(result.bankerPayout).toBe(0);
        expect(result.tiePayout).toBe(800); // 100 * 8.0
        expect(result.totalPayout).toBe(800);
      });

      it('should return correct payout when tie with 50 bet', () => {
        const bets: Bet = { player: 0, banker: 0, tie: 50 };
        const outcome: GameOutcome = 'tie';
        const result = calculatePayout(bets, outcome);

        expect(result.tiePayout).toBe(400); // 50 * 8.0
        expect(result.totalPayout).toBe(400);
      });

      it('should return correct payout when tie with 20 bet', () => {
        const bets: Bet = { player: 0, banker: 0, tie: 20 };
        const outcome: GameOutcome = 'tie';
        const result = calculatePayout(bets, outcome);

        expect(result.tiePayout).toBe(160); // 20 * 8.0
        expect(result.totalPayout).toBe(160);
      });

      it('should return 0 when tie but no bet on tie', () => {
        const bets: Bet = { player: 100, banker: 50, tie: 0 };
        const outcome: GameOutcome = 'tie';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(0);
        expect(result.bankerPayout).toBe(0);
        expect(result.tiePayout).toBe(0);
        expect(result.totalPayout).toBe(0);
      });

      it('should return player and banker bets when tie (push)', () => {
        const bets: Bet = { player: 100, banker: 50, tie: 0 };
        const outcome: GameOutcome = 'tie';
        const result = calculatePayout(bets, outcome);

        // On tie, player and banker bets are returned (0 profit)
        expect(result.playerPayout).toBe(0);
        expect(result.bankerPayout).toBe(0);
        expect(result.tiePayout).toBe(0);
        expect(result.totalPayout).toBe(0);
      });
    });

    describe('Multi-Area Betting', () => {
      it('should calculate payout for player win with multi-area bets', () => {
        const bets: Bet = { player: 100, banker: 50, tie: 20 };
        const outcome: GameOutcome = 'player';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(100); // Only player wins
        expect(result.bankerPayout).toBe(0); // Banker loses
        expect(result.tiePayout).toBe(0); // Tie loses
        expect(result.totalPayout).toBe(100);
      });

      it('should calculate payout for banker win with multi-area bets', () => {
        const bets: Bet = { player: 100, banker: 50, tie: 20 };
        const outcome: GameOutcome = 'banker';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(0); // Player loses
        expect(result.bankerPayout).toBe(47.5); // 50 * 0.95
        expect(result.tiePayout).toBe(0); // Tie loses
        expect(result.totalPayout).toBe(47.5);
      });

      it('should calculate payout for tie with multi-area bets', () => {
        const bets: Bet = { player: 100, banker: 50, tie: 20 };
        const outcome: GameOutcome = 'tie';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(0); // Push (returned, no profit)
        expect(result.bankerPayout).toBe(0); // Push (returned, no profit)
        expect(result.tiePayout).toBe(160); // 20 * 8.0
        expect(result.totalPayout).toBe(160);
      });
    });

    describe('Real Game Scenarios from Spec', () => {
      it('should handle scenario: player bet 100, player wins', () => {
        const bets: Bet = { player: 100, banker: 0, tie: 0 };
        const outcome: GameOutcome = 'player';
        const result = calculatePayout(bets, outcome);

        expect(result.totalPayout).toBe(100); // 1:1 payout
      });

      it('should handle scenario: banker bet 100, banker wins', () => {
        const bets: Bet = { player: 0, banker: 100, tie: 0 };
        const outcome: GameOutcome = 'banker';
        const result = calculatePayout(bets, outcome);

        expect(result.totalPayout).toBe(95); // 1:0.95 payout (5% commission)
      });

      it('should handle scenario: tie bet 100, tie occurs', () => {
        const bets: Bet = { player: 0, banker: 0, tie: 100 };
        const outcome: GameOutcome = 'tie';
        const result = calculatePayout(bets, outcome);

        expect(result.totalPayout).toBe(800); // 1:8 payout
      });

      it('should handle spec scenario: balance 1000, bets 100+50+20, player wins', () => {
        const bets: Bet = { player: 100, banker: 50, tie: 20 };
        const outcome: GameOutcome = 'player';
        const result = calculatePayout(bets, outcome);

        expect(result.totalPayout).toBe(100);
        // Net result: +100 (won) - 50 (lost) - 20 (lost) = +30
      });

      it('should handle spec scenario: balance 1000, bets 100+50+20, banker wins', () => {
        const bets: Bet = { player: 100, banker: 50, tie: 20 };
        const outcome: GameOutcome = 'banker';
        const result = calculatePayout(bets, outcome);

        expect(result.totalPayout).toBe(47.5); // 50 * 0.95
        // Net result: +47.5 (won) - 100 (lost) - 20 (lost) = -72.5
      });

      it('should handle spec scenario: balance 1000, bets 100+50+20, tie occurs', () => {
        const bets: Bet = { player: 100, banker: 50, tie: 20 };
        const outcome: GameOutcome = 'tie';
        const result = calculatePayout(bets, outcome);

        expect(result.totalPayout).toBe(160); // 20 * 8.0
        // Player and banker bets returned, tie wins 160
        // Net result: +160 (won) = +160
      });
    });

    describe('Edge Cases', () => {
      it('should handle zero bets', () => {
        const bets: Bet = { player: 0, banker: 0, tie: 0 };
        const outcome: GameOutcome = 'player';
        const result = calculatePayout(bets, outcome);

        expect(result.totalPayout).toBe(0);
      });

      it('should handle decimal bet amounts', () => {
        const bets: Bet = { player: 100.5, banker: 0, tie: 0 };
        const outcome: GameOutcome = 'player';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(100.5);
        expect(result.totalPayout).toBe(100.5);
      });

      it('should handle decimal banker payout', () => {
        const bets: Bet = { player: 0, banker: 101, tie: 0 };
        const outcome: GameOutcome = 'banker';
        const result = calculatePayout(bets, outcome);

        expect(result.bankerPayout).toBeCloseTo(95.95, 2); // 101 * 0.95
        expect(result.totalPayout).toBeCloseTo(95.95, 2);
      });

      it('should handle large bet amounts', () => {
        const bets: Bet = { player: 10000, banker: 0, tie: 0 };
        const outcome: GameOutcome = 'player';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(10000);
        expect(result.totalPayout).toBe(10000);
      });
    });

    describe('Payout Rate Consistency', () => {
      it('should use PAYOUT_RATES constant for player', () => {
        const bets: Bet = { player: 100, banker: 0, tie: 0 };
        const outcome: GameOutcome = 'player';
        const result = calculatePayout(bets, outcome);

        expect(result.playerPayout).toBe(100 * PAYOUT_RATES.player);
      });

      it('should use PAYOUT_RATES constant for banker', () => {
        const bets: Bet = { player: 0, banker: 100, tie: 0 };
        const outcome: GameOutcome = 'banker';
        const result = calculatePayout(bets, outcome);

        expect(result.bankerPayout).toBe(100 * PAYOUT_RATES.banker);
      });

      it('should use PAYOUT_RATES constant for tie', () => {
        const bets: Bet = { player: 0, banker: 0, tie: 100 };
        const outcome: GameOutcome = 'tie';
        const result = calculatePayout(bets, outcome);

        expect(result.tiePayout).toBe(100 * PAYOUT_RATES.tie);
      });
    });
  });

  describe('calculateTotalPayout', () => {
    it('should sum all individual payouts correctly', () => {
      const bets: Bet = { player: 100, banker: 100, tie: 100 };
      const outcome: GameOutcome = 'player';
      const totalPayout = calculateTotalPayout(bets, outcome);

      expect(totalPayout).toBe(100); // Only player wins
    });

    it('should return 0 when no bets placed', () => {
      const bets: Bet = { player: 0, banker: 0, tie: 0 };
      const outcome: GameOutcome = 'player';
      const totalPayout = calculateTotalPayout(bets, outcome);

      expect(totalPayout).toBe(0);
    });

    it('should handle multi-area banker win', () => {
      const bets: Bet = { player: 100, banker: 50, tie: 20 };
      const outcome: GameOutcome = 'banker';
      const totalPayout = calculateTotalPayout(bets, outcome);

      expect(totalPayout).toBe(47.5); // 50 * 0.95
    });

    it('should handle multi-area tie', () => {
      const bets: Bet = { player: 100, banker: 50, tie: 20 };
      const outcome: GameOutcome = 'tie';
      const totalPayout = calculateTotalPayout(bets, outcome);

      expect(totalPayout).toBe(160); // 20 * 8.0
    });

    it('should be consistent with calculatePayout totalPayout', () => {
      const bets: Bet = { player: 200, banker: 150, tie: 50 };
      const outcome: GameOutcome = 'banker';

      const result = calculatePayout(bets, outcome);
      const total = calculateTotalPayout(bets, outcome);

      expect(total).toBe(result.totalPayout);
    });
  });

  describe('Integration: Bet Structure Validation', () => {
    it('should handle valid Bet object structure', () => {
      const bets: Bet = { player: 100, banker: 50, tie: 20 };
      const outcome: GameOutcome = 'player';
      const result = calculatePayout(bets, outcome);

      expect(result).toHaveProperty('playerPayout');
      expect(result).toHaveProperty('bankerPayout');
      expect(result).toHaveProperty('tiePayout');
      expect(result).toHaveProperty('totalPayout');
    });

    it('should handle all valid game outcomes', () => {
      const bets: Bet = { player: 100, banker: 100, tie: 100 };
      const outcomes: GameOutcome[] = ['player', 'banker', 'tie'];

      outcomes.forEach((outcome) => {
        const result = calculatePayout(bets, outcome);
        expect(result.totalPayout).toBeGreaterThan(0);
      });
    });
  });

  describe('Mathematical Correctness', () => {
    it('should ensure banker payout is always less than bet amount (due to commission)', () => {
      const bets: Bet = { player: 0, banker: 100, tie: 0 };
      const outcome: GameOutcome = 'banker';
      const result = calculatePayout(bets, outcome);

      expect(result.bankerPayout).toBeLessThan(bets.banker);
      expect(result.bankerPayout).toBe(95); // Exactly 95% of bet
    });

    it('should ensure player and tie payouts equal or exceed bet (when winning)', () => {
      const playerBets: Bet = { player: 100, banker: 0, tie: 0 };
      const playerResult = calculatePayout(playerBets, 'player');
      expect(playerResult.playerPayout).toBeGreaterThanOrEqual(playerBets.player);

      const tieBets: Bet = { player: 0, banker: 0, tie: 100 };
      const tieResult = calculatePayout(tieBets, 'tie');
      expect(tieResult.tiePayout).toBeGreaterThan(tieBets.tie);
    });

    it('should maintain precision with banker commission calculation', () => {
      const bets: Bet = { player: 0, banker: 200, tie: 0 };
      const outcome: GameOutcome = 'banker';
      const result = calculatePayout(bets, outcome);

      expect(result.bankerPayout).toBe(190); // 200 * 0.95 = 190.00
    });
  });
});
