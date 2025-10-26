/**
 * 下注區域元件
 *
 * 提供百家樂遊戲的下注區域，包括閒家、莊家和和局三種投注選項
 * 顯示當前下注金額、賠率資訊，並支援點擊和鍵盤操作
 */

import React from 'react';
import type { Bet } from '@/types/game';
import './BettingArea.css';

export interface BettingAreaProps {
  /** 下注區域類型：player（閒家）、banker（莊家）、tie（和局） */
  type: keyof Bet;
  /** 當前下注金額 */
  amount: number;
  /** 下注回調函數，傳入籌碼值 */
  onBet: (chipValue: number) => void;
  /** 當前選中的籌碼值（可選） */
  chipValue?: number;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 區域標籤對照表
 */
const AREA_LABELS: Record<keyof Bet, string> = {
  player: '閒家',
  banker: '莊家',
  tie: '和局',
};

/**
 * 賠率對照表
 */
const PAYOUT_RATES: Record<keyof Bet, string> = {
  player: '1:1',
  banker: '1:0.95',
  tie: '1:8',
};

/**
 * BettingArea 下注區域元件
 *
 * @example
 * ```tsx
 * <BettingArea
 *   type="player"
 *   amount={100}
 *   onBet={(value) => handleBet('player', value)}
 *   chipValue={50}
 * />
 * ```
 */
export const BettingArea: React.FC<BettingAreaProps> = ({
  type,
  amount,
  onBet,
  chipValue = 0,
  disabled = false,
}) => {
  const label = AREA_LABELS[type];
  const payoutRate = PAYOUT_RATES[type];

  // 處理點擊事件
  const handleClick = (): void => {
    if (!disabled && onBet) {
      onBet(chipValue);
    }
  };

  // 處理鍵盤事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // 組合 CSS 類別
  const classNames = ['betting-area', type, amount > 0 && 'has-bet', disabled && 'disabled']
    .filter(Boolean)
    .join(' ');

  // 生成 aria-label
  const ariaLabel = `${label}下注區域，當前金額 ${amount} 元，賠率 ${payoutRate}`;

  // 處理負數金額（顯示為 0）
  const displayAmount = amount < 0 ? 0 : amount;

  return (
    <div
      data-testid={`betting-area-${type}`}
      className={classNames}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <div className="betting-area-header">
        <span className="betting-area-label">{label}</span>
        <span className="betting-area-payout">{payoutRate}</span>
      </div>

      <div className="betting-area-amount">
        <span className="amount-value">{displayAmount}</span>
      </div>

      {amount > 0 && (
        <div className="betting-area-indicator" aria-hidden="true">
          <span className="indicator-dot"></span>
        </div>
      )}
    </div>
  );
};
