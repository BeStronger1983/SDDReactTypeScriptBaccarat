/**
 * 餘額顯示元件
 *
 * 顯示玩家當前餘額，支援格式化、貨幣符號、警告狀態、動畫效果
 */

import React, { useEffect, useState, useRef } from 'react';
import './BalanceDisplay.css';

export interface BalanceDisplayProps {
  /** 餘額金額 */
  balance: number;
  /** 標籤文字 */
  label?: string;
  /** 是否顯示貨幣符號 */
  showCurrency?: boolean;
  /** 貨幣符號 */
  currencySymbol?: string;
  /** 是否使用千分位格式 */
  formatWithCommas?: boolean;
  /** 小數位數 */
  decimals?: number;
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 警告閾值（低於此值顯示警告） */
  warningThreshold?: number;
  /** 是否啟用動畫 */
  animate?: boolean;
  /** 自訂樣式類別 */
  className?: string;
}

/**
 * 驗證並清理餘額數值
 */
const sanitizeBalance = (balance: number): number => {
  if (!Number.isFinite(balance)) {
    return 0;
  }
  return balance;
};

/**
 * 格式化餘額數值
 */
const formatBalance = (
  balance: number,
  decimals: number | undefined,
  formatWithCommas: boolean
): string => {
  const sanitized = sanitizeBalance(balance);

  // 如果未指定小數位數，自動偵測
  let actualDecimals = decimals;
  if (actualDecimals === undefined) {
    const decimalPart = sanitized.toString().split('.')[1];
    actualDecimals = decimalPart ? decimalPart.length : 0;
  }

  const fixed = sanitized.toFixed(actualDecimals);

  if (!formatWithCommas) {
    return fixed;
  }

  // 分離整數和小數部分
  const [integerPart, decimalPart] = fixed.split('.');

  // 為整數部分添加千分位符號
  const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 重新組合
  return decimalPart !== undefined ? `${withCommas}.${decimalPart}` : withCommas;
};

/**
 * 取得餘額狀態類別
 */
const getBalanceStatus = (balance: number): 'positive' | 'zero' | 'negative' => {
  const sanitized = sanitizeBalance(balance);
  if (sanitized > 0) return 'positive';
  if (sanitized < 0) return 'negative';
  return 'zero';
};

/**
 * 取得樣式類別名稱
 */
const getClassNames = (
  balanceStatus: string,
  size: string,
  isWarning: boolean,
  animationClass: string,
  className: string
): string => {
  return ['balance-display', balanceStatus, size, isWarning && 'warning', animationClass, className]
    .filter(Boolean)
    .join(' ');
};

/**
 * 取得 ARIA 標籤
 */
const getAriaLabel = (
  label: string,
  formattedBalance: string,
  showCurrency: boolean,
  currencySymbol: string
): string => {
  return `${label}：${formattedBalance}${showCurrency ? ` ${currencySymbol}` : ''}`;
};

/**
 * BalanceDisplay 餘額顯示元件
 *
 * @example
 * ```tsx
 * <BalanceDisplay
 *   balance={12345.67}
 *   label="我的餘額"
 *   showCurrency
 *   currencySymbol="NT$"
 *   formatWithCommas
 *   decimals={2}
 *   size="large"
 *   warningThreshold={100}
 *   animate
 * />
 * ```
 */
export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  label = '餘額',
  showCurrency = false,
  currencySymbol = '$',
  formatWithCommas = false,
  decimals,
  size = 'medium',
  warningThreshold,
  animate = false,
  className = '',
}) => {
  const [animationClass, setAnimationClass] = useState<'increase' | 'decrease' | ''>('');
  const prevBalanceRef = useRef(balance);

  // 處理餘額變化動畫
  useEffect(() => {
    if (!animate) return;

    const prevBalance = prevBalanceRef.current;
    const currentBalance = sanitizeBalance(balance);
    const prevSanitized = sanitizeBalance(prevBalance);

    if (currentBalance > prevSanitized) {
      setAnimationClass('increase');
      const timer = setTimeout(() => setAnimationClass(''), 1000);
      return () => clearTimeout(timer);
    } else if (currentBalance < prevSanitized) {
      setAnimationClass('decrease');
      const timer = setTimeout(() => setAnimationClass(''), 1000);
      return () => clearTimeout(timer);
    }

    prevBalanceRef.current = balance;
  }, [balance, animate]);

  const sanitized = sanitizeBalance(balance);
  const balanceStatus = getBalanceStatus(balance);
  const formattedBalance = formatBalance(sanitized, decimals, formatWithCommas);
  const isWarning = warningThreshold !== undefined && sanitized < warningThreshold;
  const containerClassName = getClassNames(
    balanceStatus,
    size,
    isWarning,
    animationClass,
    className
  );
  const ariaLabel = getAriaLabel(label, formattedBalance, showCurrency, currencySymbol);

  return (
    <div
      data-testid="balance-display"
      className={containerClassName}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {/* 標籤 */}
      <div className="balance-label">{label}</div>

      {/* 餘額數值 */}
      <div className="balance-amount">
        {showCurrency && <span className="currency-symbol">{currencySymbol}</span>}
        <span className="balance-value" data-testid="balance-value">
          {formattedBalance}
        </span>
      </div>
    </div>
  );
};
