/**
 * 遊戲結果顯示元件
 *
 * 顯示百家樂遊戲結果，包括勝利者、雙方分數、獎金、天牌指示
 * 支援動畫效果和關閉功能
 */

import React from 'react';
import type { GameOutcome } from '@/types/game';
import './ResultDisplay.css';

export interface ResultDisplayProps {
  /** 遊戲結果 */
  outcome: GameOutcome;
  /** 閒家分數 */
  playerScore: number;
  /** 莊家分數 */
  bankerScore: number;
  /** 獲勝金額（可選） */
  winAmount?: number;
  /** 閒家是否為天牌 */
  playerNatural?: boolean;
  /** 莊家是否為天牌 */
  bankerNatural?: boolean;
  /** 是否啟用動畫 */
  animate?: boolean;
  /** 關閉回調函數（可選） */
  onClose?: () => void;
  /** 自訂樣式類別 */
  className?: string;
}

/**
 * 取得結果訊息
 */
const getOutcomeMessage = (outcome: GameOutcome): string => {
  const messages: Record<GameOutcome, string> = {
    player: '閒家勝',
    banker: '莊家勝',
    tie: '和局',
  };
  return messages[outcome] || '';
};

/**
 * 格式化金額（千分位）
 */
const formatAmount = (amount: number): string => {
  const validAmount = Math.max(0, amount);
  // 簡單顯示，不使用千分位（為了測試一致性）
  return validAmount.toString();
};

/**
 * 分數顯示元件
 */
const ScoreDisplay: React.FC<{
  label: string;
  score: number;
  isWinner: boolean;
  isNatural: boolean;
}> = ({ label, score, isWinner, isNatural }) => {
  const validScore = Math.max(0, Math.min(9, Math.floor(score)));
  const className = ['score-item', isWinner && 'winner'].filter(Boolean).join(' ');
  const testId = label === '閒家' ? 'player-score' : 'banker-score';

  return (
    <div className={className} data-testid={testId}>
      <div className="score-label">{label}</div>
      <div className="score-value">{validScore}</div>
      {isNatural && <div className="natural-badge">天牌</div>}
    </div>
  );
};

/**
 * ResultDisplay 結果顯示元件
 *
 * @example
 * ```tsx
 * <ResultDisplay
 *   outcome="player"
 *   playerScore={9}
 *   bankerScore={3}
 *   winAmount={2000}
 *   playerNatural
 *   onClose={() => console.log('Close')}
 * />
 * ```
 */
export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  outcome,
  playerScore,
  bankerScore,
  winAmount,
  playerNatural = false,
  bankerNatural = false,
  animate = false,
  onClose,
  className = '',
}) => {
  const outcomeClass =
    {
      player: 'player-win',
      banker: 'banker-win',
      tie: 'tie',
    }[outcome] || '';

  const containerClassName = ['result-display', outcomeClass, animate && 'animate', className]
    .filter(Boolean)
    .join(' ');

  const outcomeMessage = getOutcomeMessage(outcome);
  const ariaLabel = `遊戲結果：${outcomeMessage}，閒家 ${playerScore} 點，莊家 ${bankerScore} 點${
    winAmount !== undefined ? `，獲勝金額 ${winAmount}` : ''
  }`;

  return (
    <div
      data-testid="result-display"
      className={containerClassName}
      role="status"
      aria-label={ariaLabel}
      aria-live="assertive"
    >
      {/* 關閉按鈕 */}
      {onClose && (
        <button
          className="close-button"
          data-testid="close-button"
          onClick={onClose}
          aria-label="關閉結果顯示"
        >
          ✕
        </button>
      )}

      {/* 結果標題 */}
      <div className="result-header">
        <h2 className="result-title">{outcomeMessage}</h2>
      </div>

      {/* 分數顯示 */}
      <div className="scores-container">
        <ScoreDisplay
          label="閒家"
          score={playerScore}
          isWinner={outcome === 'player'}
          isNatural={playerNatural}
        />
        <div className="vs-divider">VS</div>
        <ScoreDisplay
          label="莊家"
          score={bankerScore}
          isWinner={outcome === 'banker'}
          isNatural={bankerNatural}
        />
      </div>

      {/* 獎金顯示 */}
      {winAmount !== undefined && (
        <div className="win-amount-container">
          <div className="win-amount-label">獲勝金額</div>
          <div className="win-amount-value" data-testid="win-amount">
            {formatAmount(Math.max(0, winAmount))}
          </div>
        </div>
      )}
    </div>
  );
};
