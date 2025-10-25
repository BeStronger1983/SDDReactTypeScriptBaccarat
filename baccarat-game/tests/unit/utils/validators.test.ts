import { describe, it, expect } from 'vitest';
import { validateBetAmount, validateBalance, validateChipValue } from '@utils/validators';
import { CHIP_VALUES, INITIAL_BALANCE } from '@/types/game';

describe('validators', () => {
  describe('validateBetAmount', () => {
    describe('Valid Bet Amounts', () => {
      it('should return true for positive bet amount', () => {
        expect(validateBetAmount(100)).toBe(true);
      });

      it('should return true for minimum bet (10)', () => {
        expect(validateBetAmount(10)).toBe(true);
      });

      it('should return true for maximum single chip (1000)', () => {
        expect(validateBetAmount(1000)).toBe(true);
      });

      it('should return true for large bet amount', () => {
        expect(validateBetAmount(10000)).toBe(true);
      });

      it('should return true for valid chip values', () => {
        CHIP_VALUES.forEach((chipValue) => {
          expect(validateBetAmount(chipValue)).toBe(true);
        });
      });

      it('should return true for multiples of chip values', () => {
        expect(validateBetAmount(20)).toBe(true); // 10 * 2
        expect(validateBetAmount(150)).toBe(true); // 50 * 3
        expect(validateBetAmount(500)).toBe(true); // 100 * 5
      });
    });

    describe('Invalid Bet Amounts', () => {
      it('should return false for zero bet', () => {
        expect(validateBetAmount(0)).toBe(false);
      });

      it('should return false for negative bet', () => {
        expect(validateBetAmount(-100)).toBe(false);
      });

      it('should return false for negative small amount', () => {
        expect(validateBetAmount(-1)).toBe(false);
      });

      it('should return false for very large negative amount', () => {
        expect(validateBetAmount(-999999)).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should return false for NaN', () => {
        expect(validateBetAmount(NaN)).toBe(false);
      });

      it('should return false for Infinity', () => {
        expect(validateBetAmount(Infinity)).toBe(false);
      });

      it('should return false for negative Infinity', () => {
        expect(validateBetAmount(-Infinity)).toBe(false);
      });

      it('should return true for decimal amounts (if allowed)', () => {
        // Depending on game rules, you might want to disallow decimals
        expect(validateBetAmount(10.5)).toBe(true);
      });

      it('should return true for very small positive amount', () => {
        expect(validateBetAmount(0.01)).toBe(true);
      });
    });

    describe('Type Coercion', () => {
      it('should handle number type correctly', () => {
        const amount: number = 100;
        expect(validateBetAmount(amount)).toBe(true);
      });
    });
  });

  describe('validateBalance', () => {
    describe('Valid Balance Checks', () => {
      it('should return true when balance is sufficient for bet', () => {
        expect(validateBalance(1000, 100)).toBe(true);
      });

      it('should return true when balance equals bet amount', () => {
        expect(validateBalance(100, 100)).toBe(true);
      });

      it('should return true when balance is much greater than bet', () => {
        expect(validateBalance(10000, 10)).toBe(true);
      });

      it('should return true for initial balance and minimum bet', () => {
        expect(validateBalance(INITIAL_BALANCE, 10)).toBe(true);
      });

      it('should return true for maximum single bet with sufficient balance', () => {
        expect(validateBalance(10000, 1000)).toBe(true);
      });
    });

    describe('Invalid Balance Checks', () => {
      it('should return false when balance is less than bet amount', () => {
        expect(validateBalance(50, 100)).toBe(false);
      });

      it('should return false when balance is zero and bet is positive', () => {
        expect(validateBalance(0, 100)).toBe(false);
      });

      it('should return false when balance is insufficient by 1', () => {
        expect(validateBalance(99, 100)).toBe(false);
      });

      it('should return false for negative balance', () => {
        expect(validateBalance(-100, 50)).toBe(false);
      });

      it('should return false when both balance and bet are zero', () => {
        expect(validateBalance(0, 0)).toBe(false);
      });
    });

    describe('Multiple Bets Scenario', () => {
      it('should validate balance for multiple sequential bets', () => {
        let balance = 1000;
        const bet1 = 100;
        const bet2 = 200;
        const bet3 = 300;

        expect(validateBalance(balance, bet1)).toBe(true);
        balance -= bet1;

        expect(validateBalance(balance, bet2)).toBe(true);
        balance -= bet2;

        expect(validateBalance(balance, bet3)).toBe(true);
        balance -= bet3;

        expect(balance).toBe(400);
      });

      it('should reject bet when accumulated bets exceed balance', () => {
        const balance = 500;
        const bet1 = 300;
        const bet2 = 300;

        expect(validateBalance(balance, bet1)).toBe(true);
        const remainingBalance = balance - bet1;
        expect(validateBalance(remainingBalance, bet2)).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should return false when balance is NaN', () => {
        expect(validateBalance(NaN, 100)).toBe(false);
      });

      it('should return false when bet amount is NaN', () => {
        expect(validateBalance(1000, NaN)).toBe(false);
      });

      it('should return false when both are NaN', () => {
        expect(validateBalance(NaN, NaN)).toBe(false);
      });

      it('should return false when balance is Infinity', () => {
        expect(validateBalance(Infinity, 100)).toBe(false);
      });

      it('should return false when bet is Infinity', () => {
        expect(validateBalance(1000, Infinity)).toBe(false);
      });

      it('should return false when bet is negative', () => {
        expect(validateBalance(1000, -100)).toBe(false);
      });

      it('should handle decimal amounts', () => {
        expect(validateBalance(100.5, 50.25)).toBe(true);
        expect(validateBalance(100.5, 100.51)).toBe(false);
      });
    });

    describe('Real Game Scenarios', () => {
      it('should validate player betting initial balance', () => {
        expect(validateBalance(INITIAL_BALANCE, 100)).toBe(true);
      });

      it('should reject bet when player has lost most balance', () => {
        expect(validateBalance(50, 100)).toBe(false);
      });

      it('should allow all-in bet', () => {
        expect(validateBalance(500, 500)).toBe(true);
      });

      it('should validate multi-area betting scenario', () => {
        const balance = 1000;
        const playerBet = 100;
        const bankerBet = 50;
        const tieBet = 20;
        const totalBet = playerBet + bankerBet + tieBet;

        expect(validateBalance(balance, totalBet)).toBe(true);
      });

      it('should reject multi-area betting when total exceeds balance', () => {
        const balance = 150;
        const totalBet = 170; // 100 + 50 + 20 from spec

        expect(validateBalance(balance, totalBet)).toBe(false);
      });
    });

    describe('Combined Validation', () => {
      it('should validate both bet amount and balance together', () => {
        const balance = 1000;
        const bet = 100;

        expect(validateBetAmount(bet)).toBe(true);
        expect(validateBalance(balance, bet)).toBe(true);
      });

      it('should reject invalid bet amount even with sufficient balance', () => {
        const balance = 1000;
        const bet = -100;

        expect(validateBetAmount(bet)).toBe(false);
        expect(validateBalance(balance, bet)).toBe(false);
      });

      it('should reject valid bet amount with insufficient balance', () => {
        const balance = 50;
        const bet = 100;

        expect(validateBetAmount(bet)).toBe(true);
        expect(validateBalance(balance, bet)).toBe(false);
      });
    });
  });

  describe('validateChipValue', () => {
    describe('Valid Chip Values', () => {
      it('should return true for chip value 10', () => {
        expect(validateChipValue(10)).toBe(true);
      });

      it('should return true for chip value 50', () => {
        expect(validateChipValue(50)).toBe(true);
      });

      it('should return true for chip value 100', () => {
        expect(validateChipValue(100)).toBe(true);
      });

      it('should return true for chip value 500', () => {
        expect(validateChipValue(500)).toBe(true);
      });

      it('should return true for chip value 1000', () => {
        expect(validateChipValue(1000)).toBe(true);
      });

      it('should validate all CHIP_VALUES constants', () => {
        CHIP_VALUES.forEach((chipValue) => {
          expect(validateChipValue(chipValue)).toBe(true);
        });
      });
    });

    describe('Invalid Chip Values', () => {
      it('should return false for chip value 1', () => {
        expect(validateChipValue(1)).toBe(false);
      });

      it('should return false for chip value 5', () => {
        expect(validateChipValue(5)).toBe(false);
      });

      it('should return false for chip value 20', () => {
        expect(validateChipValue(20)).toBe(false);
      });

      it('should return false for chip value 25', () => {
        expect(validateChipValue(25)).toBe(false);
      });

      it('should return false for chip value 200', () => {
        expect(validateChipValue(200)).toBe(false);
      });

      it('should return false for chip value 2000', () => {
        expect(validateChipValue(2000)).toBe(false);
      });

      it('should return false for zero', () => {
        expect(validateChipValue(0)).toBe(false);
      });

      it('should return false for negative values', () => {
        expect(validateChipValue(-10)).toBe(false);
        expect(validateChipValue(-100)).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should return false for NaN', () => {
        expect(validateChipValue(NaN)).toBe(false);
      });

      it('should return false for Infinity', () => {
        expect(validateChipValue(Infinity)).toBe(false);
      });

      it('should return false for decimal values', () => {
        expect(validateChipValue(10.5)).toBe(false);
        expect(validateChipValue(50.1)).toBe(false);
      });
    });

    describe('Type Safety', () => {
      it('should work with ChipValue type', () => {
        const chip: (typeof CHIP_VALUES)[number] = 100;
        expect(validateChipValue(chip)).toBe(true);
      });

      it('should validate entire CHIP_VALUES array', () => {
        const allValid = CHIP_VALUES.every((value) => validateChipValue(value));
        expect(allValid).toBe(true);
      });
    });
  });

  describe('Integration: All Validators Together', () => {
    it('should validate complete betting flow', () => {
      const balance = 1000;
      const chipValue = 100;
      const betAmount = 100;

      expect(validateChipValue(chipValue)).toBe(true);
      expect(validateBetAmount(betAmount)).toBe(true);
      expect(validateBalance(balance, betAmount)).toBe(true);
    });

    it('should reject invalid chip selection', () => {
      const balance = 1000;
      const chipValue = 75; // Invalid chip
      const betAmount = 75;

      expect(validateChipValue(chipValue)).toBe(false);
      // Even though balance is sufficient, chip value is invalid
    });

    it('should handle multi-chip bet scenario', () => {
      const balance = 1000;
      const selectedChips = [100, 50, 10]; // Multiple valid chips
      const totalBet = selectedChips.reduce((sum, chip) => sum + chip, 0);

      selectedChips.forEach((chip) => {
        expect(validateChipValue(chip)).toBe(true);
      });

      expect(validateBetAmount(totalBet)).toBe(true);
      expect(validateBalance(balance, totalBet)).toBe(true);
    });

    it('should validate player with low balance can only bet small amounts', () => {
      const balance = 60;
      const chip10 = 10;
      const chip100 = 100;

      expect(validateChipValue(chip10)).toBe(true);
      expect(validateBalance(balance, chip10)).toBe(true);

      expect(validateChipValue(chip100)).toBe(true);
      expect(validateBalance(balance, chip100)).toBe(false);
    });

    it('should validate scenario from spec: balance 1000, bets 100+50+20', () => {
      const balance = 1000;
      const playerBet = 100;
      const bankerBet = 50;
      const tieBet = 20;

      expect(validateBetAmount(playerBet)).toBe(true);
      expect(validateBetAmount(bankerBet)).toBe(true);
      expect(validateBetAmount(tieBet)).toBe(true);

      const totalBet = playerBet + bankerBet + tieBet;
      expect(validateBalance(balance, totalBet)).toBe(true);
    });
  });
});
