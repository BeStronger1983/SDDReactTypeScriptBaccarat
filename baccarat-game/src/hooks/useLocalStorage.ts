import { useState } from 'react';

/**
 * Custom hook to manage state synchronized with localStorage
 *
 * @template T - The type of the value to store
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns A tuple of [value, setValue] similar to useState
 *
 * @example
 * const [balance, setBalance] = useLocalStorage('balance', 1000);
 * setBalance(500);
 * setBalance(prev => prev + 100);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      // Parse stored json or return initialValue
      if (item === null) {
        return initialValue;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      // If error (invalid JSON, storage access denied, etc.), return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((prev: T) => T)): void => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.warn(`Error setting localStorage key "${key}":`, error);

      // Update state even if localStorage fails (quota exceeded, private browsing, etc.)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    }
  };

  return [storedValue, setValue];
}
