import { useReducer, useCallback } from 'react';
import type { GamePhase, Hand, Card, GameOutcome, Bet, GameResult } from '@/types/game';
import { calculateScore } from '@/utils/cardUtils';

interface GameState {
  phase: GamePhase;
  playerHand: Hand;
  bankerHand: Hand;
  timer: number;
  lastResult: GameResult | null;
}

type GameAction =
  | { type: 'START_DEALING' }
  | { type: 'COMPLETE_DEALING' }
  | { type: 'START_DRAWING' }
  | { type: 'COMPLETE_DRAWING' }
  | { type: 'CALCULATE_RESULT'; payload: { outcome: GameOutcome; payout: number; bets?: Bet } }
  | { type: 'SHOW_RESULT' }
  | { type: 'START_NEW_ROUND' }
  | { type: 'RESET' }
  | { type: 'SET_PLAYER_HAND'; payload: Card[] }
  | { type: 'SET_BANKER_HAND'; payload: Card[] }
  | { type: 'SET_TIMER'; payload: number }
  | { type: 'DECREMENT_TIMER' };

const initialState: GameState = {
  phase: 'betting',
  playerHand: { cards: [], score: 0, isNatural: false },
  bankerHand: { cards: [], score: 0, isNatural: false },
  timer: 0,
  lastResult: null,
};

function createHand(cards: Card[]): Hand {
  const score = calculateScore(cards);
  const isNatural = cards.length === 2 && (score === 8 || score === 9);

  return {
    cards,
    score,
    isNatural,
  };
}

/* eslint-disable complexity */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_DEALING':
      if (state.phase !== 'betting') return state;
      return { ...state, phase: 'dealing' };

    case 'COMPLETE_DEALING':
      if (state.phase !== 'dealing') return state;
      return { ...state, phase: 'drawing' };

    case 'START_DRAWING':
      if (state.phase !== 'drawing') return state;
      return state;

    case 'COMPLETE_DRAWING':
      if (state.phase !== 'drawing') return state;
      return { ...state, phase: 'calculating' };

    case 'CALCULATE_RESULT': {
      if (state.phase !== 'calculating') return state;

      const { outcome, payout, bets } = action.payload;

      const result: GameResult = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString(),
        outcome,
        playerHand: state.playerHand,
        bankerHand: state.bankerHand,
        bets: bets ?? { player: 0, banker: 0, tie: 0 },
        payout,
      };

      return {
        ...state,
        phase: 'result',
        lastResult: result,
      };
    }

    case 'SHOW_RESULT':
      if (state.phase !== 'result') return state;
      return state;

    case 'START_NEW_ROUND':
      if (state.phase !== 'result') return state;
      return {
        ...state,
        phase: 'betting',
        playerHand: { cards: [], score: 0, isNatural: false },
        bankerHand: { cards: [], score: 0, isNatural: false },
        timer: 0,
      };

    case 'RESET':
      return initialState;

    case 'SET_PLAYER_HAND':
      return {
        ...state,
        playerHand: createHand(action.payload),
      };

    case 'SET_BANKER_HAND':
      return {
        ...state,
        bankerHand: createHand(action.payload),
      };

    case 'SET_TIMER':
      return {
        ...state,
        timer: action.payload,
      };

    case 'DECREMENT_TIMER':
      return {
        ...state,
        timer: Math.max(0, state.timer - 1),
      };

    default:
      return state;
  }
}

interface UseGameStateReturn {
  phase: GamePhase;
  playerHand: Hand;
  bankerHand: Hand;
  timer: number;
  lastResult: GameResult | null;
  startDealing: () => void;
  completeDealing: () => void;
  startDrawing: () => void;
  completeDrawing: () => void;
  calculateResult: (outcome: GameOutcome, payout: number, bets?: Bet) => void;
  showResult: () => void;
  startNewRound: () => void;
  reset: () => void;
  setPlayerHand: (cards: Card[]) => void;
  setBankerHand: (cards: Card[]) => void;
  setTimer: (value: number) => void;
  decrementTimer: () => void;
}

export function useGameState(): UseGameStateReturn {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startDealing = useCallback(() => {
    dispatch({ type: 'START_DEALING' });
  }, []);

  const completeDealing = useCallback(() => {
    dispatch({ type: 'COMPLETE_DEALING' });
  }, []);

  const startDrawing = useCallback(() => {
    dispatch({ type: 'START_DRAWING' });
  }, []);

  const completeDrawing = useCallback(() => {
    dispatch({ type: 'COMPLETE_DRAWING' });
  }, []);

  const calculateResult = useCallback((outcome: GameOutcome, payout: number, bets?: Bet) => {
    dispatch({ type: 'CALCULATE_RESULT', payload: { outcome, payout, bets } });
  }, []);

  const showResult = useCallback(() => {
    dispatch({ type: 'SHOW_RESULT' });
  }, []);

  const startNewRound = useCallback(() => {
    dispatch({ type: 'START_NEW_ROUND' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setPlayerHand = useCallback((cards: Card[]) => {
    dispatch({ type: 'SET_PLAYER_HAND', payload: cards });
  }, []);

  const setBankerHand = useCallback((cards: Card[]) => {
    dispatch({ type: 'SET_BANKER_HAND', payload: cards });
  }, []);

  const setTimer = useCallback((value: number) => {
    dispatch({ type: 'SET_TIMER', payload: value });
  }, []);

  const decrementTimer = useCallback(() => {
    dispatch({ type: 'DECREMENT_TIMER' });
  }, []);

  return {
    phase: state.phase,
    playerHand: state.playerHand,
    bankerHand: state.bankerHand,
    timer: state.timer,
    lastResult: state.lastResult,
    startDealing,
    completeDealing,
    startDrawing,
    completeDrawing,
    calculateResult,
    showResult,
    startNewRound,
    reset,
    setPlayerHand,
    setBankerHand,
    setTimer,
    decrementTimer,
  };
}
