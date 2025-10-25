import { CHIP_VALUES } from '@/types/game';

/**
 * Validate if a bet amount is valid
 *
 * A valid bet amount must be:
 * - A positive number
 * - Not zero
 * - Not NaN or Infinity
 *
 * @param {number} amount - The bet amount to validate
 * @returns {boolean} True if the bet amount is valid, false otherwise
 *
 * @example
 * validateBetAmount(100) // returns true
 * validateBetAmount(0) // returns false
 * validateBetAmount(-50) // returns false
 */
export function validateBetAmount(amount: number): boolean {
  // Check if amount is a valid number
  if (!Number.isFinite(amount)) {
    return false;
  }

  // Amount must be positive and non-zero
  return amount > 0;
}

/**
 * Validate if the player has sufficient balance for a bet
 *
 * The balance must be:
 * - A valid finite number
 * - Greater than or equal to the bet amount
 * - The bet amount must also be valid
 *
 * @param {number} balance - The player's current balance
 * @param {number} betAmount - The amount the player wants to bet
 * @returns {boolean} True if the balance is sufficient, false otherwise
 *
 * @example
 * validateBalance(1000, 100) // returns true
 * validateBalance(100, 100) // returns true (all-in)
 * validateBalance(50, 100) // returns false (insufficient)
 */
export function validateBalance(balance: number, betAmount: number): boolean {
  // Check if both balance and betAmount are valid numbers
  if (!Number.isFinite(balance) || !Number.isFinite(betAmount)) {
    return false;
  }

  // Bet amount must be valid (positive)
  if (betAmount <= 0) {
    return false;
  }

  // Balance must be non-negative and sufficient for the bet
  if (balance < 0) {
    return false;
  }

  // Balance must be greater than or equal to bet amount
  return balance >= betAmount;
}

/**
 * Validate if a chip value is a valid denomination
 *
 * Valid chip values are defined in CHIP_VALUES constant:
 * 10, 50, 100, 500, 1000
 *
 * @param {number} chipValue - The chip value to validate
 * @returns {boolean} True if the chip value is valid, false otherwise
 *
 * @example
 * validateChipValue(10) // returns true
 * validateChipValue(100) // returns true
 * validateChipValue(25) // returns false (invalid denomination)
 */
export function validateChipValue(chipValue: number): boolean {
  // Check if chipValue is a valid number
  if (!Number.isFinite(chipValue)) {
    return false;
  }

  // Check if the chip value is in the CHIP_VALUES array
  return (CHIP_VALUES as readonly number[]).includes(chipValue);
}
