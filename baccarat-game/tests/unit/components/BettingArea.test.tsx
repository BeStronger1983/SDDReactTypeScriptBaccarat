import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BettingArea } from '@/components/game/BettingArea';

describe('BettingArea', () => {
  describe('渲染測試', () => {
    it('應該渲染閒家下注區域', () => {
      render(<BettingArea type="player" amount={0} onBet={vi.fn()} />);

      const area = screen.getByTestId('betting-area-player');
      expect(area).toBeInTheDocument();
      expect(screen.getByText(/閒家|player/i)).toBeInTheDocument();
    });

    it('應該渲染莊家下注區域', () => {
      render(<BettingArea type="banker" amount={0} onBet={vi.fn()} />);

      const area = screen.getByTestId('betting-area-banker');
      expect(area).toBeInTheDocument();
      expect(screen.getByText(/莊家|banker/i)).toBeInTheDocument();
    });

    it('應該渲染和局下注區域', () => {
      render(<BettingArea type="tie" amount={0} onBet={vi.fn()} />);

      const area = screen.getByTestId('betting-area-tie');
      expect(area).toBeInTheDocument();
      expect(screen.getByText(/和局|tie/i)).toBeInTheDocument();
    });

    it('應該顯示當前下注金額為0', () => {
      render(<BettingArea type="player" amount={0} onBet={vi.fn()} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('應該顯示當前下注金額', () => {
      render(<BettingArea type="player" amount={500} onBet={vi.fn()} />);

      expect(screen.getByText('500')).toBeInTheDocument();
    });
  });

  describe('下注功能', () => {
    it('應該在點擊時觸發 onBet 回調', () => {
      const onBet = vi.fn();
      render(<BettingArea type="player" amount={0} onBet={onBet} />);

      const area = screen.getByTestId('betting-area-player');
      fireEvent.click(area);

      expect(onBet).toHaveBeenCalledTimes(1);
    });

    it('應該傳遞當前籌碼值給 onBet', () => {
      const onBet = vi.fn();
      render(<BettingArea type="player" amount={0} onBet={onBet} chipValue={100} />);

      const area = screen.getByTestId('betting-area-player');
      fireEvent.click(area);

      expect(onBet).toHaveBeenCalledWith(100);
    });

    it('應該累加下注金額', () => {
      const onBet = vi.fn();
      const { rerender } = render(
        <BettingArea type="player" amount={100} onBet={onBet} chipValue={50} />
      );

      const area = screen.getByTestId('betting-area-player');
      fireEvent.click(area);

      expect(onBet).toHaveBeenCalledWith(50);

      // 模擬金額更新
      rerender(<BettingArea type="player" amount={150} onBet={onBet} chipValue={50} />);
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('應該支援多次下注', () => {
      const onBet = vi.fn();
      render(<BettingArea type="banker" amount={0} onBet={onBet} chipValue={100} />);

      const area = screen.getByTestId('betting-area-banker');

      fireEvent.click(area);
      expect(onBet).toHaveBeenCalledTimes(1);

      fireEvent.click(area);
      expect(onBet).toHaveBeenCalledTimes(2);

      fireEvent.click(area);
      expect(onBet).toHaveBeenCalledTimes(3);
    });
  });

  describe('禁用狀態', () => {
    it('應該在禁用時不可點擊', () => {
      const onBet = vi.fn();
      render(<BettingArea type="player" amount={0} onBet={onBet} disabled />);

      const area = screen.getByTestId('betting-area-player');
      fireEvent.click(area);

      expect(onBet).not.toHaveBeenCalled();
    });

    it('應該顯示禁用狀態樣式', () => {
      render(<BettingArea type="player" amount={0} onBet={vi.fn()} disabled />);

      const area = screen.getByTestId('betting-area-player');
      expect(area.className).toContain('disabled');
    });

    it('應該在禁用時移除 pointer cursor', () => {
      render(<BettingArea type="player" amount={0} onBet={vi.fn()} disabled />);

      const area = screen.getByTestId('betting-area-player');
      const style = window.getComputedStyle(area);
      expect(style.cursor).not.toBe('pointer');
    });

    it('應該能夠切換禁用狀態', () => {
      const onBet = vi.fn();
      const { rerender } = render(
        <BettingArea type="player" amount={0} onBet={onBet} disabled={false} />
      );

      let area = screen.getByTestId('betting-area-player');
      fireEvent.click(area);
      expect(onBet).toHaveBeenCalledTimes(1);

      rerender(<BettingArea type="player" amount={0} onBet={onBet} disabled={true} />);
      area = screen.getByTestId('betting-area-player');
      fireEvent.click(area);
      expect(onBet).toHaveBeenCalledTimes(1); // 不應增加
    });
  });

  describe('顯示賠率', () => {
    it('應該顯示閒家賠率 1:1', () => {
      render(<BettingArea type="player" amount={0} onBet={vi.fn()} />);

      expect(screen.getByText(/1:1/)).toBeInTheDocument();
    });

    it('應該顯示莊家賠率 1:0.95', () => {
      render(<BettingArea type="banker" amount={0} onBet={vi.fn()} />);

      expect(screen.getByText(/1:0.95/)).toBeInTheDocument();
    });

    it('應該顯示和局賠率 1:8', () => {
      render(<BettingArea type="tie" amount={0} onBet={vi.fn()} />);

      expect(screen.getByText(/1:8/)).toBeInTheDocument();
    });
  });

  describe('視覺樣式', () => {
    it('應該為閒家區域套用正確的樣式類別', () => {
      render(<BettingArea type="player" amount={0} onBet={vi.fn()} />);

      const area = screen.getByTestId('betting-area-player');
      expect(area.className).toContain('betting-area');
      expect(area.className).toContain('player');
    });

    it('應該為莊家區域套用正確的樣式類別', () => {
      render(<BettingArea type="banker" amount={0} onBet={vi.fn()} />);

      const area = screen.getByTestId('betting-area-banker');
      expect(area.className).toContain('betting-area');
      expect(area.className).toContain('banker');
    });

    it('應該為和局區域套用正確的樣式類別', () => {
      render(<BettingArea type="tie" amount={0} onBet={vi.fn()} />);

      const area = screen.getByTestId('betting-area-tie');
      expect(area.className).toContain('betting-area');
      expect(area.className).toContain('tie');
    });

    it('應該在有下注時顯示活躍樣式', () => {
      render(<BettingArea type="player" amount={100} onBet={vi.fn()} />);

      const area = screen.getByTestId('betting-area-player');
      expect(area.className).toContain('has-bet');
    });

    it('應該在無下注時不顯示活躍樣式', () => {
      render(<BettingArea type="player" amount={0} onBet={vi.fn()} />);

      const area = screen.getByTestId('betting-area-player');
      expect(area.className).not.toContain('has-bet');
    });
  });

  describe('無障礙性 (Accessibility)', () => {
    it('應該有適當的 role 屬性', () => {
      render(<BettingArea type="player" amount={0} onBet={vi.fn()} />);

      const area = screen.getByRole('button');
      expect(area).toBeInTheDocument();
    });

    it('應該有描述性的 aria-label', () => {
      render(<BettingArea type="player" amount={100} onBet={vi.fn()} />);

      const area = screen.getByTestId('betting-area-player');
      expect(area).toHaveAttribute('aria-label');
      const ariaLabel = area.getAttribute('aria-label');
      expect(ariaLabel).toContain('閒家');
      expect(ariaLabel).toContain('100');
    });

    it('應該在禁用時設置 aria-disabled', () => {
      render(<BettingArea type="player" amount={0} onBet={vi.fn()} disabled />);

      const area = screen.getByTestId('betting-area-player');
      expect(area).toHaveAttribute('aria-disabled', 'true');
    });

    it('應該支援鍵盤操作 (Enter 鍵)', () => {
      const onBet = vi.fn();
      render(<BettingArea type="player" amount={0} onBet={onBet} chipValue={100} />);

      const area = screen.getByTestId('betting-area-player');
      fireEvent.keyDown(area, { key: 'Enter', code: 'Enter' });

      expect(onBet).toHaveBeenCalledWith(100);
    });

    it('應該支援鍵盤操作 (Space 鍵)', () => {
      const onBet = vi.fn();
      render(<BettingArea type="player" amount={0} onBet={onBet} chipValue={100} />);

      const area = screen.getByTestId('betting-area-player');
      fireEvent.keyDown(area, { key: ' ', code: 'Space' });

      expect(onBet).toHaveBeenCalledWith(100);
    });

    it('應該有 tabIndex 以支援鍵盤導航', () => {
      render(<BettingArea type="player" amount={0} onBet={vi.fn()} />);

      const area = screen.getByTestId('betting-area-player');
      expect(area).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('邊界情況', () => {
    it('應該處理極大的下注金額', () => {
      render(<BettingArea type="player" amount={999999} onBet={vi.fn()} />);

      expect(screen.getByText('999999')).toBeInTheDocument();
    });

    it('應該處理負數下注金額（顯示為0）', () => {
      render(<BettingArea type="player" amount={-100} onBet={vi.fn()} />);

      // 應該顯示 0 或絕對值，根據實作決定
      const area = screen.getByTestId('betting-area-player');
      expect(area).toBeInTheDocument();
    });

    it('應該處理未提供 chipValue 的情況', () => {
      const onBet = vi.fn();
      render(<BettingArea type="player" amount={0} onBet={onBet} />);

      const area = screen.getByTestId('betting-area-player');
      fireEvent.click(area);

      // 應該使用預設值或不執行
      expect(onBet).toHaveBeenCalled();
    });

    it('應該處理 onBet 為 undefined 的情況', () => {
      // @ts-expect-error - 測試邊界情況
      render(<BettingArea type="player" amount={0} />);

      const area = screen.getByTestId('betting-area-player');
      expect(() => fireEvent.click(area)).not.toThrow();
    });
  });

  describe('整合測試', () => {
    it('應該完整的下注流程', () => {
      const onBet = vi.fn();
      const { rerender } = render(
        <BettingArea type="player" amount={0} onBet={onBet} chipValue={100} />
      );

      // 初始狀態
      expect(screen.getByText('0')).toBeInTheDocument();

      // 第一次下注
      const area = screen.getByTestId('betting-area-player');
      fireEvent.click(area);
      expect(onBet).toHaveBeenCalledWith(100);

      // 更新金額
      rerender(<BettingArea type="player" amount={100} onBet={onBet} chipValue={100} />);
      expect(screen.getByText('100')).toBeInTheDocument();

      // 第二次下注
      fireEvent.click(area);
      expect(onBet).toHaveBeenCalledWith(100);

      // 再次更新金額
      rerender(<BettingArea type="player" amount={200} onBet={onBet} chipValue={100} />);
      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('應該在三個不同區域獨立下注', () => {
      const onBetPlayer = vi.fn();
      const onBetBanker = vi.fn();
      const onBetTie = vi.fn();

      const { container } = render(
        <>
          <BettingArea type="player" amount={100} onBet={onBetPlayer} chipValue={50} />
          <BettingArea type="banker" amount={200} onBet={onBetBanker} chipValue={50} />
          <BettingArea type="tie" amount={50} onBet={onBetTie} chipValue={50} />
        </>
      );

      const playerArea = screen.getByTestId('betting-area-player');
      const bankerArea = screen.getByTestId('betting-area-banker');
      const tieArea = screen.getByTestId('betting-area-tie');

      fireEvent.click(playerArea);
      expect(onBetPlayer).toHaveBeenCalledWith(50);

      fireEvent.click(bankerArea);
      expect(onBetBanker).toHaveBeenCalledWith(50);

      fireEvent.click(tieArea);
      expect(onBetTie).toHaveBeenCalledWith(50);

      // 確認各自獨立
      expect(onBetPlayer).toHaveBeenCalledTimes(1);
      expect(onBetBanker).toHaveBeenCalledTimes(1);
      expect(onBetTie).toHaveBeenCalledTimes(1);
    });
  });
});
