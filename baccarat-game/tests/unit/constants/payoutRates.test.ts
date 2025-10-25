import { describe, it, expect } from 'vitest';
import {
  PLAYER_PAYOUT_RATE,
  BANKER_PAYOUT_RATE,
  TIE_PAYOUT_RATE,
  PAYOUT_RATES,
  BANKER_COMMISSION_RATE,
  BANKER_NET_PAYOUT,
  calculatePayout,
  calculateTotalReturn,
  getPayoutRate,
} from '@constants/payoutRates';

describe('payoutRates', () => {
  describe('Payout Rate Constants', () => {
    it('should define player payout rate as 1:1', () => {
      expect(PLAYER_PAYOUT_RATE).toBe(1.0);
    });

    it('should define banker payout rate as 1:0.95', () => {
      expect(BANKER_PAYOUT_RATE).toBe(0.95);
    });

    it('should define tie payout rate as 1:8', () => {
      expect(TIE_PAYOUT_RATE).toBe(8.0);
    });

    it('should have banker rate less than player rate', () => {
      expect(BANKER_PAYOUT_RATE).toBeLessThan(PLAYER_PAYOUT_RATE);
    });

    it('should have tie rate greater than player and banker rates', () => {
      expect(TIE_PAYOUT_RATE).toBeGreaterThan(PLAYER_PAYOUT_RATE);
      expect(TIE_PAYOUT_RATE).toBeGreaterThan(BANKER_PAYOUT_RATE);
    });
  });

  describe('PAYOUT_RATES Object', () => {
    it('should contain all three bet types', () => {
      expect(PAYOUT_RATES).toHaveProperty('player');
      expect(PAYOUT_RATES).toHaveProperty('banker');
      expect(PAYOUT_RATES).toHaveProperty('tie');
    });

    it('should map bet types to correct rates', () => {
      expect(PAYOUT_RATES.player).toBe(PLAYER_PAYOUT_RATE);
      expect(PAYOUT_RATES.banker).toBe(BANKER_PAYOUT_RATE);
      expect(PAYOUT_RATES.tie).toBe(TIE_PAYOUT_RATE);
    });

    it('should have exactly 3 bet types', () => {
      expect(Object.keys(PAYOUT_RATES)).toHaveLength(3);
    });

    it('should be immutable (readonly)', () => {
      expect(PAYOUT_RATES).toBeDefined();
      expect(typeof PAYOUT_RATES).toBe('object');
    });
  });

  describe('Commission Configuration', () => {
    it('should define banker commission as 5%', () => {
      expect(BANKER_COMMISSION_RATE).toBe(0.05);
    });

    it('should calculate banker net payout correctly', () => {
      expect(BANKER_NET_PAYOUT).toBe(1.0 - BANKER_COMMISSION_RATE);
      expect(BANKER_NET_PAYOUT).toBe(0.95);
    });

    it('should have banker net payout equal to banker payout rate', () => {
      expect(BANKER_NET_PAYOUT).toBe(BANKER_PAYOUT_RATE);
    });
  });

  describe('calculatePayout', () => {
    describe('Player Bets', () => {
      it('should calculate player payout at 1:1 ratio', () => {
        expect(calculatePayout('player', 100)).toBe(100);
      });

      it('should handle various player bet amounts', () => {
        expect(calculatePayout('player', 10)).toBe(10);
        expect(calculatePayout('player', 50)).toBe(50);
        expect(calculatePayout('player', 500)).toBe(500);
        expect(calculatePayout('player', 1000)).toBe(1000);
      });

      it('should handle decimal amounts', () => {
        expect(calculatePayout('player', 25.5)).toBe(25.5);
      });
    });

    describe('Banker Bets', () => {
      it('should calculate banker payout at 1:0.95 ratio', () => {
        expect(calculatePayout('banker', 100)).toBe(95);
      });

      it('should handle various banker bet amounts', () => {
        expect(calculatePayout('banker', 10)).toBe(9.5);
        expect(calculatePayout('banker', 50)).toBe(47.5);
        expect(calculatePayout('banker', 500)).toBe(475);
        expect(calculatePayout('banker', 1000)).toBe(950);
      });

      it('should apply 5% commission correctly', () => {
        const betAmount = 100;
        const expectedCommission = betAmount * BANKER_COMMISSION_RATE;
        const expectedPayout = betAmount - expectedCommission;
        expect(calculatePayout('banker', betAmount)).toBe(expectedPayout);
      });
    });

    describe('Tie Bets', () => {
      it('should calculate tie payout at 1:8 ratio', () => {
        expect(calculatePayout('tie', 100)).toBe(800);
      });

      it('should handle various tie bet amounts', () => {
        expect(calculatePayout('tie', 10)).toBe(80);
        expect(calculatePayout('tie', 50)).toBe(400);
        expect(calculatePayout('tie', 500)).toBe(4000);
        expect(calculatePayout('tie', 1000)).toBe(8000);
      });
    });

    describe('Edge Cases', () => {
      it('should handle zero bet amount', () => {
        expect(calculatePayout('player', 0)).toBe(0);
        expect(calculatePayout('banker', 0)).toBe(0);
        expect(calculatePayout('tie', 0)).toBe(0);
      });

      it('should handle large bet amounts', () => {
        expect(calculatePayout('player', 10000)).toBe(10000);
        expect(calculatePayout('banker', 10000)).toBe(9500);
        expect(calculatePayout('tie', 10000)).toBe(80000);
      });
    });
  });

  describe('calculateTotalReturn', () => {
    describe('Player Bets', () => {
      it('should return original bet plus payout', () => {
        expect(calculateTotalReturn('player', 100)).toBe(200); // 100 + 100
      });

      it('should calculate total return correctly for various amounts', () => {
        expect(calculateTotalReturn('player', 10)).toBe(20);
        expect(calculateTotalReturn('player', 50)).toBe(100);
        expect(calculateTotalReturn('player', 500)).toBe(1000);
      });
    });

    describe('Banker Bets', () => {
      it('should return original bet plus payout', () => {
        expect(calculateTotalReturn('banker', 100)).toBe(195); // 100 + 95
      });

      it('should calculate total return correctly for various amounts', () => {
        expect(calculateTotalReturn('banker', 10)).toBe(19.5);
        expect(calculateTotalReturn('banker', 50)).toBe(97.5);
        expect(calculateTotalReturn('banker', 1000)).toBe(1950);
      });
    });

    describe('Tie Bets', () => {
      it('should return original bet plus payout', () => {
        expect(calculateTotalReturn('tie', 100)).toBe(900); // 100 + 800
      });

      it('should calculate total return correctly for various amounts', () => {
        expect(calculateTotalReturn('tie', 10)).toBe(90);
        expect(calculateTotalReturn('tie', 50)).toBe(450);
        expect(calculateTotalReturn('tie', 1000)).toBe(9000);
      });
    });
  });

  describe('getPayoutRate', () => {
    it('should return correct rate for player', () => {
      expect(getPayoutRate('player')).toBe(1.0);
    });

    it('should return correct rate for banker', () => {
      expect(getPayoutRate('banker')).toBe(0.95);
    });

    it('should return correct rate for tie', () => {
      expect(getPayoutRate('tie')).toBe(8.0);
    });
  });

  describe('Mathematical Consistency', () => {
    it('should maintain consistent payout calculations', () => {
      const betAmount = 100;

      // Manual calculation vs function
      expect(calculatePayout('player', betAmount)).toBe(betAmount * 1.0);
      expect(calculatePayout('banker', betAmount)).toBe(betAmount * 0.95);
      expect(calculatePayout('tie', betAmount)).toBe(betAmount * 8.0);
    });

    it('should maintain consistent total return calculations', () => {
      const betAmount = 100;

      expect(calculateTotalReturn('player', betAmount)).toBe(
        betAmount + calculatePayout('player', betAmount)
      );
      expect(calculateTotalReturn('banker', betAmount)).toBe(
        betAmount + calculatePayout('banker', betAmount)
      );
      expect(calculateTotalReturn('tie', betAmount)).toBe(
        betAmount + calculatePayout('tie', betAmount)
      );
    });

    it('should have banker commission equal to difference from player rate', () => {
      const expectedCommission = PLAYER_PAYOUT_RATE - BANKER_PAYOUT_RATE;
      expect(BANKER_COMMISSION_RATE).toBeCloseTo(expectedCommission, 10);
    });
  });
});
