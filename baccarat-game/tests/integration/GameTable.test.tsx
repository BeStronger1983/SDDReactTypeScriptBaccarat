/**
 * GameTable 整合測試
 *
 * 測試完整遊戲流程，包含：
 * - 選擇籌碼
 * - 下注
 * - 發牌
 * - 結果顯示
 * - 餘額更新
 *
 * 這是整合測試，驗證多個元件、hooks 和服務的協作。
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameTable } from '@/components/game/GameTable';

describe('GameTable 整合測試', () => {
  beforeEach(() => {
    // 清空 localStorage
    localStorage.clear();

    // 設定初始餘額
    localStorage.setItem('balance', '10000');

    // Mock timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('基本渲染', () => {
    it('應該渲染所有必要元件', () => {
      render(<GameTable />);

      // 檢查標題
      expect(screen.getByRole('banner')).toBeInTheDocument();

      // 檢查餘額顯示
      expect(screen.getByTestId('balance-display')).toBeInTheDocument();

      // 檢查籌碼選擇器
      expect(screen.getByTestId('chip-selector')).toBeInTheDocument();

      // 檢查下注區域
      expect(screen.getByTestId('betting-area')).toBeInTheDocument();

      // 檢查牌面顯示區域
      expect(screen.getByTestId('player-hand')).toBeInTheDocument();
      expect(screen.getByTestId('banker-hand')).toBeInTheDocument();
    });

    it('應該顯示初始餘額', () => {
      render(<GameTable />);

      const balanceDisplay = screen.getByTestId('balance-display');
      expect(balanceDisplay).toHaveTextContent('10,000');
    });

    it('應該在下注階段顯示下注計時器', () => {
      render(<GameTable />);

      expect(screen.getByTestId('bet-timer')).toBeInTheDocument();
    });
  });

  describe('完整遊戲流程', () => {
    it('應該完成一個完整的遊戲回合（玩家下注並贏）', async () => {
      const user = userEvent.setup({ delay: null });

      // Mock 遊戲結果為玩家贏
      vi.spyOn(Math, 'random').mockReturnValue(0.3); // 控制發牌結果

      render(<GameTable />);

      // 1. 選擇籌碼 100
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      expect(chip100).toHaveClass('selected');

      // 2. 點擊玩家區域下注
      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      // 驗證下注金額顯示
      const playerBetAmount = screen.getByTestId('bet-amount-player');
      expect(playerBetAmount).toHaveTextContent('100');

      // 3. 等待倒數結束或點擊發牌按鈕
      const dealButton = screen.getByRole('button', { name: /發牌|deal/i });
      await user.click(dealButton);

      // 4. 驗證進入發牌階段
      await waitFor(() => {
        expect(screen.queryByTestId('bet-timer')).not.toBeInTheDocument();
      });

      // 5. 等待發牌完成
      await waitFor(
        () => {
          const playerCards = screen.getByTestId('player-hand');
          const bankerCards = screen.getByTestId('banker-hand');
          expect(playerCards.querySelectorAll('[data-testid^="card-"]').length).toBeGreaterThan(0);
          expect(bankerCards.querySelectorAll('[data-testid^="card-"]').length).toBeGreaterThan(0);
        },
        { timeout: 3000 }
      );

      // 6. 等待結果顯示
      await waitFor(
        () => {
          expect(screen.getByTestId('result-display')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      // 7. 驗證結果顯示內容
      const resultDisplay = screen.getByTestId('result-display');
      expect(resultDisplay).toBeVisible();

      // 8. 驗證餘額更新（根據結果）
      const balanceDisplay = screen.getByTestId('balance-display');
      const balanceText = balanceDisplay.textContent || '';
      const balance = parseInt(balanceText.replace(/[^0-9]/g, ''), 10);

      // 餘額應該已經改變（贏了或輸了）
      expect(balance).not.toBe(10000);
    });

    it('應該支援多個下注區域', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 選擇籌碼 50
      const chip50 = screen.getByRole('button', { name: /50/i });
      await user.click(chip50);

      // 在玩家區域下注
      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      expect(screen.getByTestId('bet-amount-player')).toHaveTextContent('50');

      // 選擇籌碼 100
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      // 在莊家區域下注
      const bankerArea = screen.getByTestId('bet-area-banker');
      await user.click(bankerArea);

      expect(screen.getByTestId('bet-amount-banker')).toHaveTextContent('100');

      // 驗證總下注金額
      const totalBet = screen.getByTestId('total-bet');
      expect(totalBet).toHaveTextContent('150');
    });

    it('應該在餘額不足時禁止下注', async () => {
      const user = userEvent.setup({ delay: null });

      // 設定低餘額
      localStorage.setItem('balance', '50');

      render(<GameTable />);

      // 選擇籌碼 100（大於餘額）
      const chip100 = screen.getByRole('button', { name: /100/i });

      // 籌碼應該被禁用
      expect(chip100).toBeDisabled();
    });
  });

  describe('下注管理', () => {
    it('應該允許清除下注', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 下注
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      expect(screen.getByTestId('bet-amount-player')).toHaveTextContent('100');

      // 清除下注
      const clearButton = screen.getByRole('button', { name: /清除|clear/i });
      await user.click(clearButton);

      // 驗證下注已清除
      expect(screen.queryByTestId('bet-amount-player')).not.toBeInTheDocument();
    });

    it('應該允許重複下注', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 選擇籌碼並下注
      const chip50 = screen.getByRole('button', { name: /50/i });
      await user.click(chip50);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea); // 第一次
      await user.click(playerArea); // 第二次

      // 驗證金額累加
      expect(screen.getByTestId('bet-amount-player')).toHaveTextContent('100');
    });

    it('應該支援撤銷最後一次下注', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 下注兩次
      const chip50 = screen.getByRole('button', { name: /50/i });
      await user.click(chip50);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);
      await user.click(playerArea);

      expect(screen.getByTestId('bet-amount-player')).toHaveTextContent('100');

      // 撤銷
      const undoButton = screen.getByRole('button', { name: /撤銷|undo/i });
      await user.click(undoButton);

      // 驗證金額減少
      expect(screen.getByTestId('bet-amount-player')).toHaveTextContent('50');
    });
  });

  describe('計時器功能', () => {
    it('應該在倒數結束後自動開始遊戲', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 下注
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      // 取得初始計時器時間
      const timer = screen.getByTestId('bet-timer');
      const initialTime = parseInt(timer.textContent || '30', 10);

      // 快進時間
      vi.advanceTimersByTime(initialTime * 1000);

      // 驗證進入發牌階段
      await waitFor(() => {
        expect(screen.queryByTestId('bet-timer')).not.toBeInTheDocument();
      });
    });

    it('應該在計時器歸零前允許下注', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 快進 5 秒（還沒到時）
      vi.advanceTimersByTime(5000);

      // 應該仍然可以下注
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      expect(screen.getByTestId('bet-amount-player')).toHaveTextContent('100');
    });
  });

  describe('餘額管理', () => {
    it('應該在下注後扣除餘額', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 下注 100
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      // 發牌
      const dealButton = screen.getByRole('button', { name: /發牌|deal/i });
      await user.click(dealButton);

      // 驗證餘額已扣除
      await waitFor(() => {
        const balanceDisplay = screen.getByTestId('balance-display');
        expect(balanceDisplay).toHaveTextContent('9,900');
      });
    });

    it('應該在贏得遊戲後增加餘額', async () => {
      const user = userEvent.setup({ delay: null });

      // Mock 玩家贏
      vi.spyOn(Math, 'random').mockImplementation(() => 0.1);

      render(<GameTable />);

      // 下注玩家 100
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      // 發牌
      const dealButton = screen.getByRole('button', { name: /發牌|deal/i });
      await user.click(dealButton);

      // 等待結果
      await waitFor(
        () => {
          expect(screen.getByTestId('result-display')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      // 驗證餘額（應該是 10000 - 100 + 200 = 10100，1:1 賠率）
      const balanceDisplay = screen.getByTestId('balance-display');
      const balanceText = balanceDisplay.textContent || '';
      const balance = parseInt(balanceText.replace(/[^0-9]/g, ''), 10);

      expect(balance).toBeGreaterThan(10000);
    });

    it('應該持久化餘額到 localStorage', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 下注
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      // 發牌
      const dealButton = screen.getByRole('button', { name: /發牌|deal/i });
      await user.click(dealButton);

      // 等待遊戲完成
      await waitFor(
        () => {
          expect(screen.getByTestId('result-display')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      // 檢查 localStorage
      const savedBalance = localStorage.getItem('balance');
      expect(savedBalance).toBeTruthy();
      expect(parseInt(savedBalance!, 10)).not.toBe(10000);
    });
  });

  describe('遊戲狀態轉換', () => {
    it('應該正確轉換遊戲階段：下注 → 發牌 → 結果', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 階段 1: 下注
      expect(screen.getByTestId('bet-timer')).toBeInTheDocument();

      // 下注
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      // 發牌
      const dealButton = screen.getByRole('button', { name: /發牌|deal/i });
      await user.click(dealButton);

      // 階段 2: 發牌（計時器消失）
      await waitFor(() => {
        expect(screen.queryByTestId('bet-timer')).not.toBeInTheDocument();
      });

      // 階段 3: 結果顯示
      await waitFor(
        () => {
          expect(screen.getByTestId('result-display')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it('應該在結果顯示後允許開始新一輪', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 完成一局遊戲
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      const dealButton = screen.getByRole('button', { name: /發牌|deal/i });
      await user.click(dealButton);

      // 等待結果
      await waitFor(
        () => {
          expect(screen.getByTestId('result-display')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      // 點擊新一輪按鈕
      const newRoundButton = screen.getByRole('button', { name: /新一局|new round/i });
      await user.click(newRoundButton);

      // 驗證回到下注階段
      expect(screen.getByTestId('bet-timer')).toBeInTheDocument();
      expect(screen.queryByTestId('result-display')).not.toBeInTheDocument();
    });
  });

  describe('錯誤處理', () => {
    it('應該在沒有下注時禁用發牌按鈕', () => {
      render(<GameTable />);

      const dealButton = screen.getByRole('button', { name: /發牌|deal/i });
      expect(dealButton).toBeDisabled();
    });

    it('應該在遊戲進行中禁用下注', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // 下注並發牌
      const chip100 = screen.getByRole('button', { name: /100/i });
      await user.click(chip100);

      const playerArea = screen.getByTestId('bet-area-player');
      await user.click(playerArea);

      const dealButton = screen.getByRole('button', { name: /發牌|deal/i });
      await user.click(dealButton);

      // 驗證籌碼選擇器被禁用
      await waitFor(() => {
        const chips = screen.getAllByRole('button', { name: /\d+/ });
        chips.forEach((chip) => {
          expect(chip).toBeDisabled();
        });
      });
    });
  });

  describe('無障礙性', () => {
    it('應該有適當的 ARIA 標籤', () => {
      render(<GameTable />);

      // 檢查主要區域的 role
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByRole('main')).toBeInTheDocument(); // Main game area
    });

    it('應該支援鍵盤導航', async () => {
      const user = userEvent.setup({ delay: null });

      render(<GameTable />);

      // Tab 到籌碼
      await user.tab();

      // Enter 選擇籌碼
      await user.keyboard('{Enter}');

      // Tab 到下注區域並 Enter
      await user.tab();
      await user.keyboard('{Enter}');

      // 驗證下注成功
      expect(screen.getByTestId('bet-amount-player')).toBeInTheDocument();
    });
  });

  describe('響應式設計', () => {
    it('應該在小螢幕上正確顯示', () => {
      // Mock window.innerWidth
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      render(<GameTable />);

      // 驗證主要元件仍然存在
      expect(screen.getByTestId('balance-display')).toBeInTheDocument();
      expect(screen.getByTestId('chip-selector')).toBeInTheDocument();
      expect(screen.getByTestId('betting-area')).toBeInTheDocument();
    });
  });
});
