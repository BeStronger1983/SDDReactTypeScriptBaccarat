/**
 * 下注倒數計時器元件
 *
 * 顯示下注時間倒數，支援暫停、恢復、進度條顯示
 * 時間到達 0 時會觸發回調函數
 */

import React, { useState, useEffect, useRef } from 'react';
import './BetTimer.css';

export interface BetTimerProps {
  /** 初始秒數 */
  seconds: number;
  /** 時間到達 0 時的回調函數 */
  onTimeUp: () => void;
  /** 標籤文字（可選） */
  label?: string;
  /** 是否暫停 */
  paused?: boolean;
  /** 是否顯示進度條 */
  showProgress?: boolean;
  /** 是否格式化為分:秒 */
  formatMinutes?: boolean;
  /** 自訂樣式類別 */
  className?: string;
}

/**
 * 格式化時間顯示
 */
const formatTime = (seconds: number, formatMinutes: boolean): string => {
  const validSeconds = Math.max(0, Math.floor(seconds));

  if (formatMinutes && validSeconds >= 60) {
    const minutes = Math.floor(validSeconds / 60);
    const secs = validSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  return String(validSeconds);
};

/**
 * 計算 CSS 類別
 */
const getTimerClassName = (timeLeft: number, paused: boolean, className: string): string => {
  const classes = [
    'bet-timer',
    timeLeft <= 0 && 'expired',
    timeLeft > 0 && timeLeft <= 3 && 'danger',
    timeLeft > 3 && timeLeft <= 5 && 'warning',
    paused && 'paused',
    className,
  ];
  return classes.filter(Boolean).join(' ');
};

/**
 * 生成 aria-label
 */
const getAriaLabel = (timeLeft: number, paused: boolean): string => {
  return paused ? `倒數計時器暫停，剩餘 ${timeLeft} 秒` : `倒數計時器，剩餘 ${timeLeft} 秒`;
};

/**
 * 進度條元件
 */
const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="timer-progress-container">
    <div
      className="timer-progress-bar"
      data-testid="timer-progress"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

/**
 * BetTimer 倒數計時器元件
 *
 * @example
 * ```tsx
 * <BetTimer
 *   seconds={15}
 *   onTimeUp={() => console.log('Time up!')}
 *   label="下注時間"
 *   showProgress
 * />
 * ```
 */
export const BetTimer: React.FC<BetTimerProps> = ({
  seconds,
  onTimeUp,
  label,
  paused = false,
  showProgress = false,
  formatMinutes = false,
  className = '',
}) => {
  const initialSeconds = Math.max(0, Math.floor(seconds));
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const hasCalledOnTimeUp = useRef(false);

  // 處理秒數變化時重置
  useEffect(() => {
    setTimeLeft(Math.max(0, Math.floor(seconds)));
    hasCalledOnTimeUp.current = false;
  }, [seconds]);

  // 倒數計時邏輯
  useEffect(() => {
    if (paused || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [paused, timeLeft]);

  // 處理時間到達 0 的情況
  useEffect(() => {
    if (timeLeft === 0 && !hasCalledOnTimeUp.current && onTimeUp) {
      hasCalledOnTimeUp.current = true;
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const progressPercentage = initialSeconds > 0 ? (timeLeft / initialSeconds) * 100 : 0;
  const containerClassName = getTimerClassName(timeLeft, paused, className);
  const ariaLabel = getAriaLabel(timeLeft, paused);

  return (
    <div
      data-testid="bet-timer"
      className={containerClassName}
      role="timer"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {label && (
        <div className="timer-label" data-testid="timer-label">
          {label}
        </div>
      )}

      <div className="timer-display">
        <span className="timer-value">{formatTime(timeLeft, formatMinutes)}</span>
      </div>

      {showProgress && <ProgressBar percentage={progressPercentage} />}
    </div>
  );
};
