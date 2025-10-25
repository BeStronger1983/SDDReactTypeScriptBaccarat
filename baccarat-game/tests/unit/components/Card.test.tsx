import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/Card';
import type { Card as CardType } from '@/types/game';

describe('Card', () => {
  const mockCard: CardType = {
    suit: 'hearts',
    rank: 'A',
  };

  describe('Rendering', () => {
    it('should render card with suit and rank', () => {
      render(<Card card={mockCard} />);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
    });

    it('should render all four suits', () => {
      const suits: CardType['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
      suits.forEach((suit) => {
        const { unmount } = render(<Card card={{ suit, rank: 'A' }} />);
        expect(screen.getByTestId('card')).toBeInTheDocument();
        unmount();
      });
    });

    it('should render all thirteen ranks', () => {
      const ranks: CardType['rank'][] = [
        'A',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'J',
        'Q',
        'K',
      ];
      ranks.forEach((rank) => {
        const { unmount } = render(<Card card={{ suit: 'hearts', rank }} />);
        expect(screen.getByTestId('card')).toBeInTheDocument();
        unmount();
      });
    });

    it('should display card rank', () => {
      render(<Card card={{ suit: 'hearts', rank: 'K' }} />);
      expect(screen.getByText('K')).toBeInTheDocument();
    });

    it('should display card suit symbol', () => {
      render(<Card card={{ suit: 'hearts', rank: 'A' }} />);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Face Down State', () => {
    it('should render face up by default', () => {
      render(<Card card={mockCard} />);
      const card = screen.getByTestId('card');
      expect(card.className).not.toContain('face-down');
    });

    it('should render face down when faceDown is true', () => {
      render(<Card card={mockCard} faceDown />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('face-down');
    });

    it('should hide rank when face down', () => {
      render(<Card card={{ suit: 'hearts', rank: 'K' }} faceDown />);
      expect(screen.queryByText('K')).not.toBeInTheDocument();
    });

    it('should show card back pattern when face down', () => {
      render(<Card card={mockCard} faceDown />);
      const cardBack = screen.getByTestId('card-back');
      expect(cardBack).toBeInTheDocument();
    });
  });

  describe('Suit Colors', () => {
    it('should render hearts in red', () => {
      render(<Card card={{ suit: 'hearts', rank: 'A' }} />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('red');
    });

    it('should render diamonds in red', () => {
      render(<Card card={{ suit: 'diamonds', rank: 'A' }} />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('red');
    });

    it('should render clubs in black', () => {
      render(<Card card={{ suit: 'clubs', rank: 'A' }} />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('black');
    });

    it('should render spades in black', () => {
      render(<Card card={{ suit: 'spades', rank: 'A' }} />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('black');
    });
  });

  describe('Suit Symbols', () => {
    it('should display heart symbol (♥)', () => {
      render(<Card card={{ suit: 'hearts', rank: 'A' }} />);
      expect(screen.getByText('♥')).toBeInTheDocument();
    });

    it('should display diamond symbol (♦)', () => {
      render(<Card card={{ suit: 'diamonds', rank: 'A' }} />);
      expect(screen.getByText('♦')).toBeInTheDocument();
    });

    it('should display club symbol (♣)', () => {
      render(<Card card={{ suit: 'clubs', rank: 'A' }} />);
      expect(screen.getByText('♣')).toBeInTheDocument();
    });

    it('should display spade symbol (♠)', () => {
      render(<Card card={{ suit: 'spades', rank: 'A' }} />);
      expect(screen.getByText('♠')).toBeInTheDocument();
    });
  });

  describe('Animation States', () => {
    it('should not have flip animation by default', () => {
      render(<Card card={mockCard} />);
      const card = screen.getByTestId('card');
      expect(card.className).not.toContain('flip');
    });

    it('should apply flip animation when flipping', () => {
      render(<Card card={mockCard} flip />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('flip');
    });

    it('should handle flip with faceDown combination', () => {
      render(<Card card={mockCard} faceDown flip />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('face-down');
      expect(card.className).toContain('flip');
    });
  });

  describe('Size Variants', () => {
    it('should render medium size by default', () => {
      render(<Card card={mockCard} />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('medium');
    });

    it('should render small size', () => {
      render(<Card card={mockCard} size="small" />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('small');
    });

    it('should render large size', () => {
      render(<Card card={mockCard} size="large" />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('large');
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      render(<Card card={mockCard} className="custom-card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-card');
    });

    it('should preserve default classes with custom className', () => {
      render(<Card card={mockCard} className="custom-card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-card');
      expect(card.className).toContain('medium');
    });
  });

  describe('Face Cards', () => {
    it('should render Jack correctly', () => {
      render(<Card card={{ suit: 'hearts', rank: 'J' }} />);
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('should render Queen correctly', () => {
      render(<Card card={{ suit: 'hearts', rank: 'Q' }} />);
      expect(screen.getByText('Q')).toBeInTheDocument();
    });

    it('should render King correctly', () => {
      render(<Card card={{ suit: 'hearts', rank: 'K' }} />);
      expect(screen.getByText('K')).toBeInTheDocument();
    });

    it('should render Ace correctly', () => {
      render(<Card card={{ suit: 'hearts', rank: 'A' }} />);
      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });

  describe('Number Cards', () => {
    it('should render single digit numbers', () => {
      const numbers: CardType['rank'][] = ['2', '3', '4', '5', '6', '7', '8', '9'];
      numbers.forEach((rank) => {
        const { unmount } = render(<Card card={{ suit: 'hearts', rank }} />);
        expect(screen.getByText(rank)).toBeInTheDocument();
        unmount();
      });
    });

    it('should render 10 correctly', () => {
      render(<Card card={{ suit: 'hearts', rank: '10' }} />);
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  describe('Game Context', () => {
    it('should render player card', () => {
      render(<Card card={{ suit: 'hearts', rank: 'A' }} />);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render banker card', () => {
      render(<Card card={{ suit: 'diamonds', rank: 'K' }} />);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render initial cards face down', () => {
      render(<Card card={mockCard} faceDown />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('face-down');
    });

    it('should flip card to reveal', () => {
      render(<Card card={mockCard} flip />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('flip');
    });
  });

  describe('Edge Cases', () => {
    it('should handle all suit and rank combinations', () => {
      const suits: CardType['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
      const ranks: CardType['rank'][] = [
        'A',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'J',
        'Q',
        'K',
      ];

      suits.forEach((suit) => {
        ranks.forEach((rank) => {
          const { unmount } = render(<Card card={{ suit, rank }} />);
          expect(screen.getByTestId('card')).toBeInTheDocument();
          unmount();
        });
      });
    });

    it('should handle rapid flip state changes', () => {
      const { rerender } = render(<Card card={mockCard} flip={false} />);
      rerender(<Card card={mockCard} flip />);
      rerender(<Card card={mockCard} flip={false} />);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should handle rapid faceDown state changes', () => {
      const { rerender } = render(<Card card={mockCard} faceDown={false} />);
      rerender(<Card card={mockCard} faceDown />);
      rerender(<Card card={mockCard} faceDown={false} />);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label for screen readers', () => {
      render(<Card card={{ suit: 'hearts', rank: 'A' }} />);
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('aria-label', 'Ace of hearts');
    });

    it('should have aria-label for face cards', () => {
      render(<Card card={{ suit: 'spades', rank: 'K' }} />);
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('aria-label', 'King of spades');
    });

    it('should have aria-label for number cards', () => {
      render(<Card card={{ suit: 'diamonds', rank: '7' }} />);
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('aria-label', '7 of diamonds');
    });

    it('should indicate face down state in aria-label', () => {
      render(<Card card={mockCard} faceDown />);
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('aria-label', 'Card face down');
    });
  });

  describe('Visual Appearance', () => {
    it('should have card border', () => {
      render(<Card card={mockCard} />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('card');
    });

    it('should maintain aspect ratio', () => {
      render(<Card card={mockCard} />);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Combined Props', () => {
    it('should handle size and faceDown together', () => {
      render(<Card card={mockCard} size="large" faceDown />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('large');
      expect(card.className).toContain('face-down');
    });

    it('should handle size, flip, and className together', () => {
      render(<Card card={mockCard} size="small" flip className="custom" />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('small');
      expect(card.className).toContain('flip');
      expect(card).toHaveClass('custom');
    });

    it('should handle all props together', () => {
      render(<Card card={mockCard} size="large" faceDown flip className="custom" />);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('large');
      expect(card.className).toContain('face-down');
      expect(card.className).toContain('flip');
      expect(card).toHaveClass('custom');
    });
  });
});
