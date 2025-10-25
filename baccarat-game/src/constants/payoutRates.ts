/**
 * Payout Rates Constants
 *
 * This file defines the payout rates for all betting areas in Baccarat.
 * These rates determine how much a player wins based on their bet amount.
 */

// ============================================================================
// Payout Rate Definitions
// ============================================================================

/**
 * Payout rate for Player bet
 * Pays 1:1 (even money)
 *
 * Example: Bet 100, win 100
 */
export const PLAYER_PAYOUT_RATE = 1.0;

/**
 * Payout rate for Banker bet
 * Pays 1:0.95 (95% of bet due to 5% commission)
 *
 * The 5% commission is standard in Baccarat because the Banker bet
 * has a slightly higher probability of winning.
 *
 * Example: Bet 100, win 95
 */
export const BANKER_PAYOUT_RATE = 0.95;

/**
 * Payout rate for Tie bet
 * Pays 1:8 (8 times the bet)
 *
 * Example: Bet 100, win 800
 */
export const TIE_PAYOUT_RATE = 8.0;

// ============================================================================
// Payout Rates Object
// ============================================================================

/**
 * Centralized payout rates configuration
 * Maps bet type to payout multiplier
 *
 * Usage:
 * - Player wins: betAmount * PAYOUT_RATES.player
 * - Banker wins: betAmount * PAYOUT_RATES.banker
 * - Tie wins: betAmount * PAYOUT_RATES.tie
 */
export const PAYOUT_RATES = {
  player: PLAYER_PAYOUT_RATE,
  banker: BANKER_PAYOUT_RATE,
  tie: TIE_PAYOUT_RATE,
} as const;

/**
 * Type for payout rates object
 */
export type PayoutRatesType = typeof PAYOUT_RATES;

/**
 * Type for valid bet types
 */
export type BetType = keyof typeof PAYOUT_RATES;

// ============================================================================
// Commission Configuration
// ============================================================================

/**
 * Commission rate for Banker bets
 * Standard Baccarat applies 5% commission on Banker wins
 */
export const BANKER_COMMISSION_RATE = 0.05;

/**
 * Net payout multiplier for Banker after commission
 * 1.0 - 0.05 = 0.95
 */
export const BANKER_NET_PAYOUT = 1.0 - BANKER_COMMISSION_RATE;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate payout for a given bet type and amount
 *
 * @param betType - Type of bet (player, banker, or tie)
 * @param betAmount - Amount wagered
 * @returns Payout amount (winnings, not including original bet)
 *
 * @example
 * calculatePayout('player', 100) // Returns 100
 * calculatePayout('banker', 100) // Returns 95
 * calculatePayout('tie', 100)    // Returns 800
 */
export function calculatePayout(betType: BetType, betAmount: number): number {
  return betAmount * PAYOUT_RATES[betType];
}

/**
 * Calculate total return (original bet + winnings)
 *
 * @param betType - Type of bet (player, banker, or tie)
 * @param betAmount - Amount wagered
 * @returns Total return (original bet + payout)
 *
 * @example
 * calculateTotalReturn('player', 100) // Returns 200 (100 + 100)
 * calculateTotalReturn('banker', 100) // Returns 195 (100 + 95)
 * calculateTotalReturn('tie', 100)    // Returns 900 (100 + 800)
 */
export function calculateTotalReturn(betType: BetType, betAmount: number): number {
  return betAmount + calculatePayout(betType, betAmount);
}

/**
 * Get the payout rate for a specific bet type
 *
 * @param betType - Type of bet (player, banker, or tie)
 * @returns Payout rate multiplier
 */
export function getPayoutRate(betType: BetType): number {
  return PAYOUT_RATES[betType];
}
