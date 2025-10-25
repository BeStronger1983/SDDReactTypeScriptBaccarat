import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadBalance,
  saveBalance,
  loadHistory,
  saveHistory,
  clearGameData,
  STORAGE_KEYS,
} from '@/services/storageService';
import type { GameResult } from '@/types/game';

describe('storageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('STORAGE_KEYS', () => {
    it('should have correct storage key constants', () => {
      expect(STORAGE_KEYS.BALANCE).toBe('baccarat_balance');
      expect(STORAGE_KEYS.HISTORY).toBe('baccarat_history');
    });
  });

  describe('saveBalance & loadBalance', () => {
    describe('Save Balance', () => {
      it('should save balance to localStorage', () => {
        saveBalance(5000);
        const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
        expect(saved).toBe('5000');
      });

      it('should save zero balance', () => {
        saveBalance(0);
        const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
        expect(saved).toBe('0');
      });

      it('should save large balance', () => {
        saveBalance(999999);
        const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
        expect(saved).toBe('999999');
      });

      it('should save decimal balance', () => {
        saveBalance(1234.56);
        const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
        expect(saved).toBe('1234.56');
      });

      it('should overwrite existing balance', () => {
        saveBalance(1000);
        saveBalance(2000);
        const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
        expect(saved).toBe('2000');
      });
    });

    describe('Load Balance', () => {
      it('should load saved balance', () => {
        localStorage.setItem(STORAGE_KEYS.BALANCE, '5000');
        const balance = loadBalance();
        expect(balance).toBe(5000);
      });

      it('should load zero balance', () => {
        localStorage.setItem(STORAGE_KEYS.BALANCE, '0');
        const balance = loadBalance();
        expect(balance).toBe(0);
      });

      it('should load decimal balance', () => {
        localStorage.setItem(STORAGE_KEYS.BALANCE, '1234.56');
        const balance = loadBalance();
        expect(balance).toBe(1234.56);
      });

      it('should return null when no balance is saved', () => {
        const balance = loadBalance();
        expect(balance).toBe(null);
      });

      it('should return null for invalid balance data', () => {
        localStorage.setItem(STORAGE_KEYS.BALANCE, 'invalid');
        const balance = loadBalance();
        expect(balance).toBe(null);
      });

      it('should return null for empty string', () => {
        localStorage.setItem(STORAGE_KEYS.BALANCE, '');
        const balance = loadBalance();
        expect(balance).toBe(null);
      });

      it('should handle NaN gracefully', () => {
        localStorage.setItem(STORAGE_KEYS.BALANCE, 'NaN');
        const balance = loadBalance();
        expect(balance).toBe(null);
      });
    });

    describe('Save & Load Integration', () => {
      it('should save and load balance correctly', () => {
        saveBalance(7500);
        const balance = loadBalance();
        expect(balance).toBe(7500);
      });

      it('should handle multiple save and load operations', () => {
        saveBalance(1000);
        expect(loadBalance()).toBe(1000);

        saveBalance(2000);
        expect(loadBalance()).toBe(2000);

        saveBalance(3000);
        expect(loadBalance()).toBe(3000);
      });
    });
  });

  describe('saveHistory & loadHistory', () => {
    const mockGameResult1: GameResult = {
      id: '1',
      timestamp: '2024-01-01T00:00:00.000Z',
      outcome: 'player',
      playerHand: {
        cards: [
          { suit: 'hearts', rank: 'A' },
          { suit: 'diamonds', rank: 'K' },
        ],
        score: 1,
      },
      bankerHand: {
        cards: [
          { suit: 'clubs', rank: '9' },
          { suit: 'spades', rank: '8' },
        ],
        score: 7,
      },
      bets: { player: 100, banker: 0, tie: 0 },
      payout: 100,
    };

    const mockGameResult2: GameResult = {
      id: '2',
      timestamp: '2024-01-01T00:01:00.000Z',
      outcome: 'banker',
      playerHand: {
        cards: [
          { suit: 'hearts', rank: '5' },
          { suit: 'diamonds', rank: '3' },
        ],
        score: 8,
      },
      bankerHand: {
        cards: [
          { suit: 'clubs', rank: '6' },
          { suit: 'spades', rank: '3' },
        ],
        score: 9,
      },
      bets: { player: 0, banker: 50, tie: 0 },
      payout: 47.5,
    };

    describe('Save History', () => {
      it('should save empty history', () => {
        saveHistory([]);
        const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
        expect(saved).toBe('[]');
      });

      it('should save single game result', () => {
        saveHistory([mockGameResult1]);
        const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
        expect(saved).toBeTruthy();
        const parsed = JSON.parse(saved!);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].id).toBe('1');
      });

      it('should save multiple game results', () => {
        saveHistory([mockGameResult1, mockGameResult2]);
        const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
        const parsed = JSON.parse(saved!);
        expect(parsed).toHaveLength(2);
        expect(parsed[0].id).toBe('1');
        expect(parsed[1].id).toBe('2');
      });

      it('should preserve all game result properties', () => {
        saveHistory([mockGameResult1]);
        const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
        const parsed = JSON.parse(saved!);
        const result = parsed[0];

        expect(result.id).toBe('1');
        expect(result.timestamp).toBe('2024-01-01T00:00:00.000Z');
        expect(result.outcome).toBe('player');
        expect(result.playerHand.score).toBe(1);
        expect(result.bankerHand.score).toBe(7);
        expect(result.bets.player).toBe(100);
        expect(result.payout).toBe(100);
      });

      it('should overwrite existing history', () => {
        saveHistory([mockGameResult1]);
        saveHistory([mockGameResult2]);
        const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
        const parsed = JSON.parse(saved!);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].id).toBe('2');
      });
    });

    describe('Load History', () => {
      it('should load empty history', () => {
        localStorage.setItem(STORAGE_KEYS.HISTORY, '[]');
        const history = loadHistory();
        expect(history).toEqual([]);
      });

      it('should load saved history', () => {
        saveHistory([mockGameResult1, mockGameResult2]);
        const history = loadHistory();
        expect(history).toHaveLength(2);
        expect(history[0].id).toBe('1');
        expect(history[1].id).toBe('2');
      });

      it('should return empty array when no history is saved', () => {
        const history = loadHistory();
        expect(history).toEqual([]);
      });

      it('should return empty array for invalid JSON', () => {
        localStorage.setItem(STORAGE_KEYS.HISTORY, 'invalid json');
        const history = loadHistory();
        expect(history).toEqual([]);
      });

      it('should return empty array for non-array JSON', () => {
        localStorage.setItem(STORAGE_KEYS.HISTORY, '{"invalid": "data"}');
        const history = loadHistory();
        expect(history).toEqual([]);
      });

      it('should preserve all properties when loading', () => {
        saveHistory([mockGameResult1]);
        const history = loadHistory();
        const result = history[0];

        expect(result.id).toBe('1');
        expect(result.timestamp).toBe('2024-01-01T00:00:00.000Z');
        expect(result.outcome).toBe('player');
        expect(result.playerHand.cards).toHaveLength(2);
        expect(result.playerHand.score).toBe(1);
        expect(result.bankerHand.cards).toHaveLength(2);
        expect(result.bankerHand.score).toBe(7);
        expect(result.bets).toEqual({ player: 100, banker: 0, tie: 0 });
        expect(result.payout).toBe(100);
      });
    });

    describe('Save & Load Integration', () => {
      it('should save and load history correctly', () => {
        const history = [mockGameResult1, mockGameResult2];
        saveHistory(history);
        const loaded = loadHistory();
        expect(loaded).toEqual(history);
      });

      it('should handle multiple save and load operations', () => {
        saveHistory([mockGameResult1]);
        expect(loadHistory()).toHaveLength(1);

        saveHistory([mockGameResult1, mockGameResult2]);
        expect(loadHistory()).toHaveLength(2);

        saveHistory([]);
        expect(loadHistory()).toHaveLength(0);
      });
    });
  });

  describe('clearGameData', () => {
    it('should clear balance from localStorage', () => {
      saveBalance(5000);
      clearGameData();
      expect(localStorage.getItem(STORAGE_KEYS.BALANCE)).toBe(null);
    });

    it('should clear history from localStorage', () => {
      saveHistory([
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
          outcome: 'player',
          playerHand: {
            cards: [{ suit: 'hearts', rank: 'A' }],
            score: 1,
          },
          bankerHand: {
            cards: [{ suit: 'clubs', rank: 'K' }],
            score: 0,
          },
          bets: { player: 100, banker: 0, tie: 0 },
          payout: 100,
        },
      ]);
      clearGameData();
      expect(localStorage.getItem(STORAGE_KEYS.HISTORY)).toBe(null);
    });

    it('should clear both balance and history', () => {
      saveBalance(5000);
      saveHistory([
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
          outcome: 'player',
          playerHand: {
            cards: [{ suit: 'hearts', rank: 'A' }],
            score: 1,
          },
          bankerHand: {
            cards: [{ suit: 'clubs', rank: 'K' }],
            score: 0,
          },
          bets: { player: 100, banker: 0, tie: 0 },
          payout: 100,
        },
      ]);

      clearGameData();

      expect(loadBalance()).toBe(null);
      expect(loadHistory()).toEqual([]);
    });

    it('should not throw error when clearing empty storage', () => {
      expect(() => clearGameData()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage quota exceeded for balance', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveBalance(5000)).not.toThrow();

      setItemSpy.mockRestore();
    });

    it('should handle localStorage quota exceeded for history', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const history: GameResult[] = [
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00.000Z',
          outcome: 'player',
          playerHand: {
            cards: [{ suit: 'hearts', rank: 'A' }],
            score: 1,
          },
          bankerHand: {
            cards: [{ suit: 'clubs', rank: 'K' }],
            score: 0,
          },
          bets: { player: 100, banker: 0, tie: 0 },
          payout: 100,
        },
      ];

      expect(() => saveHistory(history)).not.toThrow();

      setItemSpy.mockRestore();
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem(STORAGE_KEYS.BALANCE, '{corrupted}');
      localStorage.setItem(STORAGE_KEYS.HISTORY, '[{corrupted}]');

      expect(loadBalance()).toBe(null);
      expect(loadHistory()).toEqual([]);
    });
  });

  describe('Data Validation', () => {
    it('should handle negative balance', () => {
      saveBalance(-100);
      const balance = loadBalance();
      expect(balance).toBe(-100);
    });

    it('should handle very large numbers', () => {
      const largeNumber = 999999999;
      saveBalance(largeNumber);
      const balance = loadBalance();
      expect(balance).toBe(largeNumber);
    });

    it('should handle history with many entries', () => {
      const largeHistory: GameResult[] = Array.from({ length: 100 }, (_, i) => ({
        id: `${i + 1}`,
        timestamp: new Date().toISOString(),
        outcome: i % 3 === 0 ? 'player' : i % 3 === 1 ? 'banker' : 'tie',
        playerHand: {
          cards: [{ suit: 'hearts', rank: 'A' }],
          score: 1,
        },
        bankerHand: {
          cards: [{ suit: 'clubs', rank: 'K' }],
          score: 0,
        },
        bets: { player: 100, banker: 0, tie: 0 },
        payout: 100,
      })) as GameResult[];

      saveHistory(largeHistory);
      const loaded = loadHistory();
      expect(loaded).toHaveLength(100);
    });
  });

  describe('Browser Compatibility', () => {
    it('should work with localStorage available', () => {
      expect(typeof localStorage).toBe('object');
      expect(typeof localStorage.getItem).toBe('function');
      expect(typeof localStorage.setItem).toBe('function');
      expect(typeof localStorage.removeItem).toBe('function');
    });
  });
});
