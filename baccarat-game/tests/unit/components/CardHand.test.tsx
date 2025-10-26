import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardHand } from '@/components/game/CardHand';
import type { Hand, Card } from '@/types/game';

describe('CardHand', () => {
  const mockCards: Card[] = [
    { suit: 'hearts', rank: 'A' },
    { suit: 'spades', rank: 'K' },
  ];

  const mockHand: Hand = {
    cards: mockCards,
    score: 1,
    isNatural: false,
  };

  describe('渲染測試', () => {
    it('應該渲染手牌容器', () => {
      render(<CardHand hand={mockHand} label="閒家" />);

      const container = screen.getByTestId('card-hand');
      expect(container).toBeInTheDocument();
    });

    it('應該顯示標籤', () => {
      render(<CardHand hand={mockHand} label="閒家" />);

      expect(screen.getByText('閒家')).toBeInTheDocument();
    });

    it('應該渲染所有牌', () => {
      render(<CardHand hand={mockHand} label="閒家" />);

      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(2);
    });

    it('應該顯示分數', () => {
      render(<CardHand hand={mockHand} label="閒家" showScore />);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('應該在不顯示分數時隱藏分數', () => {
      render(<CardHand hand={mockHand} label="閒家" showScore={false} />);

      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('應該顯示天牌指示器', () => {
      const naturalHand: Hand = {
        cards: mockCards,
        score: 8,
        isNatural: true,
      };

      render(<CardHand hand={naturalHand} label="閒家" showScore />);

      expect(screen.getByText(/天牌|natural/i)).toBeInTheDocument();
    });
  });

  describe('不同手牌組合', () => {
    it('應該渲染 2 張牌的手牌', () => {
      const twoCardHand: Hand = {
        cards: [
          { suit: 'hearts', rank: '7' },
          { suit: 'diamonds', rank: '3' },
        ],
        score: 0,
        isNatural: false,
      };

      render(<CardHand hand={twoCardHand} label="莊家" />);

      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(2);
    });

    it('應該渲染 3 張牌的手牌', () => {
      const threeCardHand: Hand = {
        cards: [
          { suit: 'hearts', rank: '5' },
          { suit: 'diamonds', rank: '2' },
          { suit: 'clubs', rank: '4' },
        ],
        score: 1,
        isNatural: false,
      };

      render(<CardHand hand={threeCardHand} label="閒家" />);

      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(3);
    });

    it('應該處理空手牌', () => {
      const emptyHand: Hand = {
        cards: [],
        score: 0,
        isNatural: false,
      };

      render(<CardHand hand={emptyHand} label="閒家" />);

      const cards = screen.queryAllByTestId('card');
      expect(cards).toHaveLength(0);
    });

    it('應該處理天牌 8', () => {
      const natural8: Hand = {
        cards: [
          { suit: 'hearts', rank: '5' },
          { suit: 'diamonds', rank: '3' },
        ],
        score: 8,
        isNatural: true,
      };

      render(<CardHand hand={natural8} label="閒家" showScore />);

      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText(/天牌|natural/i)).toBeInTheDocument();
    });

    it('應該處理天牌 9', () => {
      const natural9: Hand = {
        cards: [
          { suit: 'spades', rank: '6' },
          { suit: 'clubs', rank: '3' },
        ],
        score: 9,
        isNatural: true,
      };

      render(<CardHand hand={natural9} label="莊家" showScore />);

      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText(/天牌|natural/i)).toBeInTheDocument();
    });
  });

  describe('視覺樣式', () => {
    it('應該套用正確的容器樣式類別', () => {
      render(<CardHand hand={mockHand} label="閒家" />);

      const container = screen.getByTestId('card-hand');
      expect(container.className).toContain('card-hand');
    });

    it('應該支援自訂 className', () => {
      render(<CardHand hand={mockHand} label="閒家" className="custom-class" />);

      const container = screen.getByTestId('card-hand');
      expect(container.className).toContain('custom-class');
    });

    it('應該為天牌套用特殊樣式', () => {
      const naturalHand: Hand = {
        cards: mockCards,
        score: 8,
        isNatural: true,
      };

      render(<CardHand hand={naturalHand} label="閒家" showScore />);

      const container = screen.getByTestId('card-hand');
      expect(container.className).toContain('natural');
    });

    it('應該水平排列牌', () => {
      render(<CardHand hand={mockHand} label="閒家" />);

      const cardsContainer = screen.getByTestId('cards-container');
      const styles = window.getComputedStyle(cardsContainer);

      expect(['flex', 'grid', 'inline-flex']).toContain(styles.display);
    });
  });

  describe('無障礙性 (Accessibility)', () => {
    it('應該有描述性的 aria-label', () => {
      render(<CardHand hand={mockHand} label="閒家" showScore />);

      const container = screen.getByTestId('card-hand');
      expect(container).toHaveAttribute('aria-label');
      const ariaLabel = container.getAttribute('aria-label');
      expect(ariaLabel).toContain('閒家');
      expect(ariaLabel).toContain('1');
    });

    it('應該為天牌提供特殊的 aria-label', () => {
      const naturalHand: Hand = {
        cards: mockCards,
        score: 9,
        isNatural: true,
      };

      render(<CardHand hand={naturalHand} label="莊家" showScore />);

      const container = screen.getByTestId('card-hand');
      const ariaLabel = container.getAttribute('aria-label');
      expect(ariaLabel).toContain('天牌');
    });

    it('應該有適當的 role 屬性', () => {
      render(<CardHand hand={mockHand} label="閒家" />);

      const container = screen.getByRole('region');
      expect(container).toBeInTheDocument();
    });
  });

  describe('標籤顯示', () => {
    it('應該顯示閒家標籤', () => {
      render(<CardHand hand={mockHand} label="閒家" />);

      expect(screen.getByText('閒家')).toBeInTheDocument();
    });

    it('應該顯示莊家標籤', () => {
      render(<CardHand hand={mockHand} label="莊家" />);

      expect(screen.getByText('莊家')).toBeInTheDocument();
    });

    it('應該支援自訂標籤', () => {
      render(<CardHand hand={mockHand} label="Player" />);

      expect(screen.getByText('Player')).toBeInTheDocument();
    });
  });

  describe('分數顯示', () => {
    it('應該顯示 0 點', () => {
      const zeroHand: Hand = {
        cards: mockCards,
        score: 0,
        isNatural: false,
      };

      render(<CardHand hand={zeroHand} label="閒家" showScore />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('應該顯示所有可能的分數 (0-9)', () => {
      for (let score = 0; score <= 9; score++) {
        const hand: Hand = {
          cards: mockCards,
          score,
          isNatural: score === 8 || score === 9,
        };

        const { unmount } = render(<CardHand hand={hand} label="測試" showScore />);

        expect(screen.getByText(String(score))).toBeInTheDocument();

        unmount();
      }
    });

    it('應該在分數區域顯示分數', () => {
      render(<CardHand hand={mockHand} label="閒家" showScore />);

      const scoreElement = screen.getByTestId('hand-score');
      expect(scoreElement).toBeInTheDocument();
      expect(scoreElement.textContent).toContain('1');
    });
  });

  describe('邊界情況', () => {
    it('應該處理未提供 hand 的情況', () => {
      // @ts-expect-error - 測試邊界情況
      const { container } = render(<CardHand label="閒家" />);

      expect(container).toBeInTheDocument();
    });

    it('應該處理未提供 label 的情況', () => {
      // @ts-expect-error - 測試邊界情況
      render(<CardHand hand={mockHand} />);

      const container = screen.getByTestId('card-hand');
      expect(container).toBeInTheDocument();
    });

    it('應該處理負數分數', () => {
      const invalidHand: Hand = {
        cards: mockCards,
        score: -1,
        isNatural: false,
      };

      render(<CardHand hand={invalidHand} label="閒家" showScore />);

      // 應該顯示 0 或處理錯誤
      const container = screen.getByTestId('card-hand');
      expect(container).toBeInTheDocument();
    });

    it('應該處理超過 9 的分數', () => {
      const invalidHand: Hand = {
        cards: mockCards,
        score: 15,
        isNatural: false,
      };

      render(<CardHand hand={invalidHand} label="閒家" showScore />);

      // 應該顯示 mod 10 或處理錯誤
      const container = screen.getByTestId('card-hand');
      expect(container).toBeInTheDocument();
    });

    it('應該處理超過 3 張牌的情況', () => {
      const manyCards: Hand = {
        cards: [
          { suit: 'hearts', rank: 'A' },
          { suit: 'spades', rank: 'K' },
          { suit: 'diamonds', rank: 'Q' },
          { suit: 'clubs', rank: 'J' },
        ],
        score: 0,
        isNatural: false,
      };

      render(<CardHand hand={manyCards} label="閒家" />);

      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('整合測試', () => {
    it('應該正確顯示完整的手牌資訊', () => {
      const completeHand: Hand = {
        cards: [
          { suit: 'hearts', rank: '7' },
          { suit: 'diamonds', rank: '2' },
          { suit: 'clubs', rank: 'K' },
        ],
        score: 9,
        isNatural: false,
      };

      render(<CardHand hand={completeHand} label="閒家" showScore />);

      // 驗證標籤
      expect(screen.getByText('閒家')).toBeInTheDocument();

      // 驗證牌數
      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(3);

      // 驗證分數
      expect(screen.getByText('9')).toBeInTheDocument();
    });

    it('應該在不同階段正確更新顯示', () => {
      const initialHand: Hand = {
        cards: [
          { suit: 'hearts', rank: '5' },
          { suit: 'spades', rank: '3' },
        ],
        score: 8,
        isNatural: true,
      };

      const { rerender } = render(<CardHand hand={initialHand} label="莊家" showScore />);

      // 初始：2 張牌，天牌 8
      expect(screen.getAllByTestId('card')).toHaveLength(2);
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText(/天牌|natural/i)).toBeInTheDocument();

      // 更新：新的手牌
      const updatedHand: Hand = {
        cards: [
          { suit: 'hearts', rank: '5' },
          { suit: 'spades', rank: '3' },
          { suit: 'diamonds', rank: 'A' },
        ],
        score: 9,
        isNatural: false,
      };

      rerender(<CardHand hand={updatedHand} label="莊家" showScore />);

      // 應該顯示 3 張牌
      expect(screen.getAllByTestId('card')).toHaveLength(3);
      expect(screen.getByText('9')).toBeInTheDocument();
    });

    it('應該支援動態切換 showScore', () => {
      const { rerender } = render(<CardHand hand={mockHand} label="閒家" showScore={false} />);

      expect(screen.queryByText('1')).not.toBeInTheDocument();

      rerender(<CardHand hand={mockHand} label="閒家" showScore={true} />);

      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('牌面朝向', () => {
    it('應該支援顯示牌面朝下的牌', () => {
      render(<CardHand hand={mockHand} label="閒家" faceDown />);

      const cards = screen.getAllByTestId('card-back');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('應該預設顯示牌面朝上', () => {
      render(<CardHand hand={mockHand} label="閒家" />);

      const container = screen.getByTestId('card-hand');
      expect(container).toBeInTheDocument();
    });
  });
});
