/**
 * 籌碼選擇器元件
 *
 * 提供百家樂遊戲的籌碼選擇功能，包含五種面額（10, 50, 100, 500, 1000）
 * 支援點擊和鍵盤操作，顯示當前選中的籌碼
 */

import React from 'react';
import { Chip } from '@/components/ui/Chip';
import { CHIP_VALUES, type ChipValue } from '@/types/game';
import './ChipSelector.css';

export interface ChipSelectorProps {
  /** 當前選中的籌碼值 */
  selectedValue: ChipValue;
  /** 選擇籌碼時的回調函數 */
  onSelect: (value: ChipValue) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自訂樣式類別 */
  className?: string;
}

/**
 * ChipSelector 籌碼選擇器元件
 *
 * @example
 * ```tsx
 * const [selectedChip, setSelectedChip] = useState(100);
 *
 * <ChipSelector
 *   selectedValue={selectedChip}
 *   onSelect={(value) => setSelectedChip(value)}
 * />
 * ```
 */
export const ChipSelector: React.FC<ChipSelectorProps> = ({
  selectedValue,
  onSelect,
  disabled = false,
  className = '',
}) => {
  // 處理籌碼點擊
  const handleChipClick = (value: ChipValue): void => {
    if (!disabled && onSelect) {
      onSelect(value);
    }
  };

  // 處理鍵盤事件
  const handleKeyDown =
    (value: ChipValue) =>
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (disabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleChipClick(value);
      }
    };

  // 組合 CSS 類別
  const containerClassName = ['chip-selector', disabled && 'disabled', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      data-testid="chip-selector"
      className={containerClassName}
      role="group"
      aria-label="籌碼選擇器"
      aria-disabled={disabled}
    >
      {CHIP_VALUES.map((value) => {
        const isSelected = selectedValue === value;
        const chipWrapperClassName = [
          'chip-wrapper',
          isSelected && 'selected',
          disabled && 'disabled',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={value}
            data-testid={`chip-${value}`}
            className={chipWrapperClassName}
            onClick={() => handleChipClick(value)}
            onKeyDown={handleKeyDown(value)}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={`${value} 元籌碼${isSelected ? '，已選中' : ''}`}
          >
            <Chip
              value={value}
              selected={isSelected}
              disabled={disabled}
              onClick={handleChipClick}
            />
          </div>
        );
      })}
    </div>
  );
};
