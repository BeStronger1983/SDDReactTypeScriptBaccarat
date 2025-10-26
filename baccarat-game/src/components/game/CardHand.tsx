/**
 * 手牌顯示元件
 *
 * 顯示百家樂遊戲中莊家或閒家的手牌，包括牌面、分數和天牌指示
 * 支援 2-3 張牌的顯示，以及牌面朝上/朝下狀態
 */

import React from 'react';
import { Card } from '@/components/ui/Card';
import type { Hand, Card as CardType } from '@/types/game';
import './CardHand.css';

export interface CardHandProps {
  /** 手牌資料 */
  hand: Hand;
  /** 標籤（閒家/莊家） */
  label: string;
  /** 是否顯示分數 */
  showScore?: boolean;
  /** 是否牌面朝下 */
  faceDown?: boolean;
  /** 自訂樣式類別 */
  className?: string;
}

/**
 * 生成 aria-label
 */
const generateAriaLabel = (
  label: string,
  cardsCount: number,
  score: number,
  isNatural: boolean,
  showScore: boolean
): string => {
  if (showScore) {
    return `${label}手牌，${cardsCount} 張牌，${score} 點${isNatural ? '，天牌' : ''}`;
  }
  return `${label}手牌，${cardsCount} 張牌`;
};

/**
 * 渲染單張牌
 */
const CardWrapper: React.FC<{ card: CardType; index: number; faceDown: boolean }> = ({
  card,
  index,
  faceDown,
}) => (
  <div key={`${card.suit}-${card.rank}-${index}`} className="card-wrapper">
    <Card card={card} faceDown={faceDown} size="medium" />
  </div>
);

/**
 * 標題區域元件
 */
const HandHeader: React.FC<{ label: string; showScore: boolean; isNatural: boolean }> = ({
  label,
  showScore,
  isNatural,
}) => (
  <div className="card-hand-header">
    <span className="card-hand-label">{label}</span>
    {showScore && isNatural && <span className="natural-indicator">天牌</span>}
  </div>
);

/**
 * 牌組容器元件
 */
const CardsContainer: React.FC<{ cards: CardType[]; faceDown: boolean }> = ({
  cards,
  faceDown,
}) => (
  <div className="cards-container" data-testid="cards-container">
    {cards.map((card, index) => (
      <CardWrapper
        key={`${card.suit}-${card.rank}-${index}`}
        card={card}
        index={index}
        faceDown={faceDown}
      />
    ))}
  </div>
);

/**
 * 分數顯示元件
 */
const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => (
  <div className="card-hand-score" data-testid="hand-score">
    <span className="score-value">{score}</span>
  </div>
);

/**
 * CardHand 手牌顯示元件
 *
 * @example
 * ```tsx
 * const playerHand: Hand = {
 *   cards: [
 *     { suit: 'hearts', rank: '7' },
 *     { suit: 'diamonds', rank: '3' }
 *   ],
 *   score: 0,
 *   isNatural: false
 * };
 *
 * <CardHand
 *   hand={playerHand}
 *   label="閒家"
 *   showScore={true}
 * />
 * ```
 */
export const CardHand: React.FC<CardHandProps> = ({
  hand,
  label,
  showScore = false,
  faceDown = false,
  className = '',
}) => {
  // 處理未提供 hand 的情況
  if (!hand) {
    return null;
  }

  const { cards = [], score = 0, isNatural = false } = hand;
  const displayScore = Math.max(0, Math.min(9, score));
  const containerClassName = ['card-hand', isNatural && 'natural', className]
    .filter(Boolean)
    .join(' ');
  const ariaLabel = generateAriaLabel(label, cards.length, displayScore, isNatural, showScore);

  return (
    <div
      data-testid="card-hand"
      className={containerClassName}
      role="region"
      aria-label={ariaLabel}
    >
      <HandHeader label={label} showScore={showScore} isNatural={isNatural} />
      <CardsContainer cards={cards} faceDown={faceDown} />
      {showScore && <ScoreDisplay score={displayScore} />}
    </div>
  );
};
