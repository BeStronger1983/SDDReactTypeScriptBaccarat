import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBetting } from '@/hooks/useBetting';

describe('useBetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with zero bets', () => {
      const { result } = renderHook(() => useBetting());

      expect(result.current.bets).toEqual({
        player: 0,
        banker: 0,
        tie: 0,
      });
    });

    it('should initialize with zero total bet amount', () => {
      const { result } = renderHook(() => useBetting());

      expect(result.current.totalBet).toBe(0);
    });

    it('should return betting functions', () => {
      const { result } = renderHook(() => useBetting());

      expect(typeof result.current.placeBet).toBe('function');
      expect(typeof result.current.clearBets).toBe('function');
      expect(typeof result.current.clearBet).toBe('function');
      expect(typeof result.current.hasBets).toBe('function');
    });
  });

  describe('Place Bet - Single Area', () => {
    it('should place bet on player area', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
      });

      expect(result.current.bets.player).toBe(100);
      expect(result.current.bets.banker).toBe(0);
      expect(result.current.bets.tie).toBe(0);
      expect(result.current.totalBet).toBe(100);
    });

    it('should place bet on banker area', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('banker', 50);
      });

      expect(result.current.bets.player).toBe(0);
      expect(result.current.bets.banker).toBe(50);
      expect(result.current.bets.tie).toBe(0);
      expect(result.current.totalBet).toBe(50);
    });

    it('should place bet on tie area', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('tie', 25);
      });

      expect(result.current.bets.player).toBe(0);
      expect(result.current.bets.banker).toBe(0);
      expect(result.current.bets.tie).toBe(25);
      expect(result.current.totalBet).toBe(25);
    });

    it('should accumulate bets on same area', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('player', 50);
        result.current.placeBet('player', 25);
      });

      expect(result.current.bets.player).toBe(175);
      expect(result.current.totalBet).toBe(175);
    });

    it('should handle rapid consecutive bets', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.placeBet('player', 10);
        }
      });

      expect(result.current.bets.player).toBe(100);
      expect(result.current.totalBet).toBe(100);
    });
  });

  describe('Place Bet - Multiple Areas', () => {
    it('should place bets on multiple areas', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('banker', 50);
        result.current.placeBet('tie', 25);
      });

      expect(result.current.bets.player).toBe(100);
      expect(result.current.bets.banker).toBe(50);
      expect(result.current.bets.tie).toBe(25);
      expect(result.current.totalBet).toBe(175);
    });

    it('should calculate total bet correctly with multiple areas', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 500);
        result.current.placeBet('banker', 300);
      });

      expect(result.current.totalBet).toBe(800);
    });

    it('should handle mixed bets and accumulations', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('banker', 50);
        result.current.placeBet('player', 50);
        result.current.placeBet('tie', 25);
        result.current.placeBet('banker', 25);
      });

      expect(result.current.bets.player).toBe(150);
      expect(result.current.bets.banker).toBe(75);
      expect(result.current.bets.tie).toBe(25);
      expect(result.current.totalBet).toBe(250);
    });
  });

  describe('Clear Bets', () => {
    it('should clear all bets', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('banker', 50);
        result.current.placeBet('tie', 25);
      });

      expect(result.current.totalBet).toBe(175);

      act(() => {
        result.current.clearBets();
      });

      expect(result.current.bets.player).toBe(0);
      expect(result.current.bets.banker).toBe(0);
      expect(result.current.bets.tie).toBe(0);
      expect(result.current.totalBet).toBe(0);
    });

    it('should clear specific area bet - player', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('banker', 50);
        result.current.placeBet('tie', 25);
      });

      act(() => {
        result.current.clearBet('player');
      });

      expect(result.current.bets.player).toBe(0);
      expect(result.current.bets.banker).toBe(50);
      expect(result.current.bets.tie).toBe(25);
      expect(result.current.totalBet).toBe(75);
    });

    it('should clear specific area bet - banker', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('banker', 50);
        result.current.placeBet('tie', 25);
      });

      act(() => {
        result.current.clearBet('banker');
      });

      expect(result.current.bets.player).toBe(100);
      expect(result.current.bets.banker).toBe(0);
      expect(result.current.bets.tie).toBe(25);
      expect(result.current.totalBet).toBe(125);
    });

    it('should clear specific area bet - tie', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('banker', 50);
        result.current.placeBet('tie', 25);
      });

      act(() => {
        result.current.clearBet('tie');
      });

      expect(result.current.bets.player).toBe(100);
      expect(result.current.bets.banker).toBe(50);
      expect(result.current.bets.tie).toBe(0);
      expect(result.current.totalBet).toBe(150);
    });

    it('should handle clearing already empty bets', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.clearBets();
      });

      expect(result.current.totalBet).toBe(0);
    });

    it('should handle clearing non-existent bet', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.clearBet('banker');
      });

      expect(result.current.bets.player).toBe(100);
      expect(result.current.bets.banker).toBe(0);
      expect(result.current.totalBet).toBe(100);
    });
  });

  describe('Has Bets', () => {
    it('should return false when no bets placed', () => {
      const { result } = renderHook(() => useBetting());

      expect(result.current.hasBets()).toBe(false);
    });

    it('should return true when any bet is placed', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
      });

      expect(result.current.hasBets()).toBe(true);
    });

    it('should return false after clearing all bets', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('banker', 50);
      });

      expect(result.current.hasBets()).toBe(true);

      act(() => {
        result.current.clearBets();
      });

      expect(result.current.hasBets()).toBe(false);
    });

    it('should check specific area - player', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
      });

      expect(result.current.hasBets('player')).toBe(true);
      expect(result.current.hasBets('banker')).toBe(false);
      expect(result.current.hasBets('tie')).toBe(false);
    });

    it('should check specific area - banker', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('banker', 50);
      });

      expect(result.current.hasBets('player')).toBe(false);
      expect(result.current.hasBets('banker')).toBe(true);
      expect(result.current.hasBets('tie')).toBe(false);
    });

    it('should check specific area - tie', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('tie', 25);
      });

      expect(result.current.hasBets('player')).toBe(false);
      expect(result.current.hasBets('banker')).toBe(false);
      expect(result.current.hasBets('tie')).toBe(true);
    });

    it('should handle multiple areas check', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('banker', 50);
      });

      expect(result.current.hasBets()).toBe(true);
      expect(result.current.hasBets('player')).toBe(true);
      expect(result.current.hasBets('banker')).toBe(true);
      expect(result.current.hasBets('tie')).toBe(false);
    });
  });

  describe('Balance Integration', () => {
    it('should validate bet amount with balance callback', () => {
      const canAfford = vi.fn((amount: number) => amount <= 1000);
      const { result } = renderHook(() => useBetting());

      act(() => {
        const success = result.current.placeBet('player', 100, canAfford);
        expect(success).toBe(true);
      });

      expect(canAfford).toHaveBeenCalledWith(100);
      expect(result.current.bets.player).toBe(100);
    });

    it('should reject bet when insufficient balance', () => {
      const canAfford = vi.fn((amount: number) => amount <= 50);
      const { result } = renderHook(() => useBetting());

      act(() => {
        const success = result.current.placeBet('player', 100, canAfford);
        expect(success).toBe(false);
      });

      expect(canAfford).toHaveBeenCalledWith(100);
      expect(result.current.bets.player).toBe(0);
      expect(result.current.totalBet).toBe(0);
    });

    it('should validate total bet amount when betting on multiple areas', () => {
      const canAfford = vi.fn((amount: number) => amount <= 1000);
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 500, canAfford);
        result.current.placeBet('banker', 300, canAfford);
      });

      expect(canAfford).toHaveBeenNthCalledWith(1, 500);
      expect(canAfford).toHaveBeenNthCalledWith(2, 300);
      expect(result.current.totalBet).toBe(800);
    });

    it('should handle partial success when balance runs out', () => {
      let balance = 1000;
      const canAfford = vi.fn((amount: number) => {
        if (amount <= balance) {
          balance -= amount;
          return true;
        }
        return false;
      });

      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 600, canAfford);
        result.current.placeBet('banker', 300, canAfford);
        result.current.placeBet('tie', 200, canAfford); // Should fail
      });

      expect(result.current.bets.player).toBe(600);
      expect(result.current.bets.banker).toBe(300);
      expect(result.current.bets.tie).toBe(0);
      expect(result.current.totalBet).toBe(900);
    });

    it('should work without balance validation callback', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        const success = result.current.placeBet('player', 100);
        expect(success).toBe(true);
      });

      expect(result.current.bets.player).toBe(100);
    });

    it('should validate accumulated bets against balance', () => {
      const canAfford = vi.fn((amount: number) => amount <= 1000);
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100, canAfford);
        result.current.placeBet('player', 100, canAfford);
        result.current.placeBet('player', 100, canAfford);
      });

      expect(canAfford).toHaveBeenCalledTimes(3);
      expect(result.current.bets.player).toBe(300);
    });
  });

  describe('Invalid Operations', () => {
    it('should reject negative bet amounts', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        const success = result.current.placeBet('player', -100);
        expect(success).toBe(false);
      });

      expect(result.current.bets.player).toBe(0);
    });

    it('should reject zero bet amounts', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        const success = result.current.placeBet('player', 0);
        expect(success).toBe(false);
      });

      expect(result.current.bets.player).toBe(0);
    });

    it('should reject NaN bet amounts', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        const success = result.current.placeBet('player', NaN);
        expect(success).toBe(false);
      });

      expect(result.current.bets.player).toBe(0);
    });

    it('should reject Infinity bet amounts', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        const success = result.current.placeBet('player', Infinity);
        expect(success).toBe(false);
      });

      expect(result.current.bets.player).toBe(0);
    });

    it('should handle invalid area types', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        // @ts-expect-error - testing invalid area
        const success = result.current.placeBet('invalid', 100);
        expect(success).toBe(false);
      });

      expect(result.current.totalBet).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large bet amounts', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 999999999);
      });

      expect(result.current.bets.player).toBe(999999999);
      expect(result.current.totalBet).toBe(999999999);
    });

    it('should handle floating point bet amounts', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100.5);
      });

      expect(result.current.bets.player).toBe(100.5);
    });

    it('should maintain precision with floating point accumulation', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 33.33);
        result.current.placeBet('player', 33.33);
        result.current.placeBet('player', 33.34);
      });

      expect(result.current.bets.player).toBe(100);
      expect(result.current.totalBet).toBe(100);
    });

    it('should handle clearing and re-betting', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.clearBets();
        result.current.placeBet('banker', 50);
      });

      expect(result.current.bets.player).toBe(0);
      expect(result.current.bets.banker).toBe(50);
      expect(result.current.totalBet).toBe(50);
    });

    it('should handle multiple clear operations', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.clearBets();
        result.current.clearBets();
        result.current.clearBets();
      });

      expect(result.current.totalBet).toBe(0);
    });
  });

  describe('Return Values', () => {
    it('should expose bets object', () => {
      const { result } = renderHook(() => useBetting());

      expect(result.current.bets).toBeDefined();
      expect(result.current.bets).toHaveProperty('player');
      expect(result.current.bets).toHaveProperty('banker');
      expect(result.current.bets).toHaveProperty('tie');
    });

    it('should expose totalBet value', () => {
      const { result } = renderHook(() => useBetting());

      expect(result.current.totalBet).toBeDefined();
      expect(typeof result.current.totalBet).toBe('number');
    });

    it('should expose placeBet function', () => {
      const { result } = renderHook(() => useBetting());

      expect(result.current.placeBet).toBeDefined();
      expect(typeof result.current.placeBet).toBe('function');
    });

    it('should expose clearBets function', () => {
      const { result } = renderHook(() => useBetting());

      expect(result.current.clearBets).toBeDefined();
      expect(typeof result.current.clearBets).toBe('function');
    });

    it('should expose clearBet function', () => {
      const { result } = renderHook(() => useBetting());

      expect(result.current.clearBet).toBeDefined();
      expect(typeof result.current.clearBet).toBe('function');
    });

    it('should expose hasBets function', () => {
      const { result } = renderHook(() => useBetting());

      expect(result.current.hasBets).toBeDefined();
      expect(typeof result.current.hasBets).toBe('function');
    });

    it('should return boolean from placeBet', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        const success = result.current.placeBet('player', 100);
        expect(typeof success).toBe('boolean');
      });
    });

    it('should return boolean from hasBets', () => {
      const { result } = renderHook(() => useBetting());

      const hasAnyBets = result.current.hasBets();
      expect(typeof hasAnyBets).toBe('boolean');

      const hasPlayerBet = result.current.hasBets('player');
      expect(typeof hasPlayerBet).toBe('boolean');
    });
  });

  describe('Game Flow Integration', () => {
    it('should handle complete betting workflow', () => {
      const { result } = renderHook(() => useBetting());

      // Round 1: Bet on player
      act(() => {
        result.current.placeBet('player', 100);
      });
      expect(result.current.totalBet).toBe(100);
      expect(result.current.hasBets()).toBe(true);

      // Clear after round ends
      act(() => {
        result.current.clearBets();
      });
      expect(result.current.hasBets()).toBe(false);

      // Round 2: Bet on multiple areas
      act(() => {
        result.current.placeBet('banker', 50);
        result.current.placeBet('tie', 25);
      });
      expect(result.current.totalBet).toBe(75);
      expect(result.current.hasBets('banker')).toBe(true);
      expect(result.current.hasBets('tie')).toBe(true);
    });

    it('should handle bet modification before confirmation', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('player', 50);
        result.current.clearBet('player');
        result.current.placeBet('banker', 200);
      });

      expect(result.current.bets.player).toBe(0);
      expect(result.current.bets.banker).toBe(200);
      expect(result.current.totalBet).toBe(200);
    });

    it('should support repeat bet pattern', () => {
      const { result } = renderHook(() => useBetting());

      // Round 1
      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('banker', 50);
      });

      const firstBets = { ...result.current.bets };

      // Clear after round
      act(() => {
        result.current.clearBets();
      });

      // Round 2 - repeat same bets
      act(() => {
        result.current.placeBet('player', firstBets.player);
        result.current.placeBet('banker', firstBets.banker);
      });

      expect(result.current.bets.player).toBe(100);
      expect(result.current.bets.banker).toBe(50);
      expect(result.current.totalBet).toBe(150);
    });

    it('should handle undo last bet scenario', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 100);
        result.current.placeBet('banker', 50);
        result.current.placeBet('tie', 25);
      });

      // Undo last bet (tie)
      act(() => {
        result.current.clearBet('tie');
      });

      expect(result.current.bets.player).toBe(100);
      expect(result.current.bets.banker).toBe(50);
      expect(result.current.bets.tie).toBe(0);
      expect(result.current.totalBet).toBe(150);
    });
  });

  describe('Chip Denomination Integration', () => {
    it('should handle standard chip denominations', () => {
      const { result } = renderHook(() => useBetting());

      const chips = [10, 50, 100, 500, 1000];

      act(() => {
        chips.forEach((chip) => {
          result.current.placeBet('player', chip);
        });
      });

      expect(result.current.bets.player).toBe(1660);
    });

    it('should handle multiple clicks of same chip', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        // Player clicks 100 chip 5 times
        for (let i = 0; i < 5; i++) {
          result.current.placeBet('player', 100);
        }
      });

      expect(result.current.bets.player).toBe(500);
    });

    it('should handle mixed chip selections', () => {
      const { result } = renderHook(() => useBetting());

      act(() => {
        result.current.placeBet('player', 500);
        result.current.placeBet('player', 100);
        result.current.placeBet('player', 50);
        result.current.placeBet('player', 10);
      });

      expect(result.current.bets.player).toBe(660);
    });
  });
});
