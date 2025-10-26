import React from 'react';
import styles from './Chip.module.css';

export interface ChipProps {
  value: number;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: (value: number) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}

const getChipColorClass = (value: number): string => {
  if (value >= 1000) return styles['chip-1000'] ?? '';
  if (value >= 500) return styles['chip-500'] ?? '';
  if (value >= 100) return styles['chip-100'] ?? '';
  if (value >= 50) return styles['chip-50'] ?? '';
  return styles['chip-10'] ?? '';
};

/**
 * Chip component for betting chip selection
 *
 * Supports different values, selected state, and disabled state.
 *
 * @example
 * <Chip value={100} onClick={(value) => selectChip(value)} />
 * <Chip value={100} selected />
 * <Chip value={1000} disabled />
 */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      value,
      label,
      selected = false,
      disabled = false,
      size = 'medium',
      className = '',
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const displayLabel = label ?? String(value);
    const chipColorClass = getChipColorClass(value);

    const handleClick = (): void => {
      if (!disabled && onClick) {
        onClick(value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    const classNames = [
      styles.chip,
      styles[size],
      chipColorClass,
      selected && styles.selected,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        className={classNames}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        data-testid="chip"
        role="button"
        aria-label={`Chip value ${value}`}
        aria-pressed={selected}
        aria-disabled={disabled}
      >
        <span className={styles.label}>{displayLabel}</span>
      </button>
    );
  }
);

Chip.displayName = 'Chip';
