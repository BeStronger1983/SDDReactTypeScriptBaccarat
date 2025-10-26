/**
 * 標題元件
 *
 * 顯示遊戲標題、餘額資訊和操作按鈕
 */

import React, { useState } from 'react';
import { BalanceDisplay } from './BalanceDisplay';
import './Header.css';

export interface HeaderProps {
  /** 遊戲標題 */
  title?: string;
  /** 玩家餘額 */
  balance: number;
  /** 是否顯示貨幣符號 */
  showCurrency?: boolean;
  /** 貨幣符號 */
  currencySymbol?: string;
  /** 是否使用千分位格式 */
  formatBalanceWithCommas?: boolean;
  /** 餘額小數位數 */
  balanceDecimals?: number;
  /** 是否顯示選單按鈕 */
  showMenu?: boolean;
  /** 是否顯示資訊按鈕 */
  showInfo?: boolean;
  /** 選單按鈕點擊回調 */
  onMenuClick?: () => void;
  /** 資訊按鈕點擊回調 */
  onInfoClick?: () => void;
  /** 是否固定定位 */
  fixed?: boolean;
  /** 是否顯示陰影 */
  shadow?: boolean;
  /** 是否透明背景 */
  transparent?: boolean;
  /** 自訂樣式類別 */
  className?: string;
}

/**
 * 取得樣式類別名稱
 */
const getHeaderClassNames = (
  fixed: boolean,
  shadow: boolean,
  transparent: boolean,
  className: string
): string => {
  return ['header', fixed && 'fixed', shadow && 'shadow', transparent && 'transparent', className]
    .filter(Boolean)
    .join(' ');
};

/**
 * 取得按鈕樣式類別名稱
 */
const getButtonClassNames = (hover: boolean, active: boolean): string => {
  return ['header-button', hover && 'hover', active && 'active'].filter(Boolean).join(' ');
};

/**
 * 選單按鈕元件
 */
const MenuButton: React.FC<{
  className: string;
  onClick?: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}> = ({ className, onClick, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp }) => (
  <button
    data-testid="menu-button"
    className={className}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    aria-label="開啟選單"
    type="button"
  >
    ☰
  </button>
);

/**
 * 資訊按鈕元件
 */
const InfoButton: React.FC<{
  className: string;
  onClick?: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}> = ({ className, onClick, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp }) => (
  <button
    data-testid="info-button"
    className={className}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    aria-label="顯示資訊"
    type="button"
  >
    ℹ
  </button>
);

interface HeaderLeftProps {
  showMenu: boolean;
  menuButtonClassName: string;
  onMenuClick?: () => void;
  setMenuHover: (hover: boolean) => void;
  setMenuActive: (active: boolean) => void;
}

const HeaderLeft: React.FC<HeaderLeftProps> = ({
  showMenu,
  menuButtonClassName,
  onMenuClick,
  setMenuHover,
  setMenuActive,
}) => (
  <div className="header-left" data-testid="header-left">
    {showMenu && (
      <MenuButton
        className={menuButtonClassName}
        onClick={onMenuClick}
        onMouseEnter={() => setMenuHover(true)}
        onMouseLeave={() => setMenuHover(false)}
        onMouseDown={() => setMenuActive(true)}
        onMouseUp={() => setMenuActive(false)}
      />
    )}
  </div>
);

const HeaderCenter: React.FC<{ title: string }> = ({ title }) => (
  <div className="header-center" data-testid="header-center">
    <h1 className="header-title" data-testid="header-title">
      {title}
    </h1>
  </div>
);

interface HeaderRightProps {
  balance: number;
  showCurrency: boolean;
  currencySymbol: string;
  formatBalanceWithCommas: boolean;
  balanceDecimals?: number;
  showInfo: boolean;
  infoButtonClassName: string;
  onInfoClick?: () => void;
  setInfoHover: (hover: boolean) => void;
  setInfoActive: (active: boolean) => void;
}

