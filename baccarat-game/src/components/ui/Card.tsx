import React from 'react';
import type { Card as CardType } from '@/types/game';
import styles from './Card.module.css';

export interface CardProps {
  card: CardType;
  faceDown?: boolean;
  flip?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
} as const;

const RANK_LABELS = {
  A: 'Ace',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  J: 'Jack',
  Q: 'Queen',
  K: 'King',
} as const;

const CardBack: React.FC = () => (
  <div className={styles.cardBack} data-testid="card-back">
    <div className={styles.backPattern} />
  </div>
);

interface CardFrontProps {
  rank: CardType['rank'];
  suitSymbol: string;
}

const CardFront: React.FC<CardFrontProps> = ({ rank, suitSymbol }) => (
  <div className={styles.cardFront}>
    <div className={styles.corner}>
      <div className={styles.rank}>{rank}</div>
      <div className={styles.suit}>{suitSymbol}</div>
    </div>
    <div className={styles.center}>
      <div className={styles.suitLarge}>{suitSymbol}</div>
    </div>
    <div className={`${styles.corner} ${styles.cornerBottom}`}>
      <div className={styles.rank}>{rank}</div>
      <div className={styles.suit}>{suitSymbol}</div>
    </div>
  </div>
);

/**
 * Card component for displaying playing cards
 *
 * Supports face up/down states, flip animation, and different sizes.
 *
 * @example
 * <Card card={{ suit: 'hearts', rank: 'A' }} />
 * <Card card={{ suit: 'spades', rank: 'K' }} faceDown />
 * <Card card={{ suit: 'diamonds', rank: '7' }} flip size="large" />
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  // eslint-disable-next-line complexity
  ({ card, faceDown = false, flip = false, size = 'medium', className = '' }, ref) => {
    const { suit, rank } = card;
    const isRed = suit === 'hearts' || suit === 'diamonds';
    const suitSymbol = SUIT_SYMBOLS[suit];
    const rankLabel = RANK_LABELS[rank];

    const colorClass = isRed ? styles.red : styles.black;
    const faceDownClass = faceDown ? styles['face-down'] : '';
    const flipClass = flip ? styles.flip : '';

    const classNames = [styles.card, styles[size], colorClass, faceDownClass, flipClass, className]
      .filter(Boolean)
      .join(' ');

    const ariaLabel = faceDown ? 'Card face down' : `${rankLabel} of ${suit}`;

    return (
      <div ref={ref} className={classNames} data-testid="card" aria-label={ariaLabel}>
        {faceDown ? <CardBack /> : <CardFront rank={rank} suitSymbol={suitSymbol} />}
      </div>
    );
  }
);

Card.displayName = 'Card';
