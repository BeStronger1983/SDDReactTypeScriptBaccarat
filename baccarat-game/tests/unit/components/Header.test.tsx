import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

describe('Header', () => {
  describe('渲染測試', () => {
    it('應該渲染標題容器', () => {
      render(<Header title="百家樂" balance={1000} />);

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
    });

    it('應該顯示遊戲標題', () => {
      render(<Header title="百家樂" balance={1000} />);

      expect(screen.getByText('百家樂')).toBeInTheDocument();
    });

    it('應該顯示餘額資訊', () => {
      render(<Header title="百家樂" balance={1000} />);

      expect(screen.getByTestId('balance-display')).toBeInTheDocument();
    });

    it('應該顯示預設標題', () => {
      render(<Header balance={1000} />);

      expect(screen.getByText(/遊戲/)).toBeInTheDocument();
    });
  });

  describe('標題樣式', () => {
    it('應該套用標題容器樣式', () => {
      render(<Header title="百家樂" balance={1000} />);

      const header = screen.getByTestId('header');
      expect(header.className).toContain('header');
    });

    it('應該支援自訂 className', () => {
      render(<Header title="百家樂" balance={1000} className="custom-header" />);

      const header = screen.getByTestId('header');
      expect(header.className).toContain('custom-header');
    });

    it('應該套用標題文字樣式', () => {
      render(<Header title="百家樂" balance={1000} />);

      const title = screen.getByTestId('header-title');
      expect(title).toBeInTheDocument();
      expect(title.className).toContain('header-title');
    });
  });

  describe('餘額顯示整合', () => {
    it('應該傳遞餘額給 BalanceDisplay', () => {
      render(<Header title="百家樂" balance={5000} />);

      const balanceDisplay = screen.getByTestId('balance-display');
      expect(balanceDisplay).toBeInTheDocument();
      expect(balanceDisplay.textContent).toContain('5000');
    });

    it('應該在餘額顯示中啟用貨幣符號', () => {
      render(<Header title="百家樂" balance={1000} showCurrency />);

      expect(screen.getByText(/\$/)).toBeInTheDocument();
    });

    it('應該傳遞自訂貨幣符號', () => {
      render(<Header title="百家樂" balance={1000} showCurrency currencySymbol="NT$" />);

      expect(screen.getByText(/NT\$/)).toBeInTheDocument();
    });

    it('應該在餘額顯示中啟用千分位格式', () => {
      render(<Header title="百家樂" balance={12345} formatBalanceWithCommas />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toMatch(/12,345/);
    });

    it('應該傳遞餘額小數位數設定', () => {
      render(<Header title="百家樂" balance={1234.567} balanceDecimals={2} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toContain('1234.57');
    });
  });

  describe('選單按鈕', () => {
    it('應該顯示選單按鈕', () => {
      render(<Header title="百家樂" balance={1000} showMenu />);

      const menuButton = screen.getByTestId('menu-button');
      expect(menuButton).toBeInTheDocument();
    });

    it('應該在未啟用時不顯示選單按鈕', () => {
      render(<Header title="百家樂" balance={1000} showMenu={false} />);

      const menuButton = screen.queryByTestId('menu-button');
      expect(menuButton).not.toBeInTheDocument();
    });

    it('應該在點擊選單按鈕時觸發回調', () => {
      const onMenuClick = vi.fn();
      render(<Header title="百家樂" balance={1000} showMenu onMenuClick={onMenuClick} />);

      const menuButton = screen.getByTestId('menu-button');
      fireEvent.click(menuButton);

      expect(onMenuClick).toHaveBeenCalledTimes(1);
    });

    it('應該顯示選單圖示', () => {
      render(<Header title="百家樂" balance={1000} showMenu />);

      const menuButton = screen.getByTestId('menu-button');
      expect(menuButton.textContent).toContain('☰');
    });
  });

  describe('資訊按鈕', () => {
    it('應該顯示資訊按鈕', () => {
      render(<Header title="百家樂" balance={1000} showInfo />);

      const infoButton = screen.getByTestId('info-button');
      expect(infoButton).toBeInTheDocument();
    });

    it('應該在未啟用時不顯示資訊按鈕', () => {
      render(<Header title="百家樂" balance={1000} showInfo={false} />);

      const infoButton = screen.queryByTestId('info-button');
      expect(infoButton).not.toBeInTheDocument();
    });

    it('應該在點擊資訊按鈕時觸發回調', () => {
      const onInfoClick = vi.fn();
      render(<Header title="百家樂" balance={1000} showInfo onInfoClick={onInfoClick} />);

      const infoButton = screen.getByTestId('info-button');
      fireEvent.click(infoButton);

      expect(onInfoClick).toHaveBeenCalledTimes(1);
    });

    it('應該顯示資訊圖示', () => {
      render(<Header title="百家樂" balance={1000} showInfo />);

      const infoButton = screen.getByTestId('info-button');
      expect(infoButton.textContent).toContain('ℹ');
    });
  });

  describe('版面配置', () => {
    it('應該使用 Flexbox 版面', () => {
      render(<Header title="百家樂" balance={1000} />);

      const header = screen.getByTestId('header');
      const styles = window.getComputedStyle(header);
      expect(styles.display).toBe('flex');
    });

    it('應該包含左側區域', () => {
      render(<Header title="百家樂" balance={1000} showMenu />);

      const leftSection = screen.getByTestId('header-left');
      expect(leftSection).toBeInTheDocument();
    });

    it('應該包含中央區域', () => {
      render(<Header title="百家樂" balance={1000} />);

      const centerSection = screen.getByTestId('header-center');
      expect(centerSection).toBeInTheDocument();
    });

    it('應該包含右側區域', () => {
      render(<Header title="百家樂" balance={1000} />);

      const rightSection = screen.getByTestId('header-right');
      expect(rightSection).toBeInTheDocument();
    });
  });

  describe('無障礙性 (Accessibility)', () => {
    it('應該有描述性的 role 屬性', () => {
      render(<Header title="百家樂" balance={1000} />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('應該為選單按鈕提供 aria-label', () => {
      render(<Header title="百家樂" balance={1000} showMenu />);

      const menuButton = screen.getByTestId('menu-button');
      expect(menuButton).toHaveAttribute('aria-label');
    });

    it('應該為資訊按鈕提供 aria-label', () => {
      render(<Header title="百家樂" balance={1000} showInfo />);

      const infoButton = screen.getByTestId('info-button');
      expect(infoButton).toHaveAttribute('aria-label');
    });

    it('應該為標題提供適當的標題層級', () => {
      render(<Header title="百家樂" balance={1000} />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
    });
  });

  describe('視覺效果', () => {
    it('應該支援固定定位模式', () => {
      render(<Header title="百家樂" balance={1000} fixed />);

      const header = screen.getByTestId('header');
      expect(header.className).toContain('fixed');
    });

    it('應該支援陰影效果', () => {
      render(<Header title="百家樂" balance={1000} shadow />);

      const header = screen.getByTestId('header');
      expect(header.className).toContain('shadow');
    });

    it('應該支援透明背景', () => {
      render(<Header title="百家樂" balance={1000} transparent />);

      const header = screen.getByTestId('header');
      expect(header.className).toContain('transparent');
    });
  });

  describe('互動狀態', () => {
    it('應該在按鈕懸停時顯示提示', () => {
      render(<Header title="百家樂" balance={1000} showMenu />);

      const menuButton = screen.getByTestId('menu-button');
      fireEvent.mouseEnter(menuButton);

      expect(menuButton.className).toContain('hover');
    });

    it('應該在按鈕按下時顯示啟用狀態', () => {
      render(<Header title="百家樂" balance={1000} showMenu />);

      const menuButton = screen.getByTestId('menu-button');
      fireEvent.mouseDown(menuButton);

      expect(menuButton.className).toContain('active');
    });
  });

  describe('整合測試', () => {
    it('應該完整顯示所有元素（完整配置）', () => {
      render(
        <Header
          title="百家樂遊戲"
          balance={12345.67}
          showCurrency
          currencySymbol="NT$"
          formatBalanceWithCommas
          balanceDecimals={2}
          showMenu
          showInfo
          shadow
        />
      );

      expect(screen.getByText('百家樂遊戲')).toBeInTheDocument();
      expect(screen.getByTestId('menu-button')).toBeInTheDocument();
      expect(screen.getByTestId('info-button')).toBeInTheDocument();
      expect(screen.getByText(/NT\$/)).toBeInTheDocument();

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toMatch(/12,345\.67/);

      const header = screen.getByTestId('header');
      expect(header.className).toContain('shadow');
    });

    it('應該完整顯示最簡配置', () => {
      render(<Header balance={1000} />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('balance-display')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('info-button')).not.toBeInTheDocument();
    });

    it('應該正確處理所有回調', () => {
      const onMenuClick = vi.fn();
      const onInfoClick = vi.fn();

      render(
        <Header
          title="百家樂"
          balance={1000}
          showMenu
          showInfo
          onMenuClick={onMenuClick}
          onInfoClick={onInfoClick}
        />
      );

      fireEvent.click(screen.getByTestId('menu-button'));
      fireEvent.click(screen.getByTestId('info-button'));

      expect(onMenuClick).toHaveBeenCalledTimes(1);
      expect(onInfoClick).toHaveBeenCalledTimes(1);
    });
  });
});
