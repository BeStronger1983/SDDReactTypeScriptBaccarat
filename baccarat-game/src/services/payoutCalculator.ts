import type { Bet, GameOutcome, PayoutResult } from '@/types/game';
import { PAYOUT_RATES } from '@/types/game';

/**
 * Calculate payout for all betting areas based on game outcome
 *
 * Payout rates:
 * - Player: 1:1 (100%)
 * - Banker: 1:0.95 (95%, 5% commission)
 * - Tie: 1:8 (800%)
 *
 * Special rule: On tie, player and banker bets are returned (push)
 *
 * @param {Bet} bets - The bets placed on each area
 * @param {GameOutcome} outcome - The game outcome ('player', 'banker', or 'tie')
 * @returns {PayoutResult} Individual and total payouts
 *
 * @example
 * calculatePayout({ player: 100, banker: 0, tie: 0 }, 'player')
 * // returns { playerPayout: 100, bankerPayout: 0, tiePayout: 0, totalPayout: 100 }
 *
 * @example
 * calculatePayout({ player: 0, banker: 100, tie: 0 }, 'banker')
 * // returns { playerPayout: 0, bankerPayout: 95, tiePayout: 0, totalPayout: 95 }
 *
 * @example
 * calculatePayout({ player: 100, banker: 50, tie: 20 }, 'tie')
 * // returns { playerPayout: 0, bankerPayout: 0, tiePayout: 160, totalPayout: 160 }
 * // Note: Player and banker bets are pushed (returned, no profit)
 */
export function calculatePayout(bets: Bet, outcome: GameOutcome): PayoutResult {
  let playerPayout = 0;
  let bankerPayout = 0;
  let tiePayout = 0;

  // Calculate payouts based on outcome
  if (outcome === 'player') {
    // Player wins: 1:1 payout
    playerPayout = bets.player * PAYOUT_RATES.player;
  } else if (outcome === 'banker') {
    // Banker wins: 1:0.95 payout (5% commission)
    bankerPayout = bets.banker * PAYOUT_RATES.banker;
  } else if (outcome === 'tie') {
    // Tie wins: 1:8 payout
    tiePayout = bets.tie * PAYOUT_RATES.tie;
    // Note: Player and banker bets are pushed (returned), so payout is 0 (no profit)
  }

  const totalPayout = playerPayout + bankerPayout + tiePayout;

  return {
    playerPayout,
    bankerPayout,
    tiePayout,
    totalPayout,
  };
}

/**
 * Calculate total payout across all betting areas
 *
 * This is a convenience function that returns only the total payout
 * without the individual breakdown.
 *
 * @param {Bet} bets - The bets placed on each area
 * @param {GameOutcome} outcome - The game outcome
 * @returns {number} Total payout amount
 *
 * @example
 * calculateTotalPayout({ player: 100, banker: 50, tie: 20 }, 'player')
 * // returns 100
 *
 * @example
 * calculateTotalPayout({ player: 100, banker: 50, tie: 20 }, 'banker')
 * // returns 47.5
 */
export function calculateTotalPayout(bets: Bet, outcome: GameOutcome): number {
  const result = calculatePayout(bets, outcome);
  return result.totalPayout;
}
