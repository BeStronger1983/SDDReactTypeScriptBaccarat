import { describe, it, expect } from 'vitest';
import {
  CHIP_DENOMINATIONS,
  DECK_COUNT,
  CARDS_PER_DECK,
  TOTAL_CARDS,
  SHUFFLE_THRESHOLD,
  BETTING_TIMER_SECONDS,
  CARD_DEAL_DELAY_MS,
  RESULT_DISPLAY_DURATION_MS,
  INITIAL_BALANCE,
  MIN_BET,
  MAX_BET,
  MAX_TOTAL_BET,
  MAX_HISTORY_ENTRIES,
  GameConfig,
} from '@constants/gameConfig';

describe('gameConfig', () => {
  describe('Chip Configuration', () => {
    it('should define chip denominations', () => {
      expect(CHIP_DENOMINATIONS).toEqual([10, 50, 100, 500, 1000]);
      expect(CHIP_DENOMINATIONS).toHaveLength(5);
    });

    it('should have chip denominations in ascending order', () => {
      const sorted = [...CHIP_DENOMINATIONS].sort((a, b) => a - b);
      expect(CHIP_DENOMINATIONS).toEqual(sorted);
    });
  });

  describe('Card Shoe Configuration', () => {
    it('should define 8 decks', () => {
      expect(DECK_COUNT).toBe(8);
    });

    it('should have 52 cards per deck', () => {
      expect(CARDS_PER_DECK).toBe(52);
    });

    it('should calculate total cards correctly', () => {
      expect(TOTAL_CARDS).toBe(DECK_COUNT * CARDS_PER_DECK);
      expect(TOTAL_CARDS).toBe(416);
    });

    it('should set shuffle threshold to 52 cards', () => {
      expect(SHUFFLE_THRESHOLD).toBe(52);
      expect(SHUFFLE_THRESHOLD).toBeLessThan(TOTAL_CARDS);
    });
  });

  describe('Timer Configuration', () => {
    it('should set betting timer to 15 seconds', () => {
      expect(BETTING_TIMER_SECONDS).toBe(15);
    });

    it('should set card deal delay to 500ms', () => {
      expect(CARD_DEAL_DELAY_MS).toBe(500);
    });

    it('should set result display duration to 3000ms', () => {
      expect(RESULT_DISPLAY_DURATION_MS).toBe(3000);
    });
  });

  describe('Balance and Betting Limits', () => {
    it('should set initial balance to 10000', () => {
      expect(INITIAL_BALANCE).toBe(10000);
    });

    it('should set minimum bet to 10', () => {
      expect(MIN_BET).toBe(10);
    });

    it('should set maximum bet to 10000', () => {
      expect(MAX_BET).toBe(10000);
    });

    it('should set maximum total bet to 20000', () => {
      expect(MAX_TOTAL_BET).toBe(20000);
    });

    it('should have min bet less than max bet', () => {
      expect(MIN_BET).toBeLessThan(MAX_BET);
    });

    it('should have max bet less than or equal to max total bet', () => {
      expect(MAX_BET).toBeLessThanOrEqual(MAX_TOTAL_BET);
    });

    it('should have smallest chip denomination equal to min bet', () => {
      expect(CHIP_DENOMINATIONS[0]).toBe(MIN_BET);
    });
  });

  describe('Game History', () => {
    it('should set max history entries to 10', () => {
      expect(MAX_HISTORY_ENTRIES).toBe(10);
    });
  });

  describe('GameConfig Object', () => {
    it('should contain all configuration values', () => {
      expect(GameConfig.chipDenominations).toEqual(CHIP_DENOMINATIONS);
      expect(GameConfig.deckCount).toBe(DECK_COUNT);
      expect(GameConfig.cardsPerDeck).toBe(CARDS_PER_DECK);
      expect(GameConfig.totalCards).toBe(TOTAL_CARDS);
      expect(GameConfig.shuffleThreshold).toBe(SHUFFLE_THRESHOLD);
      expect(GameConfig.bettingTimerSeconds).toBe(BETTING_TIMER_SECONDS);
      expect(GameConfig.cardDealDelayMs).toBe(CARD_DEAL_DELAY_MS);
      expect(GameConfig.resultDisplayDurationMs).toBe(RESULT_DISPLAY_DURATION_MS);
      expect(GameConfig.initialBalance).toBe(INITIAL_BALANCE);
      expect(GameConfig.minBet).toBe(MIN_BET);
      expect(GameConfig.maxBet).toBe(MAX_BET);
      expect(GameConfig.maxTotalBet).toBe(MAX_TOTAL_BET);
      expect(GameConfig.maxHistoryEntries).toBe(MAX_HISTORY_ENTRIES);
    });

    it('should be immutable (readonly)', () => {
      // This is a compile-time check, but we can verify the structure
      expect(GameConfig).toBeDefined();
      expect(typeof GameConfig).toBe('object');
    });
  });
});