const HeaderRight: React.FC<HeaderRightProps> = ({
  balance,
  showCurrency,
  currencySymbol,
  formatBalanceWithCommas,
  balanceDecimals,
  showInfo,
  infoButtonClassName,
  onInfoClick,
  setInfoHover,
  setInfoActive,
}) => (
  <div className="header-right" data-testid="header-right">
    <BalanceDisplay
      balance={balance}
      showCurrency={showCurrency}
      currencySymbol={currencySymbol}
      formatWithCommas={formatBalanceWithCommas}
      decimals={balanceDecimals}
      size="small"
    />
    {showInfo && (
      <InfoButton
        className={infoButtonClassName}
        onClick={onInfoClick}
        onMouseEnter={() => setInfoHover(true)}
        onMouseLeave={() => setInfoHover(false)}
        onMouseDown={() => setInfoActive(true)}
        onMouseUp={() => setInfoActive(false)}
      />
    )}
  </div>
);

/**
 * 按鈕狀態管理 Hook
 */
const useButtonState = () => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return {
    hover,
    active,
    setHover,
    setActive,
    className: getButtonClassNames(hover, active),
  };
};

/**
 * Header 內部實作
 */
const HeaderImpl: React.FC<{
  title: string;
  balance: number;
  showCurrency: boolean;
  currencySymbol: string;
  formatBalanceWithCommas: boolean;
  balanceDecimals?: number;
  showMenu: boolean;
  showInfo: boolean;
  onMenuClick?: () => void;
  onInfoClick?: () => void;
  headerClassName: string;
}> = ({
  title,
  balance,
  showCurrency,
  currencySymbol,
  formatBalanceWithCommas,
  balanceDecimals,
  showMenu,
  showInfo,
  onMenuClick,
  onInfoClick,
  headerClassName,
}) => {
  const menuButton = useButtonState();
  const infoButton = useButtonState();

  return (
    <header data-testid="header" className={headerClassName} role="banner">
      <HeaderLeft
        showMenu={showMenu}
        menuButtonClassName={menuButton.className}
        onMenuClick={onMenuClick}
        setMenuHover={menuButton.setHover}
        setMenuActive={menuButton.setActive}
      />
      <HeaderCenter title={title} />
      <HeaderRight
        balance={balance}
        showCurrency={showCurrency}
        currencySymbol={currencySymbol}
        formatBalanceWithCommas={formatBalanceWithCommas}
        balanceDecimals={balanceDecimals}
        showInfo={showInfo}
        infoButtonClassName={infoButton.className}
        onInfoClick={onInfoClick}
        setInfoHover={infoButton.setHover}
        setInfoActive={infoButton.setActive}
      />
    </header>
  );
};

/**
 * Header 標題元件預設值
 */
const DEFAULT_PROPS = {
  title: '遊戲',
  showCurrency: false,
  currencySymbol: '$',
  formatBalanceWithCommas: false,
  showMenu: false,
  showInfo: false,
  fixed: false,
  shadow: false,
  transparent: false,
  className: '',
};

/**
 * Header 標題元件
 *
 * @example
 * ```tsx
 * <Header
 *   title="百家樂遊戲"
 *   balance={12345.67}
 *   showCurrency
 *   currencySymbol="NT$"
 *   formatBalanceWithCommas
 *   balanceDecimals={2}
 *   showMenu
 *   showInfo
 *   onMenuClick={() => console.log('Menu clicked')}
 *   onInfoClick={() => console.log('Info clicked')}
 *   shadow
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = (props) => {
  const mergedProps = { ...DEFAULT_PROPS, ...props };
  const headerClassName = getHeaderClassNames(
    mergedProps.fixed,
    mergedProps.shadow,
    mergedProps.transparent,
    mergedProps.className
  );

  return (
    <HeaderImpl
      title={mergedProps.title}
      balance={mergedProps.balance}
      showCurrency={mergedProps.showCurrency}
      currencySymbol={mergedProps.currencySymbol}
      formatBalanceWithCommas={mergedProps.formatBalanceWithCommas}
      balanceDecimals={mergedProps.balanceDecimals}
      showMenu={mergedProps.showMenu}
      showInfo={mergedProps.showInfo}
      onMenuClick={mergedProps.onMenuClick}
      onInfoClick={mergedProps.onInfoClick}
      headerClassName={headerClassName}
    />
  );
};
