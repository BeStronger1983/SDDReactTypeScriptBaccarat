import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial Value', () => {
    it('should return initial value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      expect(result.current[0]).toBe('initial');
    });

    it('should return stored value when localStorage has value', () => {
      localStorage.setItem('test-key', JSON.stringify('stored'));
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
      expect(result.current[0]).toBe('stored');
    });

    it('should handle number initial value', () => {
      const { result } = renderHook(() => useLocalStorage('number-key', 42));
      expect(result.current[0]).toBe(42);
    });

    it('should handle object initial value', () => {
      const initialObj = { name: 'test', value: 123 };
      const { result } = renderHook(() => useLocalStorage('object-key', initialObj));
      expect(result.current[0]).toEqual(initialObj);
    });

    it('should handle array initial value', () => {
      const initialArray = [1, 2, 3];
      const { result } = renderHook(() => useLocalStorage('array-key', initialArray));
      expect(result.current[0]).toEqual(initialArray);
    });

    it('should handle boolean initial value', () => {
      const { result } = renderHook(() => useLocalStorage('boolean-key', true));
      expect(result.current[0]).toBe(true);
    });

    it('should handle null initial value', () => {
      const { result } = renderHook(() => useLocalStorage('null-key', null));
      expect(result.current[0]).toBe(null);
    });
  });

  describe('Setting Value', () => {
    it('should update value in state', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
    });

    it('should update value in localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
    });

    it('should handle setting number value', () => {
      const { result } = renderHook(() => useLocalStorage('number-key', 0));

      act(() => {
        result.current[1](100);
      });

      expect(result.current[0]).toBe(100);
      expect(localStorage.getItem('number-key')).toBe(JSON.stringify(100));
    });

    it('should handle setting object value', () => {
      const { result } = renderHook(() => useLocalStorage('object-key', {}));
      const newObj = { name: 'test', value: 123 };

      act(() => {
        result.current[1](newObj);
      });

      expect(result.current[0]).toEqual(newObj);
      expect(localStorage.getItem('object-key')).toBe(JSON.stringify(newObj));
    });

    it('should handle setting array value', () => {
      const { result } = renderHook(() => useLocalStorage('array-key', []));
      const newArray = [1, 2, 3];

      act(() => {
        result.current[1](newArray);
      });

      expect(result.current[0]).toEqual(newArray);
      expect(localStorage.getItem('array-key')).toBe(JSON.stringify(newArray));
    });

    it('should handle functional updates', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);
    });

    it('should handle multiple updates', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));

      act(() => {
        result.current[1](1);
        result.current[1](2);
        result.current[1](3);
      });

      expect(result.current[0]).toBe(3);
    });
  });

  describe('Persistence', () => {
    it('should persist value across hook instances', () => {
      const { result: result1 } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result1.current[1]('persisted');
      });

      const { result: result2 } = renderHook(() => useLocalStorage('test-key', 'initial'));
      expect(result2.current[0]).toBe('persisted');
    });

    it('should persist complex objects', () => {
      const complexObj = {
        id: 1,
        name: 'test',
        nested: { value: 42 },
        array: [1, 2, 3],
      };

      const { result: result1 } = renderHook(() => useLocalStorage('complex-key', {}));

      act(() => {
        result1.current[1](complexObj);
      });

      const { result: result2 } = renderHook(() => useLocalStorage('complex-key', {}));
      expect(result2.current[0]).toEqual(complexObj);
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parse errors', () => {
      localStorage.setItem('invalid-key', 'invalid json');
      const { result } = renderHook(() => useLocalStorage('invalid-key', 'default'));
      expect(result.current[0]).toBe('default');
    });

    it('should handle localStorage setItem errors', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
      setItemSpy.mockRestore();
    });

    it('should handle localStorage getItem errors', () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage access error');
      });

      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
      expect(result.current[0]).toBe('default');

      getItemSpy.mockRestore();
    });
  });

  describe('Game Balance Integration', () => {
    it('should store balance as number', () => {
      const { result } = renderHook(() => useLocalStorage('balance', 1000));
      expect(result.current[0]).toBe(1000);
    });

    it('should update balance correctly', () => {
      const { result } = renderHook(() => useLocalStorage('balance', 1000));

      act(() => {
        result.current[1]((prev) => prev - 100);
      });

      expect(result.current[0]).toBe(900);
    });

    it('should persist balance across sessions', () => {
      const { result: result1 } = renderHook(() => useLocalStorage('balance', 1000));

      act(() => {
        result1.current[1](500);
      });

      const { result: result2 } = renderHook(() => useLocalStorage('balance', 1000));
      expect(result2.current[0]).toBe(500);
    });
  });

  describe('Game History Integration', () => {
    it('should store game history as array', () => {
      const history = [
        { round: 1, winner: 'player', bet: 100, payout: 200 },
        { round: 2, winner: 'banker', bet: 50, payout: 0 },
      ];

      const { result } = renderHook(() => useLocalStorage('history', []));

      act(() => {
        result.current[1](history);
      });

      expect(result.current[0]).toEqual(history);
    });

    it('should append to history', () => {
      const { result } = renderHook(() => useLocalStorage('history', []));

      act(() => {
        result.current[1]((prev) => [
          ...prev,
          { round: 1, winner: 'player', bet: 100, payout: 200 },
        ]);
      });

      expect(result.current[0]).toHaveLength(1);
      expect(result.current[0][0]).toEqual({ round: 1, winner: 'player', bet: 100, payout: 200 });
    });
  });

  describe('Type Safety', () => {
    it('should maintain type for string', () => {
      const { result } = renderHook(() => useLocalStorage('string-key', 'test'));
      expect(typeof result.current[0]).toBe('string');
    });

    it('should maintain type for number', () => {
      const { result } = renderHook(() => useLocalStorage('number-key', 42));
      expect(typeof result.current[0]).toBe('number');
    });

    it('should maintain type for boolean', () => {
      const { result } = renderHook(() => useLocalStorage('boolean-key', true));
      expect(typeof result.current[0]).toBe('boolean');
    });

    it('should maintain type for object', () => {
      const { result } = renderHook(() => useLocalStorage('object-key', { test: 'value' }));
      expect(typeof result.current[0]).toBe('object');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string as value', () => {
      const { result } = renderHook(() => useLocalStorage('empty-key', ''));
      expect(result.current[0]).toBe('');
    });

    it('should handle zero as value', () => {
      const { result } = renderHook(() => useLocalStorage('zero-key', 0));
      expect(result.current[0]).toBe(0);
    });

    it('should handle false as value', () => {
      const { result } = renderHook(() => useLocalStorage('false-key', false));
      expect(result.current[0]).toBe(false);
    });

    it('should handle undefined in localStorage', () => {
      localStorage.setItem('undefined-key', 'undefined');
      const { result } = renderHook(() => useLocalStorage('undefined-key', 'default'));
      expect(result.current[0]).toBe('default');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      const { result } = renderHook(() => useLocalStorage('long-key', ''));

      act(() => {
        result.current[1](longString);
      });

      expect(result.current[0]).toBe(longString);
    });

    it('should handle rapid consecutive updates', () => {
      const { result } = renderHook(() => useLocalStorage('rapid-key', 0));

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current[1](i);
        }
      });

      expect(result.current[0]).toBe(99);
    });
  });

  describe('Key Uniqueness', () => {
    it('should maintain separate values for different keys', () => {
      const { result: result1 } = renderHook(() => useLocalStorage('key1', 'value1'));
      const { result: result2 } = renderHook(() => useLocalStorage('key2', 'value2'));

      expect(result1.current[0]).toBe('value1');
      expect(result2.current[0]).toBe('value2');
    });

    it('should not interfere with other keys when updating', () => {
      const { result: result1 } = renderHook(() => useLocalStorage('key1', 'value1'));
      const { result: result2 } = renderHook(() => useLocalStorage('key2', 'value2'));

      act(() => {
        result1.current[1]('updated1');
      });

      expect(result1.current[0]).toBe('updated1');
      expect(result2.current[0]).toBe('value2');
    });
  });
});
