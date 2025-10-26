import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultDisplay } from '@/components/game/ResultDisplay';
import type { GameOutcome } from '@/types/game';

describe('ResultDisplay', () => {
  describe('渲染測試', () => {
    it('應該渲染結果顯示容器', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      const container = screen.getByTestId('result-display');
      expect(container).toBeInTheDocument();
    });

    it('應該顯示閒家勝利訊息', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      expect(screen.getByText(/閒家勝|player win/i)).toBeInTheDocument();
    });

    it('應該顯示莊家勝利訊息', () => {
      render(<ResultDisplay outcome="banker" playerScore={5} bankerScore={8} />);

      expect(screen.getByText(/莊家勝|banker win/i)).toBeInTheDocument();
    });

    it('應該顯示和局訊息', () => {
      render(<ResultDisplay outcome="tie" playerScore={7} bankerScore={7} />);

      expect(screen.getByText(/和局|tie/i)).toBeInTheDocument();
    });

    it('應該顯示閒家分數', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      expect(screen.getByText(/8/)).toBeInTheDocument();
    });

    it('應該顯示莊家分數', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      expect(screen.getByText(/5/)).toBeInTheDocument();
    });
  });

  describe('勝利者顯示', () => {
    it('應該閒家勝利時高亮閒家分數', () => {
      render(<ResultDisplay outcome="player" playerScore={9} bankerScore={3} />);

      const playerScoreElement = screen.getByTestId('player-score');
      expect(playerScoreElement.className).toContain('winner');
    });

    it('應該莊家勝利時高亮莊家分數', () => {
      render(<ResultDisplay outcome="banker" playerScore={3} bankerScore={9} />);

      const bankerScoreElement = screen.getByTestId('banker-score');
      expect(bankerScoreElement.className).toContain('winner');
    });

    it('應該和局時兩者都不高亮', () => {
      render(<ResultDisplay outcome="tie" playerScore={6} bankerScore={6} />);

      const playerScoreElement = screen.getByTestId('player-score');
      const bankerScoreElement = screen.getByTestId('banker-score');

      expect(playerScoreElement.className).not.toContain('winner');
      expect(bankerScoreElement.className).not.toContain('winner');
    });
  });

  describe('獎金顯示', () => {
    it('應該顯示獎金金額', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} winAmount={2000} />);

      expect(screen.getByText(/2000/)).toBeInTheDocument();
    });

    it('應該在未提供獎金時不顯示獎金', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      const winAmountElement = screen.queryByTestId('win-amount');
      expect(winAmountElement).not.toBeInTheDocument();
    });

    it('應該顯示獎金為 0', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} winAmount={0} />);

      expect(screen.getByText(/0/)).toBeInTheDocument();
    });

    it('應該格式化大額獎金', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} winAmount={10000} />);

      // 應該有千分位符號或適當的格式
      const winAmountElement = screen.getByTestId('win-amount');
      expect(winAmountElement).toBeInTheDocument();
    });
  });

  describe('視覺樣式', () => {
    it('應該套用正確的容器樣式類別', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      const container = screen.getByTestId('result-display');
      expect(container.className).toContain('result-display');
    });

    it('應該支援自訂 className', () => {
      render(
        <ResultDisplay outcome="player" playerScore={8} bankerScore={5} className="custom-class" />
      );

      const container = screen.getByTestId('result-display');
      expect(container.className).toContain('custom-class');
    });

    it('應該為閒家勝利套用特定樣式', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      const container = screen.getByTestId('result-display');
      expect(container.className).toContain('player-win');
    });

    it('應該為莊家勝利套用特定樣式', () => {
      render(<ResultDisplay outcome="banker" playerScore={5} bankerScore={8} />);

      const container = screen.getByTestId('result-display');
      expect(container.className).toContain('banker-win');
    });

    it('應該為和局套用特定樣式', () => {
      render(<ResultDisplay outcome="tie" playerScore={7} bankerScore={7} />);

      const container = screen.getByTestId('result-display');
      expect(container.className).toContain('tie');
    });
  });

  describe('動畫效果', () => {
    it('應該套用動畫類別', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} animate />);

      const container = screen.getByTestId('result-display');
      expect(container.className).toContain('animate');
    });

    it('應該在未啟用動畫時不套用動畫類別', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} animate={false} />);

      const container = screen.getByTestId('result-display');
      expect(container.className).not.toContain('animate');
    });
  });

  describe('無障礙性 (Accessibility)', () => {
    it('應該有描述性的 aria-label', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      const container = screen.getByTestId('result-display');
      expect(container).toHaveAttribute('aria-label');
      const ariaLabel = container.getAttribute('aria-label');
      expect(ariaLabel).toContain('閒家');
      expect(ariaLabel).toContain('8');
      expect(ariaLabel).toContain('5');
    });

    it('應該有適當的 role 屬性', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      const container = screen.getByRole('status');
      expect(container).toBeInTheDocument();
    });

    it('應該有 aria-live 屬性', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      const container = screen.getByTestId('result-display');
      expect(container).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('邊界情況', () => {
    it('應該處理最小分數 0', () => {
      render(<ResultDisplay outcome="banker" playerScore={0} bankerScore={1} />);

      expect(screen.getByText(/0/)).toBeInTheDocument();
    });

    it('應該處理最大分數 9', () => {
      render(<ResultDisplay outcome="player" playerScore={9} bankerScore={8} />);

      expect(screen.getByText(/9/)).toBeInTheDocument();
    });

    it('應該處理相同分數（和局）', () => {
      render(<ResultDisplay outcome="tie" playerScore={5} bankerScore={5} />);

      const playerScore = screen.getByTestId('player-score');
      const bankerScore = screen.getByTestId('banker-score');

      expect(playerScore.textContent).toContain('5');
      expect(bankerScore.textContent).toContain('5');
    });

    it('應該處理無效的 outcome 值', () => {
      // @ts-expect-error - 測試邊界情況
      render(<ResultDisplay outcome="invalid" playerScore={5} bankerScore={5} />);

      const container = screen.getByTestId('result-display');
      expect(container).toBeInTheDocument();
    });

    it('應該處理負數分數（顯示為 0）', () => {
      render(<ResultDisplay outcome="player" playerScore={-1} bankerScore={5} />);

      const playerScore = screen.getByTestId('player-score');
      expect(playerScore.textContent).toContain('0');
    });

    it('應該處理超過 9 的分數（顯示為 9）', () => {
      render(<ResultDisplay outcome="player" playerScore={15} bankerScore={5} />);

      const playerScore = screen.getByTestId('player-score');
      expect(playerScore.textContent).toContain('9');
    });

    it('應該處理負數獎金（顯示為 0）', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} winAmount={-100} />);

      const winAmount = screen.getByTestId('win-amount');
      expect(winAmount.textContent).toContain('0');
    });
  });

  describe('天牌指示', () => {
    it('應該顯示閒家天牌指示器', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} playerNatural />);

      expect(screen.getByText(/天牌|natural/i)).toBeInTheDocument();
    });

    it('應該顯示莊家天牌指示器', () => {
      render(<ResultDisplay outcome="banker" playerScore={5} bankerScore={9} bankerNatural />);

      expect(screen.getByText(/天牌|natural/i)).toBeInTheDocument();
    });

    it('應該在非天牌時不顯示指示器', () => {
      render(<ResultDisplay outcome="player" playerScore={7} bankerScore={5} />);

      const naturalIndicators = screen.queryAllByText(/天牌|natural/i);
      expect(naturalIndicators).toHaveLength(0);
    });

    it('應該同時顯示雙方天牌（雙天牌和局）', () => {
      render(
        <ResultDisplay outcome="tie" playerScore={8} bankerScore={8} playerNatural bankerNatural />
      );

      const naturalIndicators = screen.getAllByText(/天牌|natural/i);
      expect(naturalIndicators.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('整合測試', () => {
    it('應該完整顯示閒家勝利的所有資訊', () => {
      render(
        <ResultDisplay
          outcome="player"
          playerScore={9}
          bankerScore={3}
          winAmount={2000}
          playerNatural
        />
      );

      // 驗證結果訊息
      expect(screen.getByText(/閒家勝|player win/i)).toBeInTheDocument();

      // 驗證分數
      expect(screen.getByText(/9/)).toBeInTheDocument();
      expect(screen.getByText(/3/)).toBeInTheDocument();

      // 驗證獎金
      expect(screen.getByText(/2000/)).toBeInTheDocument();

      // 驗證天牌指示
      expect(screen.getByText(/天牌|natural/i)).toBeInTheDocument();
    });

    it('應該完整顯示莊家勝利的所有資訊', () => {
      render(<ResultDisplay outcome="banker" playerScore={4} bankerScore={8} winAmount={1900} />);

      expect(screen.getByText(/莊家勝|banker win/i)).toBeInTheDocument();
      expect(screen.getByText(/4/)).toBeInTheDocument();
      expect(screen.getByText(/8/)).toBeInTheDocument();
      expect(screen.getByText(/1900/)).toBeInTheDocument();
    });

    it('應該完整顯示和局的所有資訊', () => {
      render(<ResultDisplay outcome="tie" playerScore={6} bankerScore={6} winAmount={8000} />);

      expect(screen.getByText(/和局|tie/i)).toBeInTheDocument();
      expect(screen.getAllByText(/6/)).toHaveLength(2);
      expect(screen.getByText(/8000/)).toBeInTheDocument();
    });
  });

  describe('關閉功能', () => {
    it('應該顯示關閉按鈕', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} onClose={vi.fn()} />);

      const closeButton = screen.getByTestId('close-button');
      expect(closeButton).toBeInTheDocument();
    });

    it('應該在未提供 onClose 時不顯示關閉按鈕', () => {
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} />);

      const closeButton = screen.queryByTestId('close-button');
      expect(closeButton).not.toBeInTheDocument();
    });

    it('應該在點擊關閉按鈕時觸發 onClose', () => {
      const onClose = vi.fn();
      render(<ResultDisplay outcome="player" playerScore={8} bankerScore={5} onClose={onClose} />);

      const closeButton = screen.getByTestId('close-button');
      closeButton.click();

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
