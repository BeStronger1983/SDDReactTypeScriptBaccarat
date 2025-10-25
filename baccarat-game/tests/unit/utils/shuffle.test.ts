import { describe, it, expect, vi } from 'vitest';
import { shuffle } from '@utils/shuffle';

describe('shuffle', () => {
  describe('Basic Functionality', () => {
    it('should return an array', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return a new array (immutability)', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);
      expect(result).not.toBe(input);
    });

    it('should not modify the original array', () => {
      const input = [1, 2, 3, 4, 5];
      const original = [...input];
      shuffle(input);
      expect(input).toEqual(original);
    });

    it('should return array with same length', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);
      expect(result.length).toBe(input.length);
    });

    it('should contain all original elements', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);
      expect(result.sort()).toEqual(input.sort());
    });

    it('should not add or remove elements', () => {
      const input = ['a', 'b', 'c', 'd', 'e'];
      const result = shuffle(input);
      expect(result).toHaveLength(input.length);
      input.forEach((item) => {
        expect(result).toContain(item);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array', () => {
      const result = shuffle([]);
      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const result = shuffle([1]);
      expect(result).toEqual([1]);
    });

    it('should handle two element array', () => {
      const input = [1, 2];
      const result = shuffle(input);
      expect(result).toHaveLength(2);
      expect(result).toContain(1);
      expect(result).toContain(2);
    });

    it('should handle array with duplicate values', () => {
      const input = [1, 1, 2, 2, 3, 3];
      const result = shuffle(input);
      expect(result).toHaveLength(6);
      expect(result.filter((x) => x === 1)).toHaveLength(2);
      expect(result.filter((x) => x === 2)).toHaveLength(2);
      expect(result.filter((x) => x === 3)).toHaveLength(2);
    });
  });

  describe('Type Support', () => {
    it('should work with number arrays', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);
      expect(result).toHaveLength(5);
    });

    it('should work with string arrays', () => {
      const input = ['a', 'b', 'c', 'd'];
      const result = shuffle(input);
      expect(result).toHaveLength(4);
    });

    it('should work with object arrays', () => {
      const input = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = shuffle(input);
      expect(result).toHaveLength(3);
      expect(result.every((item) => typeof item === 'object')).toBe(true);
    });

    it('should work with mixed type arrays', () => {
      const input = [1, 'two', { three: 3 }, null, undefined];
      const result = shuffle(input);
      expect(result).toHaveLength(5);
    });
  });

  describe('Fisher-Yates Algorithm Verification', () => {
    it('should shuffle array differently on multiple calls (statistical)', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = new Set();

      // Run shuffle 10 times, should get different results
      for (let i = 0; i < 10; i++) {
        const result = shuffle(input);
        results.add(result.join(','));
      }

      // With high probability, we should get multiple different shuffles
      // (not a guarantee, but extremely likely with 10 elements)
      expect(results.size).toBeGreaterThan(1);
    });

    it('should use Math.random for randomization', () => {
      const mathRandomSpy = vi.spyOn(Math, 'random');

      const input = [1, 2, 3, 4, 5];
      shuffle(input);

      // Fisher-Yates should call Math.random (n-1) times for n elements
      expect(mathRandomSpy).toHaveBeenCalled();

      mathRandomSpy.mockRestore();
    });

    it('should produce deterministic results with mocked random', () => {
      // Mock Math.random to return predictable sequence
      const randomValues = [0.5, 0.3, 0.7, 0.1];
      let callIndex = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        return randomValues[callIndex++ % randomValues.length] ?? 0;
      });

      const input = [1, 2, 3, 4, 5];
      const result1 = shuffle(input);

      // Reset call index
      callIndex = 0;
      const result2 = shuffle(input);

      expect(result1).toEqual(result2);

      vi.restoreAllMocks();
    });
  });

  describe('Uniform Distribution (Statistical)', () => {
    it('should distribute elements relatively evenly across positions', () => {
      const input = [1, 2, 3, 4, 5];
      const positionCounts: Map<number, Map<number, number>> = new Map();

      // Initialize position tracking
      input.forEach((_, idx) => {
        positionCounts.set(idx, new Map());
        input.forEach((val) => {
          positionCounts.get(idx)?.set(val, 0);
        });
      });

      // Run shuffle many times
      const iterations = 1000;
      for (let i = 0; i < iterations; i++) {
        const result = shuffle(input);
        result.forEach((value, position) => {
          const currentCount = positionCounts.get(position)?.get(value) ?? 0;
          positionCounts.get(position)?.set(value, currentCount + 1);
        });
      }

      // Each element should appear at each position roughly 1/5 of the time
      // With 1000 iterations, expect around 200 per position (±50% tolerance)
      const expectedCount = iterations / input.length;
      const tolerance = expectedCount * 0.5; // 50% tolerance for randomness

      positionCounts.forEach((valueCounts, position) => {
        valueCounts.forEach((count, value) => {
          expect(count).toBeGreaterThan(expectedCount - tolerance);
          expect(count).toBeLessThan(expectedCount + tolerance);
        });
      });
    });

    it('should not favor first or last positions', () => {
      const input = [1, 2, 3, 4, 5];
      let firstPositionChanges = 0;
      let lastPositionChanges = 0;
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const result = shuffle(input);
        if (result[0] !== input[0]) firstPositionChanges++;
        if (result[result.length - 1] !== input[input.length - 1]) lastPositionChanges++;
      }

      // First and last positions should change at least sometimes
      expect(firstPositionChanges).toBeGreaterThan(iterations * 0.5);
      expect(lastPositionChanges).toBeGreaterThan(iterations * 0.5);
    });
  });

  describe('Large Arrays', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      const startTime = Date.now();
      const result = shuffle(largeArray);
      const endTime = Date.now();

      expect(result).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
    });

    it('should shuffle large arrays uniformly', () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => i);
      const result = shuffle(largeArray);

      // Check that array is actually shuffled (not identical to input)
      const differences = result.filter((val, idx) => val !== largeArray[idx]);
      expect(differences.length).toBeGreaterThan(50); // At least 50% different
    });
  });

  describe('Real-world Usage (Card Deck)', () => {
    it('should shuffle a standard 52-card deck', () => {
      const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
      const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const deck = suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })));

      expect(deck).toHaveLength(52);

      const shuffled = shuffle(deck);

      expect(shuffled).toHaveLength(52);
      expect(shuffled).not.toBe(deck);

      // Verify all cards are still present
      suits.forEach((suit) => {
        ranks.forEach((rank) => {
          const found = shuffled.some((card) => card.suit === suit && card.rank === rank);
          expect(found).toBe(true);
        });
      });
    });

    it('should shuffle 8 decks (416 cards) for Baccarat', () => {
      const cards = Array.from({ length: 416 }, (_, i) => i);
      const shuffled = shuffle(cards);

      expect(shuffled).toHaveLength(416);
      expect(shuffled.sort((a, b) => a - b)).toEqual(cards);
    });
  });
});
