import { useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Return type for useBalance hook
 */
export interface UseBalanceReturn {
  balance: number;
  debit: (amount: number) => boolean;
  credit: (amount: number) => void;
  reset: () => void;
  setBalance: (amount: number) => void;
  canAfford: (amount: number) => boolean;
}

/**
 * Custom hook to manage player balance with persistence
 *
 * @param initialBalance - The initial balance (default: 1000)
 * @returns Balance management functions
 *
 * @example
 * const { balance, debit, credit, canAfford } = useBalance(1000);
 *
 * // Check if player can afford bet
 * if (canAfford(100)) {
 *   // Place bet
 *   const success = debit(100);
 * }
 *
 * // Add winnings
 * credit(200);
 */
export function useBalance(initialBalance = 1000): UseBalanceReturn {
  // Store initial balance for reset functionality
  const initialBalanceRef = useRef(initialBalance);

  // Keep a ref of the latest balance for synchronous operations
  const balanceRef = useRef(initialBalance);

  // Use localStorage for persistence
  const [balance, setBalance] = useLocalStorage('balance', initialBalance);

  // Keep balanceRef in sync with balance state
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  /**
   * Deduct amount from balance
   * @param amount - Amount to deduct
   * @returns true if successful, false if insufficient funds
   */
  const debit = useCallback(
    (amount: number): boolean => {
      // Validate amount
      if (!isValidAmount(amount)) {
        return false;
      }

      // Check if sufficient balance using ref
      if (balanceRef.current < amount) {
        return false;
      }

      // Deduct amount and update ref (round to 2 decimal places for currency)
      const newBalance = Math.round((balanceRef.current - amount) * 100) / 100;
      balanceRef.current = newBalance;
      setBalance(newBalance);
      return true;
    },
    [setBalance]
  );

  /**
   * Add amount to balance
   * @param amount - Amount to add
   */
  const credit = useCallback(
    (amount: number): void => {
      // Validate amount
      if (!isValidAmount(amount)) {
        return;
      }

      // Add amount and update ref (round to 2 decimal places for currency)
      const newBalance = Math.round((balanceRef.current + amount) * 100) / 100;
      balanceRef.current = newBalance;
      setBalance(newBalance);
    },
    [setBalance]
  );

  /**
   * Reset balance to initial value
   */
  const reset = useCallback((): void => {
    balanceRef.current = initialBalanceRef.current;
    setBalance(initialBalanceRef.current);
  }, [setBalance]);

  /**
   * Set balance to specific amount
   * @param amount - New balance amount
   */
  const setBalanceAmount = useCallback(
    (amount: number): void => {
      // Validate amount (must be non-negative)
      if (!isValidAmount(amount) || amount < 0) {
        return;
      }

      balanceRef.current = amount;
      setBalance(amount);
    },
    [setBalance]
  );

  /**
   * Check if player can afford an amount
   * @param amount - Amount to check
   * @returns true if balance is sufficient
   */
  const canAfford = useCallback((amount: number): boolean => {
    // Validate amount
    if (!isValidAmount(amount)) {
      return false;
    }

    // Check if balance is sufficient using ref for latest value
    return balanceRef.current >= amount && amount >= 0;
  }, []);

  return {
    balance,
    debit,
    credit,
    reset,
    setBalance: setBalanceAmount,
    canAfford,
  };
}

/**
 * Validate if amount is a valid number
 * @param amount - Amount to validate
 * @returns true if amount is valid
 */
function isValidAmount(amount: number): boolean {
  // Check if amount is a valid number
  if (typeof amount !== 'number') {
    return false;
  }

  // Check if amount is not NaN
  if (Number.isNaN(amount)) {
    return false;
  }

  // Check if amount is not Infinity
  if (!Number.isFinite(amount)) {
    return false;
  }

  // Check if amount is not negative
  if (amount < 0) {
    return false;
  }

  return true;
}
