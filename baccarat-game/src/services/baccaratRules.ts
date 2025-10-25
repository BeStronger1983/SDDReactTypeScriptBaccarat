/**
 * Baccarat Drawing Rules
 *
 * Implements the official Baccarat third card drawing rules
 * following the standard casino rules.
 */

/**
 * Determine if the player should draw a third card
 *
 * Player drawing rules:
 * - 0-5: Draw third card
 * - 6-7: Stand (no draw)
 * - 8-9: Natural (no draw)
 *
 * @param {number} playerScore - The player's current score (0-9)
 * @returns {boolean} True if player should draw, false otherwise
 *
 * @example
 * shouldPlayerDraw(5) // returns true (draw)
 * shouldPlayerDraw(6) // returns false (stand)
 * shouldPlayerDraw(8) // returns false (natural)
 */
export function shouldPlayerDraw(playerScore: number): boolean {
  // Player draws on 0-5, stands on 6-7, natural on 8-9
  return playerScore >= 0 && playerScore <= 5;
}

/**
 * Helper function to determine banker draw when player drew a third card
 */
function shouldBankerDrawWhenPlayerDrew(
  bankerScore: number,
  playerThirdCardValue: number
): boolean {
  // Banker 0-2: Always draw
  if (bankerScore <= 2) {
    return true;
  }

  // Banker 3-6: Depends on player's third card value
  const drawRanges: Record<number, [number, number]> = {
    3: [0, 9], // Draw unless player card is 8
    4: [2, 7], // Draw if player card is 2-7
    5: [4, 7], // Draw if player card is 4-7
    6: [6, 7], // Draw if player card is 6-7
  };

  const range = drawRanges[bankerScore];
  if (!range) {
    return false;
  }

  const [min, max] = range;
  const shouldDraw = playerThirdCardValue >= min && playerThirdCardValue <= max;

  // Special case: Banker 3 doesn't draw if player's third card is 8
  if (bankerScore === 3 && playerThirdCardValue === 8) {
    return false;
  }

  return shouldDraw;
}

/**
 * Determine if the banker should draw a third card
 *
 * Banker drawing rules are complex and depend on:
 * 1. Banker's current score
 * 2. Whether player drew a third card
 * 3. If player drew, the value of player's third card
 *
 * Rules:
 * - If player did not draw (null):
 *   - Banker 0-5: Draw
 *   - Banker 6-7: Stand
 *   - Banker 8-9: Natural (stand)
 *
 * - If player drew:
 *   - Banker 0-2: Always draw
 *   - Banker 3: Draw unless player's 3rd card is 8
 *   - Banker 4: Draw if player's 3rd card is 2-7
 *   - Banker 5: Draw if player's 3rd card is 4-7
 *   - Banker 6: Draw if player's 3rd card is 6-7
 *   - Banker 7: Stand
 *   - Banker 8-9: Natural (stand)
 *
 * @param {number} bankerScore - The banker's current score (0-9)
 * @param {number | null} playerThirdCardValue - The value of player's third card (0-9), or null if player did not draw
 * @returns {boolean} True if banker should draw, false otherwise
 *
 * @example
 * shouldBankerDraw(5, null) // returns true (player didn't draw, banker < 6)
 * shouldBankerDraw(3, 8) // returns false (player drew 8, banker is 3)
 * shouldBankerDraw(5, 6) // returns true (player drew 6, banker is 5)
 */
export function shouldBankerDraw(
  bankerScore: number,
  playerThirdCardValue: number | null
): boolean {
  // Natural 8 or 9, or score of 7 - never draw
  if (bankerScore >= 7) {
    return false;
  }

  // Player did not draw a third card - simple rule
  if (playerThirdCardValue === null) {
    return bankerScore <= 5;
  }

  // Player drew - use complex rules
  return shouldBankerDrawWhenPlayerDrew(bankerScore, playerThirdCardValue);
}
