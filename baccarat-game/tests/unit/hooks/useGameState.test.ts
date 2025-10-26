import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from '@/hooks/useGameState';

describe('useGameState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize in betting phase', () => {
      const { result } = renderHook(() => useGameState());

      expect(result.current.phase).toBe('betting');
    });

    it('should initialize with empty hands', () => {
      const { result } = renderHook(() => useGameState());

      expect(result.current.playerHand).toEqual({ cards: [], score: 0, isNatural: false });
      expect(result.current.bankerHand).toEqual({ cards: [], score: 0, isNatural: false });
    });

    it('should initialize with no timer', () => {
      const { result } = renderHook(() => useGameState());

      expect(result.current.timer).toBe(0);
    });

    it('should initialize with no last result', () => {
      const { result } = renderHook(() => useGameState());

      expect(result.current.lastResult).toBeNull();
    });

    it('should expose game control functions', () => {
      const { result } = renderHook(() => useGameState());

      expect(typeof result.current.startDealing).toBe('function');
      expect(typeof result.current.completeDealing).toBe('function');
      expect(typeof result.current.startDrawing).toBe('function');
      expect(typeof result.current.completeDrawing).toBe('function');
      expect(typeof result.current.calculateResult).toBe('function');
      expect(typeof result.current.showResult).toBe('function');
      expect(typeof result.current.startNewRound).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('Phase Transitions', () => {
    it('should transition from betting to dealing', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
      });

      expect(result.current.phase).toBe('dealing');
    });

    it('should transition from dealing to drawing', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
      });

      expect(result.current.phase).toBe('drawing');
    });

    it('should transition from drawing to calculating', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.startDrawing();
        result.current.completeDrawing();
      });

      expect(result.current.phase).toBe('calculating');
    });

    it('should transition from calculating to result', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('player', 100);
      });

      expect(result.current.phase).toBe('result');
    });

    it('should transition from result back to betting', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('player', 100);
        result.current.startNewRound();
      });

      expect(result.current.phase).toBe('betting');
    });

    it('should complete full game cycle', () => {
      const { result } = renderHook(() => useGameState());

      // Round 1
      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('banker', 50);
        result.current.startNewRound();
      });

      expect(result.current.phase).toBe('betting');

      // Round 2
      act(() => {
        result.current.startDealing();
      });

      expect(result.current.phase).toBe('dealing');
    });
  });

  describe('Invalid Phase Transitions', () => {
    it('should not allow startDealing when not in betting phase', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.startDealing(); // Invalid: already in dealing
      });

      expect(result.current.phase).toBe('dealing');
    });

    it('should not allow completeDealing when not in dealing phase', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.completeDealing(); // Invalid: in betting phase
      });

      expect(result.current.phase).toBe('betting');
    });

    it('should not allow calculateResult when not in calculating phase', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.calculateResult('player', 100); // Invalid: in betting phase
      });

      expect(result.current.phase).toBe('betting');
      expect(result.current.lastResult).toBeNull();
    });

    it('should not allow startNewRound when not in result phase', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startNewRound(); // Invalid: in betting phase
      });

      expect(result.current.phase).toBe('betting');
    });
  });

  describe('Hand Management', () => {
    it('should update player hand during dealing', () => {
      const { result } = renderHook(() => useGameState());

      const playerCards = [
        { suit: 'hearts' as const, rank: 'K' as const },
        { suit: 'diamonds' as const, rank: '5' as const },
      ];

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand(playerCards);
      });

      expect(result.current.playerHand.cards).toEqual(playerCards);
      expect(result.current.playerHand.score).toBe(5);
      expect(result.current.playerHand.isNatural).toBe(false);
    });

    it('should update banker hand during dealing', () => {
      const { result } = renderHook(() => useGameState());

      const bankerCards = [
        { suit: 'clubs' as const, rank: '7' as const },
        { suit: 'spades' as const, rank: '3' as const },
      ];

      act(() => {
        result.current.startDealing();
        result.current.setBankerHand(bankerCards);
      });

      expect(result.current.bankerHand.cards).toEqual(bankerCards);
      expect(result.current.bankerHand.score).toBe(0);
      expect(result.current.bankerHand.isNatural).toBe(false);
    });

    it('should calculate score correctly (sum mod 10)', () => {
      const { result } = renderHook(() => useGameState());

      const cards = [
        { suit: 'hearts' as const, rank: '9' as const },
        { suit: 'diamonds' as const, rank: '8' as const },
      ];

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand(cards);
      });

      expect(result.current.playerHand.score).toBe(7); // (9 + 8) % 10 = 7
    });

    it('should detect natural 8', () => {
      const { result } = renderHook(() => useGameState());

      const cards = [
        { suit: 'hearts' as const, rank: '5' as const },
        { suit: 'diamonds' as const, rank: '3' as const },
      ];

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand(cards);
      });

      expect(result.current.playerHand.score).toBe(8);
      expect(result.current.playerHand.isNatural).toBe(true);
    });

    it('should detect natural 9', () => {
      const { result } = renderHook(() => useGameState());

      const cards = [
        { suit: 'hearts' as const, rank: '6' as const },
        { suit: 'diamonds' as const, rank: '3' as const },
      ];

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand(cards);
      });

      expect(result.current.playerHand.score).toBe(9);
      expect(result.current.playerHand.isNatural).toBe(true);
    });

    it('should not mark as natural with 3 cards', () => {
      const { result } = renderHook(() => useGameState());

      const cards = [
        { suit: 'hearts' as const, rank: '5' as const },
        { suit: 'diamonds' as const, rank: '2' as const },
        { suit: 'clubs' as const, rank: 'A' as const },
      ];

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand(cards);
      });

      expect(result.current.playerHand.score).toBe(8);
      expect(result.current.playerHand.isNatural).toBe(false);
    });

    it('should handle card values correctly (face cards = 0)', () => {
      const { result } = renderHook(() => useGameState());

      const cards = [
        { suit: 'hearts' as const, rank: 'K' as const },
        { suit: 'diamonds' as const, rank: 'Q' as const },
        { suit: 'clubs' as const, rank: 'J' as const },
      ];

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand(cards);
      });

      expect(result.current.playerHand.score).toBe(0);
    });

    it('should handle Ace as 1', () => {
      const { result } = renderHook(() => useGameState());

      const cards = [
        { suit: 'hearts' as const, rank: 'A' as const },
        { suit: 'diamonds' as const, rank: 'A' as const },
      ];

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand(cards);
      });

      expect(result.current.playerHand.score).toBe(2);
    });
  });

  describe('Timer Management', () => {
    it('should set timer during betting phase', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setTimer(30);
      });

      expect(result.current.timer).toBe(30);
    });

    it('should decrement timer', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setTimer(10);
        result.current.decrementTimer();
      });

      expect(result.current.timer).toBe(9);
    });

    it('should not decrement timer below 0', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setTimer(0);
        result.current.decrementTimer();
      });

      expect(result.current.timer).toBe(0);
    });

    it('should reset timer to 0 on new round', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.setTimer(30);
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('player', 100);
        result.current.startNewRound();
      });

      expect(result.current.timer).toBe(0);
    });
  });

  describe('Result Management', () => {
    it('should store last result after calculating', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand([
          { suit: 'hearts' as const, rank: '7' as const },
          { suit: 'diamonds' as const, rank: '2' as const },
        ]);
        result.current.setBankerHand([
          { suit: 'clubs' as const, rank: '5' as const },
          { suit: 'spades' as const, rank: '3' as const },
        ]);
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('player', 150);
      });

      expect(result.current.lastResult).not.toBeNull();
      expect(result.current.lastResult?.outcome).toBe('player');
      expect(result.current.lastResult?.payout).toBe(150);
      expect(result.current.lastResult?.playerHand.score).toBe(9);
      expect(result.current.lastResult?.bankerHand.score).toBe(8);
    });

    it('should generate unique ID for each result', () => {
      const { result } = renderHook(() => useGameState());

      let firstId: string;

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('banker', 50);
        firstId = result.current.lastResult?.id || '';
        result.current.startNewRound();
      });

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('tie', 0);
      });

      expect(result.current.lastResult?.id).not.toBe(firstId);
    });

    it('should include timestamp in result', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('player', 100);
      });

      expect(result.current.lastResult?.timestamp).toBeDefined();
      expect(typeof result.current.lastResult?.timestamp).toBe('string');
      expect(new Date(result.current.lastResult!.timestamp).getTime()).toBeLessThanOrEqual(
        Date.now()
      );
    });

    it('should store bets in result', () => {
      const { result } = renderHook(() => useGameState());

      const bets = { player: 100, banker: 50, tie: 25 };

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('player', 150, bets);
      });

      expect(result.current.lastResult?.bets).toEqual(bets);
    });

    it('should preserve last result across new rounds', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('banker', 75);
        result.current.startNewRound();
      });

      expect(result.current.lastResult?.outcome).toBe('banker');
      expect(result.current.lastResult?.payout).toBe(75);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand([
          { suit: 'hearts' as const, rank: '5' as const },
          { suit: 'diamonds' as const, rank: '3' as const },
        ]);
        result.current.setTimer(20);
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('player', 100);
        result.current.reset();
      });

      expect(result.current.phase).toBe('betting');
      expect(result.current.playerHand).toEqual({ cards: [], score: 0, isNatural: false });
      expect(result.current.bankerHand).toEqual({ cards: [], score: 0, isNatural: false });
      expect(result.current.timer).toBe(0);
      expect(result.current.lastResult).toBeNull();
    });

    it('should allow new game after reset', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.reset();
        result.current.startDealing();
      });

      expect(result.current.phase).toBe('dealing');
    });
  });

  describe('Edge Cases', () => {
    it('should handle setting hands with empty arrays', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand([]);
      });

      expect(result.current.playerHand).toEqual({ cards: [], score: 0, isNatural: false });
    });

    it('should handle multiple rapid phase transitions', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.startDrawing();
        result.current.completeDrawing();
        result.current.calculateResult('tie', 0);
        result.current.showResult();
        result.current.startNewRound();
      });

      expect(result.current.phase).toBe('betting');
    });

    it('should handle calculating result with zero payout', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('banker', 0);
      });

      expect(result.current.lastResult?.payout).toBe(0);
    });

    it('should handle negative payout (losses)', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('banker', -100);
      });

      expect(result.current.lastResult?.payout).toBe(-100);
    });

    it('should handle skipping drawing phase (naturals)', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand([
          { suit: 'hearts' as const, rank: '6' as const },
          { suit: 'diamonds' as const, rank: '3' as const },
        ]);
        result.current.completeDealing();
        result.current.completeDrawing(); // Skip drawing
        result.current.calculateResult('player', 200);
      });

      expect(result.current.lastResult?.outcome).toBe('player');
      expect(result.current.playerHand.isNatural).toBe(true);
    });
  });

  describe('State Consistency', () => {
    it('should maintain phase consistency throughout game cycle', () => {
      const { result } = renderHook(() => useGameState());

      const phases: string[] = [];

      phases.push(result.current.phase);

      act(() => {
        result.current.startDealing();
      });
      phases.push(result.current.phase);

      act(() => {
        result.current.completeDealing();
      });
      phases.push(result.current.phase);

      act(() => {
        result.current.completeDrawing();
      });
      phases.push(result.current.phase);

      act(() => {
        result.current.calculateResult('player', 100);
      });
      phases.push(result.current.phase);

      act(() => {
        result.current.startNewRound();
      });
      phases.push(result.current.phase);

      expect(phases).toEqual(['betting', 'dealing', 'drawing', 'calculating', 'result', 'betting']);
    });

    it('should clear hands when starting new round', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startDealing();
        result.current.setPlayerHand([
          { suit: 'hearts' as const, rank: '5' as const },
          { suit: 'diamonds' as const, rank: '3' as const },
        ]);
        result.current.setBankerHand([
          { suit: 'clubs' as const, rank: 'K' as const },
          { suit: 'spades' as const, rank: '7' as const },
        ]);
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('player', 100);
        result.current.startNewRound();
      });

      expect(result.current.playerHand).toEqual({ cards: [], score: 0, isNatural: false });
      expect(result.current.bankerHand).toEqual({ cards: [], score: 0, isNatural: false });
    });

    it('should not lose last result when starting new round', () => {
      const { result } = renderHook(() => useGameState());

      let savedResult;

      act(() => {
        result.current.startDealing();
        result.current.completeDealing();
        result.current.completeDrawing();
        result.current.calculateResult('banker', 50);
      });

      savedResult = result.current.lastResult;

      act(() => {
        result.current.startNewRound();
      });

      expect(result.current.lastResult).toEqual(savedResult);
    });
  });

  describe('Return Value Consistency', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useGameState());

      const funcs1 = {
        startDealing: result.current.startDealing,
        completeDealing: result.current.completeDealing,
        reset: result.current.reset,
      };

      rerender();

      const funcs2 = {
        startDealing: result.current.startDealing,
        completeDealing: result.current.completeDealing,
        reset: result.current.reset,
      };

      expect(funcs1.startDealing).toBe(funcs2.startDealing);
      expect(funcs1.completeDealing).toBe(funcs2.completeDealing);
      expect(funcs1.reset).toBe(funcs2.reset);
    });
  });
});
