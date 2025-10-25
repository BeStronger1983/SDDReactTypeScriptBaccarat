import { describe, it, expect } from 'vitest';
import { shouldPlayerDraw, shouldBankerDraw } from '@/services/baccaratRules';

describe('baccaratRules', () => {
  describe('shouldPlayerDraw', () => {
    describe('Player Natural (8-9) - No Draw', () => {
      it('should return false when player has natural 8', () => {
        expect(shouldPlayerDraw(8)).toBe(false);
      });

      it('should return false when player has natural 9', () => {
        expect(shouldPlayerDraw(9)).toBe(false);
      });
    });

    describe('Player Standing (6-7) - No Draw', () => {
      it('should return false when player has 6', () => {
        expect(shouldPlayerDraw(6)).toBe(false);
      });

      it('should return false when player has 7', () => {
        expect(shouldPlayerDraw(7)).toBe(false);
      });
    });

    describe('Player Drawing (0-5) - Must Draw', () => {
      it('should return true when player has 0', () => {
        expect(shouldPlayerDraw(0)).toBe(true);
      });

      it('should return true when player has 1', () => {
        expect(shouldPlayerDraw(1)).toBe(true);
      });

      it('should return true when player has 2', () => {
        expect(shouldPlayerDraw(2)).toBe(true);
      });

      it('should return true when player has 3', () => {
        expect(shouldPlayerDraw(3)).toBe(true);
      });

      it('should return true when player has 4', () => {
        expect(shouldPlayerDraw(4)).toBe(true);
      });

      it('should return true when player has 5', () => {
        expect(shouldPlayerDraw(5)).toBe(true);
      });
    });

    describe('Edge Cases', () => {
      it('should handle all valid scores 0-9', () => {
        const expectedResults = [
          true, // 0
          true, // 1
          true, // 2
          true, // 3
          true, // 4
          true, // 5
          false, // 6
          false, // 7
          false, // 8 (natural)
          false, // 9 (natural)
        ];

        expectedResults.forEach((expected, score) => {
          expect(shouldPlayerDraw(score)).toBe(expected);
        });
      });
    });
  });

  describe('shouldBankerDraw', () => {
    describe('Natural (8-9) - Never Draw', () => {
      it('should return false when banker has natural 8, player did not draw', () => {
        expect(shouldBankerDraw(8, null)).toBe(false);
      });

      it('should return false when banker has natural 9, player did not draw', () => {
        expect(shouldBankerDraw(9, null)).toBe(false);
      });

      it('should return false when banker has natural 8, player drew any card', () => {
        expect(shouldBankerDraw(8, 5)).toBe(false);
      });

      it('should return false when banker has natural 9, player drew any card', () => {
        expect(shouldBankerDraw(9, 3)).toBe(false);
      });
    });

    describe('Banker 7 - Never Draw', () => {
      it('should return false when banker has 7, player did not draw', () => {
        expect(shouldBankerDraw(7, null)).toBe(false);
      });

      it('should return false when banker has 7, player drew any card', () => {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((playerThirdCard) => {
          expect(shouldBankerDraw(7, playerThirdCard)).toBe(false);
        });
      });
    });

    describe('Player Did Not Draw (null)', () => {
      describe('Banker 0-5 - Must Draw', () => {
        it('should return true when banker has 0', () => {
          expect(shouldBankerDraw(0, null)).toBe(true);
        });

        it('should return true when banker has 1', () => {
          expect(shouldBankerDraw(1, null)).toBe(true);
        });

        it('should return true when banker has 2', () => {
          expect(shouldBankerDraw(2, null)).toBe(true);
        });

        it('should return true when banker has 3', () => {
          expect(shouldBankerDraw(3, null)).toBe(true);
        });

        it('should return true when banker has 4', () => {
          expect(shouldBankerDraw(4, null)).toBe(true);
        });

        it('should return true when banker has 5', () => {
          expect(shouldBankerDraw(5, null)).toBe(true);
        });
      });

      describe('Banker 6-7 - Do Not Draw', () => {
        it('should return false when banker has 6', () => {
          expect(shouldBankerDraw(6, null)).toBe(false);
        });

        it('should return false when banker has 7', () => {
          expect(shouldBankerDraw(7, null)).toBe(false);
        });
      });
    });

    describe('Player Drew (playerThirdCardValue provided)', () => {
      describe('Banker 0-2 - Always Draw', () => {
        it('should return true when banker has 0, regardless of player third card', () => {
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((playerCard) => {
            expect(shouldBankerDraw(0, playerCard)).toBe(true);
          });
        });

        it('should return true when banker has 1, regardless of player third card', () => {
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((playerCard) => {
            expect(shouldBankerDraw(1, playerCard)).toBe(true);
          });
        });

        it('should return true when banker has 2, regardless of player third card', () => {
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((playerCard) => {
            expect(shouldBankerDraw(2, playerCard)).toBe(true);
          });
        });
      });

      describe('Banker 3 - Draw unless player third card is 8', () => {
        it('should return true when player third card is 0', () => {
          expect(shouldBankerDraw(3, 0)).toBe(true);
        });

        it('should return true when player third card is 1', () => {
          expect(shouldBankerDraw(3, 1)).toBe(true);
        });

        it('should return true when player third card is 2', () => {
          expect(shouldBankerDraw(3, 2)).toBe(true);
        });

        it('should return true when player third card is 3', () => {
          expect(shouldBankerDraw(3, 3)).toBe(true);
        });

        it('should return true when player third card is 4', () => {
          expect(shouldBankerDraw(3, 4)).toBe(true);
        });

        it('should return true when player third card is 5', () => {
          expect(shouldBankerDraw(3, 5)).toBe(true);
        });

        it('should return true when player third card is 6', () => {
          expect(shouldBankerDraw(3, 6)).toBe(true);
        });

        it('should return true when player third card is 7', () => {
          expect(shouldBankerDraw(3, 7)).toBe(true);
        });

        it('should return false when player third card is 8', () => {
          expect(shouldBankerDraw(3, 8)).toBe(false);
        });

        it('should return true when player third card is 9', () => {
          expect(shouldBankerDraw(3, 9)).toBe(true);
        });
      });

      describe('Banker 4 - Draw only if player third card is 2-7', () => {
        it('should return false when player third card is 0', () => {
          expect(shouldBankerDraw(4, 0)).toBe(false);
        });

        it('should return false when player third card is 1', () => {
          expect(shouldBankerDraw(4, 1)).toBe(false);
        });

        it('should return true when player third card is 2', () => {
          expect(shouldBankerDraw(4, 2)).toBe(true);
        });

        it('should return true when player third card is 3', () => {
          expect(shouldBankerDraw(4, 3)).toBe(true);
        });

        it('should return true when player third card is 4', () => {
          expect(shouldBankerDraw(4, 4)).toBe(true);
        });

        it('should return true when player third card is 5', () => {
          expect(shouldBankerDraw(4, 5)).toBe(true);
        });

        it('should return true when player third card is 6', () => {
          expect(shouldBankerDraw(4, 6)).toBe(true);
        });

        it('should return true when player third card is 7', () => {
          expect(shouldBankerDraw(4, 7)).toBe(true);
        });

        it('should return false when player third card is 8', () => {
          expect(shouldBankerDraw(4, 8)).toBe(false);
        });

        it('should return false when player third card is 9', () => {
          expect(shouldBankerDraw(4, 9)).toBe(false);
        });
      });

      describe('Banker 5 - Draw only if player third card is 4-7', () => {
        it('should return false when player third card is 0', () => {
          expect(shouldBankerDraw(5, 0)).toBe(false);
        });

        it('should return false when player third card is 1', () => {
          expect(shouldBankerDraw(5, 1)).toBe(false);
        });

        it('should return false when player third card is 2', () => {
          expect(shouldBankerDraw(5, 2)).toBe(false);
        });

        it('should return false when player third card is 3', () => {
          expect(shouldBankerDraw(5, 3)).toBe(false);
        });

        it('should return true when player third card is 4', () => {
          expect(shouldBankerDraw(5, 4)).toBe(true);
        });

        it('should return true when player third card is 5', () => {
          expect(shouldBankerDraw(5, 5)).toBe(true);
        });

        it('should return true when player third card is 6', () => {
          expect(shouldBankerDraw(5, 6)).toBe(true);
        });

        it('should return true when player third card is 7', () => {
          expect(shouldBankerDraw(5, 7)).toBe(true);
        });

        it('should return false when player third card is 8', () => {
          expect(shouldBankerDraw(5, 8)).toBe(false);
        });

        it('should return false when player third card is 9', () => {
          expect(shouldBankerDraw(5, 9)).toBe(false);
        });
      });

      describe('Banker 6 - Draw only if player third card is 6-7', () => {
        it('should return false when player third card is 0', () => {
          expect(shouldBankerDraw(6, 0)).toBe(false);
        });

        it('should return false when player third card is 1', () => {
          expect(shouldBankerDraw(6, 1)).toBe(false);
        });

        it('should return false when player third card is 2', () => {
          expect(shouldBankerDraw(6, 2)).toBe(false);
        });

        it('should return false when player third card is 3', () => {
          expect(shouldBankerDraw(6, 3)).toBe(false);
        });

        it('should return false when player third card is 4', () => {
          expect(shouldBankerDraw(6, 4)).toBe(false);
        });

        it('should return false when player third card is 5', () => {
          expect(shouldBankerDraw(6, 5)).toBe(false);
        });

        it('should return true when player third card is 6', () => {
          expect(shouldBankerDraw(6, 6)).toBe(true);
        });

        it('should return true when player third card is 7', () => {
          expect(shouldBankerDraw(6, 7)).toBe(true);
        });

        it('should return false when player third card is 8', () => {
          expect(shouldBankerDraw(6, 8)).toBe(false);
        });

        it('should return false when player third card is 9', () => {
          expect(shouldBankerDraw(6, 9)).toBe(false);
        });
      });
    });

    describe('Comprehensive Rule Coverage', () => {
      it('should cover all banker scores 0-9 with player not drawing', () => {
        const expectedResults = [
          true, // 0
          true, // 1
          true, // 2
          true, // 3
          true, // 4
          true, // 5
          false, // 6
          false, // 7
          false, // 8 (natural)
          false, // 9 (natural)
        ];

        expectedResults.forEach((expected, bankerScore) => {
          expect(shouldBankerDraw(bankerScore, null)).toBe(expected);
        });
      });

      it('should correctly handle banker 3 with all possible player third cards', () => {
        const results = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((playerCard) =>
          shouldBankerDraw(3, playerCard)
        );
        expect(results).toEqual([true, true, true, true, true, true, true, true, false, true]);
      });

      it('should correctly handle banker 4 with all possible player third cards', () => {
        const results = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((playerCard) =>
          shouldBankerDraw(4, playerCard)
        );
        expect(results).toEqual([false, false, true, true, true, true, true, true, false, false]);
      });

      it('should correctly handle banker 5 with all possible player third cards', () => {
        const results = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((playerCard) =>
          shouldBankerDraw(5, playerCard)
        );
        expect(results).toEqual([false, false, false, false, true, true, true, true, false, false]);
      });

      it('should correctly handle banker 6 with all possible player third cards', () => {
        const results = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((playerCard) =>
          shouldBankerDraw(6, playerCard)
        );
        expect(results).toEqual([
          false,
          false,
          false,
          false,
          false,
          false,
          true,
          true,
          false,
          false,
        ]);
      });
    });

    describe('Real Game Scenarios', () => {
      it('should handle scenario: player 5, draws 7; banker 3', () => {
        // Player has 5, draws third card (value 7)
        // Banker has 3, player third card is 7 -> banker draws
        expect(shouldBankerDraw(3, 7)).toBe(true);
      });

      it('should handle scenario: player 5, draws 8; banker 3', () => {
        // Player has 5, draws third card (value 8)
        // Banker has 3, player third card is 8 -> banker does not draw
        expect(shouldBankerDraw(3, 8)).toBe(false);
      });

      it('should handle scenario: player 4, draws 2; banker 5', () => {
        // Player has 4, draws third card (value 2)
        // Banker has 5, player third card is 2 -> banker does not draw
        expect(shouldBankerDraw(5, 2)).toBe(false);
      });

      it('should handle scenario: player 4, draws 6; banker 5', () => {
        // Player has 4, draws third card (value 6)
        // Banker has 5, player third card is 6 -> banker draws
        expect(shouldBankerDraw(5, 6)).toBe(true);
      });

      it('should handle scenario: player 6, does not draw; banker 5', () => {
        // Player has 6, does not draw
        // Banker has 5, player did not draw -> banker draws
        expect(shouldBankerDraw(5, null)).toBe(true);
      });

      it('should handle scenario: both have naturals', () => {
        // Player has 8 (natural), banker has 9 (natural)
        expect(shouldPlayerDraw(8)).toBe(false);
        expect(shouldBankerDraw(9, null)).toBe(false);
      });

      it('should handle scenario: player natural, banker not', () => {
        // Player has 9 (natural), banker has 5
        // Player doesn't draw (natural), so banker follows standard rules
        expect(shouldPlayerDraw(9)).toBe(false);
        expect(shouldBankerDraw(5, null)).toBe(true); // banker 5, player didn't draw -> banker draws
      });
    });
  });

  describe('Integration: Player and Banker Drawing Logic', () => {
    it('should handle complete game flow: player draws, banker decides', () => {
      const playerScore = 5;
      const playerDraws = shouldPlayerDraw(playerScore);
      expect(playerDraws).toBe(true);

      // If player draws a 7
      const bankerScore = 6;
      const bankerDraws = shouldBankerDraw(bankerScore, 7);
      expect(bankerDraws).toBe(true);
    });

    it('should handle complete game flow: player stands, banker decides', () => {
      const playerScore = 7;
      const playerDraws = shouldPlayerDraw(playerScore);
      expect(playerDraws).toBe(false);

      const bankerScore = 5;
      const bankerDraws = shouldBankerDraw(bankerScore, null);
      expect(bankerDraws).toBe(true);
    });

    it('should handle complete game flow: both have naturals', () => {
      const playerScore = 8;
      const bankerScore = 9;

      expect(shouldPlayerDraw(playerScore)).toBe(false);
      expect(shouldBankerDraw(bankerScore, null)).toBe(false);
    });
  });
});
