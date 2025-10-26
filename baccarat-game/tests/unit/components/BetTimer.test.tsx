import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BetTimer } from '@/components/game/BetTimer';

describe('BetTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('渲染測試', () => {
    it('應該渲染計時器容器', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} />);

      const container = screen.getByTestId('bet-timer');
      expect(container).toBeInTheDocument();
    });

    it('應該顯示初始秒數', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} />);

      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('應該顯示標籤', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} label="下注時間" />);

      expect(screen.getByText('下注時間')).toBeInTheDocument();
    });

    it('應該在未提供標籤時不顯示標籤', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} />);

      const label = screen.queryByTestId('timer-label');
      expect(label).not.toBeInTheDocument();
    });
  });

  describe('倒數計時功能', () => {
    it('應該每秒減少 1', async () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} />);

      expect(screen.getByText('15')).toBeInTheDocument();

      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText('14')).toBeInTheDocument();
      });

      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText('13')).toBeInTheDocument();
      });
    });

    it('應該在時間到達 0 時停止', async () => {
      render(<BetTimer seconds={3} onTimeUp={vi.fn()} />);

      vi.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument();
      });

      // 繼續前進時間，確認不會變成負數
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });

    it('應該在時間到達 0 時觸發 onTimeUp', async () => {
      const onTimeUp = vi.fn();
      render(<BetTimer seconds={3} onTimeUp={onTimeUp} />);

      vi.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(onTimeUp).toHaveBeenCalledTimes(1);
      });
    });

    it('應該只觸發一次 onTimeUp', async () => {
      const onTimeUp = vi.fn();
      render(<BetTimer seconds={2} onTimeUp={onTimeUp} />);

      vi.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(onTimeUp).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('暫停和恢復功能', () => {
    it('應該在暫停時停止倒數', async () => {
      render(<BetTimer seconds={10} onTimeUp={vi.fn()} paused />);

      expect(screen.getByText('10')).toBeInTheDocument();

      vi.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument();
      });
    });

    it('應該能從暫停狀態恢復', async () => {
      const { rerender } = render(<BetTimer seconds={10} onTimeUp={vi.fn()} paused />);

      vi.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument();
      });

      rerender(<BetTimer seconds={10} onTimeUp={vi.fn()} paused={false} />);

      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText('9')).toBeInTheDocument();
      });
    });

    it('應該在暫停時套用暫停樣式', () => {
      render(<BetTimer seconds={10} onTimeUp={vi.fn()} paused />);

      const container = screen.getByTestId('bet-timer');
      expect(container.className).toContain('paused');
    });
  });

  describe('重置功能', () => {
    it('應該能重置計時器', async () => {
      const { rerender } = render(<BetTimer seconds={5} onTimeUp={vi.fn()} />);

      vi.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
      });

      rerender(<BetTimer seconds={5} onTimeUp={vi.fn()} key="new" />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('視覺樣式', () => {
    it('應該套用正確的容器樣式類別', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} />);

      const container = screen.getByTestId('bet-timer');
      expect(container.className).toContain('bet-timer');
    });

    it('應該支援自訂 className', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} className="custom-class" />);

      const container = screen.getByTestId('bet-timer');
      expect(container.className).toContain('custom-class');
    });

    it('應該在時間少於 5 秒時套用警告樣式', async () => {
      render(<BetTimer seconds={5} onTimeUp={vi.fn()} />);

      const container = screen.getByTestId('bet-timer');
      expect(container.className).toContain('warning');
    });

    it('應該在時間少於 3 秒時套用危險樣式', async () => {
      render(<BetTimer seconds={3} onTimeUp={vi.fn()} />);

      const container = screen.getByTestId('bet-timer');
      expect(container.className).toContain('danger');
    });

    it('應該在時間到達 0 時套用過期樣式', async () => {
      render(<BetTimer seconds={1} onTimeUp={vi.fn()} />);

      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        const container = screen.getByTestId('bet-timer');
        expect(container.className).toContain('expired');
      });
    });
  });

  describe('進度條', () => {
    it('應該顯示進度條', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} showProgress />);

      const progressBar = screen.getByTestId('timer-progress');
      expect(progressBar).toBeInTheDocument();
    });

    it('應該在不顯示進度條時隱藏進度條', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} showProgress={false} />);

      const progressBar = screen.queryByTestId('timer-progress');
      expect(progressBar).not.toBeInTheDocument();
    });

    it('應該正確計算進度百分比', async () => {
      render(<BetTimer seconds={10} onTimeUp={vi.fn()} showProgress />);

      const progressBar = screen.getByTestId('timer-progress');

      // 初始應該是 100%
      expect(progressBar.style.width).toBe('100%');

      vi.advanceTimersByTime(5000);
      await waitFor(() => {
        // 5秒後應該是 50%
        expect(progressBar.style.width).toBe('50%');
      });
    });
  });

  describe('無障礙性 (Accessibility)', () => {
    it('應該有描述性的 aria-label', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} />);

      const container = screen.getByTestId('bet-timer');
      expect(container).toHaveAttribute('aria-label');
      const ariaLabel = container.getAttribute('aria-label');
      expect(ariaLabel).toContain('15');
    });

    it('應該在暫停時更新 aria-label', () => {
      render(<BetTimer seconds={10} onTimeUp={vi.fn()} paused />);

      const container = screen.getByTestId('bet-timer');
      const ariaLabel = container.getAttribute('aria-label');
      expect(ariaLabel).toContain('暫停');
    });

    it('應該有適當的 role 屬性', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} />);

      const container = screen.getByRole('timer');
      expect(container).toBeInTheDocument();
    });

    it('應該有 aria-live 屬性用於即時更新', () => {
      render(<BetTimer seconds={15} onTimeUp={vi.fn()} />);

      const container = screen.getByTestId('bet-timer');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('邊界情況', () => {
    it('應該處理 0 秒的初始值', () => {
      render(<BetTimer seconds={0} onTimeUp={vi.fn()} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('應該處理負數秒數（顯示為 0）', () => {
      render(<BetTimer seconds={-5} onTimeUp={vi.fn()} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('應該處理非常大的秒數', () => {
      render(<BetTimer seconds={9999} onTimeUp={vi.fn()} />);

      expect(screen.getByText('9999')).toBeInTheDocument();
    });

    it('應該處理未提供 onTimeUp 的情況', async () => {
      // @ts-expect-error - 測試邊界情況
      render(<BetTimer seconds={1} />);

      expect(() => {
        vi.advanceTimersByTime(1000);
      }).not.toThrow();
    });

    it('應該處理小數秒數（向下取整）', () => {
      render(<BetTimer seconds={15.7} onTimeUp={vi.fn()} />);

      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  describe('格式化顯示', () => {
    it('應該將大於 60 秒的時間格式化為分:秒', () => {
      render(<BetTimer seconds={90} onTimeUp={vi.fn()} formatMinutes />);

      expect(screen.getByText('1:30')).toBeInTheDocument();
    });

    it('應該正確格式化分鐘和秒數', () => {
      render(<BetTimer seconds={125} onTimeUp={vi.fn()} formatMinutes />);

      expect(screen.getByText('2:05')).toBeInTheDocument();
    });

    it('應該在未啟用格式化時僅顯示秒數', () => {
      render(<BetTimer seconds={90} onTimeUp={vi.fn()} formatMinutes={false} />);

      expect(screen.getByText('90')).toBeInTheDocument();
    });
  });

  describe('整合測試', () => {
    it('應該完整的倒數流程', async () => {
      const onTimeUp = vi.fn();
      render(<BetTimer seconds={5} onTimeUp={onTimeUp} showProgress />);

      // 初始狀態
      expect(screen.getByText('5')).toBeInTheDocument();

      // 倒數
      for (let i = 4; i >= 0; i--) {
        vi.advanceTimersByTime(1000);
        await waitFor(() => {
          expect(screen.getByText(String(i))).toBeInTheDocument();
        });
      }

      // 確認 onTimeUp 被觸發
      expect(onTimeUp).toHaveBeenCalledTimes(1);
    });

    it('應該支援動態更改秒數', async () => {
      const { rerender } = render(<BetTimer seconds={10} onTimeUp={vi.fn()} />);

      vi.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(screen.getByText('7')).toBeInTheDocument();
      });

      // 更改初始秒數
      rerender(<BetTimer seconds={15} onTimeUp={vi.fn()} />);

      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('應該在暫停和恢復之間正確切換', async () => {
      const { rerender } = render(<BetTimer seconds={10} onTimeUp={vi.fn()} paused={false} />);

      vi.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(screen.getByText('8')).toBeInTheDocument();
      });

      // 暫停
      rerender(<BetTimer seconds={10} onTimeUp={vi.fn()} paused />);
      vi.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(screen.getByText('8')).toBeInTheDocument();
      });

      // 恢復
      rerender(<BetTimer seconds={10} onTimeUp={vi.fn()} paused={false} />);
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText('7')).toBeInTheDocument();
      });
    });
  });

  describe('清理和卸載', () => {
    it('應該在卸載時清理計時器', async () => {
      const { unmount } = render(<BetTimer seconds={10} onTimeUp={vi.fn()} />);

      vi.advanceTimersByTime(2000);
      unmount();

      expect(() => {
        vi.advanceTimersByTime(2000);
      }).not.toThrow();
    });
  });
});
