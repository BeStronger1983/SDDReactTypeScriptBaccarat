/**
 * Fisher-Yates shuffle algorithm
 * Shuffles an array in-place using the Fisher-Yates (Knuth) algorithm
 * Time Complexity: O(n)
 * Space Complexity: O(n) - creates a copy to maintain immutability
 *
 * @template T - The type of elements in the array
 * @param {readonly T[]} array - The array to shuffle (not modified)
 * @returns {T[]} A new shuffled array
 *
 * @example
 * const deck = [1, 2, 3, 4, 5];
 * const shuffled = shuffle(deck);
 * // shuffled might be [3, 1, 5, 2, 4]
 * // deck is still [1, 2, 3, 4, 5]
 */
export function shuffle<T>(array: readonly T[]): T[] {
  // Create a copy to maintain immutability
  const result = [...array];

  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    // Generate random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at positions i and j
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
