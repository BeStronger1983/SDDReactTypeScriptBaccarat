import { useState, useCallback, useMemo } from 'react';

export interface Bet {
  player: number;
  banker: number;
  tie: number;
}

export type BetArea = 'player' | 'banker' | 'tie';

export function useBetting() {
  const [bets, setBets] = useState<Bet>({
    player: 0,
    banker: 0,
    tie: 0,
  });

  const totalBet = useMemo(() => {
    return bets.player + bets.banker + bets.tie;
  }, [bets]);

  const placeBet = useCallback(
    (area: BetArea, amount: number, canAfford?: (amount: number) => boolean): boolean => {
      if (!['player', 'banker', 'tie'].includes(area)) {
        return false;
      }

      if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
        return false;
      }

      if (amount <= 0) {
        return false;
      }

      if (canAfford && !canAfford(amount)) {
        return false;
      }

      setBets((prevBets) => ({
        ...prevBets,
        [area]: Math.round((prevBets[area] + amount) * 100) / 100,
      }));

      return true;
    },
    []
  );

  const clearBets = useCallback(() => {
    setBets({
      player: 0,
      banker: 0,
      tie: 0,
    });
  }, []);

  const clearBet = useCallback((area: BetArea) => {
    if (!['player', 'banker', 'tie'].includes(area)) {
      return;
    }

    setBets((prevBets) => ({
      ...prevBets,
      [area]: 0,
    }));
  }, []);

  const hasBets = useCallback(
    (area?: BetArea): boolean => {
      if (area === undefined) {
        return bets.player > 0 || bets.banker > 0 || bets.tie > 0;
      }

      if (!['player', 'banker', 'tie'].includes(area)) {
        return false;
      }

      return bets[area] > 0;
    },
    [bets]
  );

  return {
    bets,
    totalBet,
    placeBet,
    clearBets,
    clearBet,
    hasBets,
  };
}
