import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBalance } from '@/hooks/useBalance';
import { STORAGE_KEYS } from '@/services/storageService';

describe('useBalance', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default balance', () => {
      const { result } = renderHook(() => useBalance());
      expect(result.current.balance).toBe(1000);
    });

    it('should initialize with custom balance', () => {
      const { result } = renderHook(() => useBalance(5000));
      expect(result.current.balance).toBe(5000);
    });

    it('should load balance from localStorage if exists', () => {
      localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(2500));
      const { result } = renderHook(() => useBalance());
      expect(result.current.balance).toBe(2500);
    });

    it('should initialize with zero balance', () => {
      const { result } = renderHook(() => useBalance(0));
      expect(result.current.balance).toBe(0);
    });
  });

  describe('Debit (Deduct)', () => {
    it('should deduct amount from balance', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(100);
      });

      expect(result.current.balance).toBe(900);
    });

    it('should deduct multiple times', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(100);
        result.current.debit(200);
        result.current.debit(150);
      });

      expect(result.current.balance).toBe(550);
    });

    it('should not allow balance to go negative', () => {
      const { result } = renderHook(() => useBalance(100));

      act(() => {
        result.current.debit(150);
      });

      expect(result.current.balance).toBe(100);
    });

    it('should return true when debit succeeds', () => {
      const { result } = renderHook(() => useBalance(1000));

      let success: boolean = false;
      act(() => {
        success = result.current.debit(100);
      });

      expect(success).toBe(true);
    });

    it('should return false when debit fails', () => {
      const { result } = renderHook(() => useBalance(100));

      let success: boolean = true;
      act(() => {
        success = result.current.debit(150);
      });

      expect(success).toBe(false);
    });

    it('should deduct exact balance amount', () => {
      const { result } = renderHook(() => useBalance(100));

      act(() => {
        result.current.debit(100);
      });

      expect(result.current.balance).toBe(0);
    });

    it('should handle zero debit', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(0);
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should persist balance after debit', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(100);
      });

      expect(localStorage.getItem(STORAGE_KEYS.BALANCE)).toBe(JSON.stringify(900));
    });
  });

  describe('Credit (Add)', () => {
    it('should add amount to balance', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.credit(500);
      });

      expect(result.current.balance).toBe(1500);
    });

    it('should add multiple times', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.credit(100);
        result.current.credit(200);
        result.current.credit(300);
      });

      expect(result.current.balance).toBe(1600);
    });

    it('should handle zero credit', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.credit(0);
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should add to zero balance', () => {
      const { result } = renderHook(() => useBalance(0));

      act(() => {
        result.current.credit(1000);
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should persist balance after credit', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.credit(500);
      });

      expect(localStorage.getItem(STORAGE_KEYS.BALANCE)).toBe(JSON.stringify(1500));
    });

    it('should handle large amounts', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.credit(10000);
      });

      expect(result.current.balance).toBe(11000);
    });
  });

  describe('Reset', () => {
    it('should reset to default balance', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(500);
        result.current.reset();
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should reset to custom initial balance', () => {
      const { result } = renderHook(() => useBalance(5000));

      act(() => {
        result.current.debit(2000);
        result.current.reset();
      });

      expect(result.current.balance).toBe(5000);
    });

    it('should reset from zero balance', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(1000);
        result.current.reset();
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should reset from high balance', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.credit(5000);
        result.current.reset();
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should persist reset balance', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(500);
        result.current.reset();
      });

      expect(localStorage.getItem(STORAGE_KEYS.BALANCE)).toBe(JSON.stringify(1000));
    });
  });

  describe('Set Balance', () => {
    it('should set balance to specific amount', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.setBalance(2500);
      });

      expect(result.current.balance).toBe(2500);
    });

    it('should set balance to zero', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.setBalance(0);
      });

      expect(result.current.balance).toBe(0);
    });

    it('should not allow negative balance via setBalance', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.setBalance(-500);
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should persist set balance', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.setBalance(3000);
      });

      expect(localStorage.getItem(STORAGE_KEYS.BALANCE)).toBe(JSON.stringify(3000));
    });
  });

  describe('Can Afford', () => {
    it('should return true when balance is sufficient', () => {
      const { result } = renderHook(() => useBalance(1000));
      expect(result.current.canAfford(500)).toBe(true);
    });

    it('should return false when balance is insufficient', () => {
      const { result } = renderHook(() => useBalance(100));
      expect(result.current.canAfford(500)).toBe(false);
    });

    it('should return true when amount equals balance', () => {
      const { result } = renderHook(() => useBalance(1000));
      expect(result.current.canAfford(1000)).toBe(true);
    });

    it('should return true for zero amount', () => {
      const { result } = renderHook(() => useBalance(0));
      expect(result.current.canAfford(0)).toBe(true);
    });

    it('should return false for negative amount', () => {
      const { result } = renderHook(() => useBalance(1000));
      expect(result.current.canAfford(-100)).toBe(false);
    });
  });

  describe('Game Flow Integration', () => {
    it('should handle bet placement workflow', () => {
      const { result } = renderHook(() => useBalance(1000));

      // Place bet
      act(() => {
        const canBet = result.current.canAfford(100);
        expect(canBet).toBe(true);
        result.current.debit(100);
      });

      expect(result.current.balance).toBe(900);
    });

    it('should handle win payout workflow', () => {
      const { result } = renderHook(() => useBalance(1000));

      // Place bet
      act(() => {
        result.current.debit(100);
      });

      // Win and receive payout (bet + winnings)
      act(() => {
        result.current.credit(200);
      });

      expect(result.current.balance).toBe(1100);
    });

    it('should handle loss workflow', () => {
      const { result } = renderHook(() => useBalance(1000));

      // Place bet and lose (balance already deducted)
      act(() => {
        result.current.debit(100);
      });

      expect(result.current.balance).toBe(900);
    });

    it('should prevent betting when insufficient balance', () => {
      const { result } = renderHook(() => useBalance(50));

      act(() => {
        const canBet = result.current.canAfford(100);
        expect(canBet).toBe(false);

        if (canBet) {
          result.current.debit(100);
        }
      });

      expect(result.current.balance).toBe(50);
    });

    it('should handle multiple rounds', () => {
      const { result } = renderHook(() => useBalance(1000));

      // Round 1: Bet 100, lose
      act(() => {
        result.current.debit(100);
      });
      expect(result.current.balance).toBe(900);

      // Round 2: Bet 50, win 100
      act(() => {
        result.current.debit(50);
        result.current.credit(100);
      });
      expect(result.current.balance).toBe(950);

      // Round 3: Bet 200, lose
      act(() => {
        result.current.debit(200);
      });
      expect(result.current.balance).toBe(750);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large balances', () => {
      const { result } = renderHook(() => useBalance(1000000));
      expect(result.current.balance).toBe(1000000);
    });

    it('should handle rapid consecutive operations', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.debit(10);
          result.current.credit(5);
        }
      });

      expect(result.current.balance).toBe(950);
    });

    it('should handle floating point amounts', () => {
      const { result } = renderHook(() => useBalance(100.5));

      act(() => {
        result.current.debit(25.25);
      });

      expect(result.current.balance).toBeCloseTo(75.25, 2);
    });

    it('should maintain balance precision', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(33.33);
        result.current.debit(33.33);
        result.current.debit(33.34);
      });

      expect(result.current.balance).toBe(900);
    });
  });

  describe('Persistence', () => {
    it('should persist balance across hook instances', () => {
      const { result: result1 } = renderHook(() => useBalance(1000));

      act(() => {
        result1.current.debit(300);
      });

      const { result: result2 } = renderHook(() => useBalance(1000));
      expect(result2.current.balance).toBe(700);
    });

    it('should sync with localStorage', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.credit(500);
      });

      const storedBalance = JSON.parse(localStorage.getItem(STORAGE_KEYS.BALANCE) || '0');
      expect(storedBalance).toBe(1500);
    });
  });

  describe('Invalid Operations', () => {
    it('should reject negative debit amounts', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(-100);
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should reject negative credit amounts', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.credit(-100);
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should handle NaN amounts in debit', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(NaN);
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should handle NaN amounts in credit', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.credit(NaN);
      });

      expect(result.current.balance).toBe(1000);
    });

    it('should handle Infinity amounts', () => {
      const { result } = renderHook(() => useBalance(1000));

      act(() => {
        result.current.debit(Infinity);
      });

      expect(result.current.balance).toBe(1000);
    });
  });

  describe('Return Values', () => {
    it('should expose balance value', () => {
      const { result } = renderHook(() => useBalance(1000));
      expect(typeof result.current.balance).toBe('number');
    });

    it('should expose debit function', () => {
      const { result } = renderHook(() => useBalance(1000));
      expect(typeof result.current.debit).toBe('function');
    });

    it('should expose credit function', () => {
      const { result } = renderHook(() => useBalance(1000));
      expect(typeof result.current.credit).toBe('function');
    });

    it('should expose reset function', () => {
      const { result } = renderHook(() => useBalance(1000));
      expect(typeof result.current.reset).toBe('function');
    });

    it('should expose setBalance function', () => {
      const { result } = renderHook(() => useBalance(1000));
      expect(typeof result.current.setBalance).toBe('function');
    });

    it('should expose canAfford function', () => {
      const { result } = renderHook(() => useBalance(1000));
      expect(typeof result.current.canAfford).toBe('function');
    });
  });
});
