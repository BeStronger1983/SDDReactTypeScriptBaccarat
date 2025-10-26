import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BalanceDisplay } from '@/components/layout/BalanceDisplay';

describe('BalanceDisplay', () => {
  describe('渲染測試', () => {
    it('應該渲染餘額顯示容器', () => {
      render(<BalanceDisplay balance={1000} />);

      const container = screen.getByTestId('balance-display');
      expect(container).toBeInTheDocument();
    });

    it('應該顯示餘額標籤', () => {
      render(<BalanceDisplay balance={1000} />);

      expect(screen.getByText(/餘額|balance/i)).toBeInTheDocument();
    });

    it('應該顯示餘額數值', () => {
      render(<BalanceDisplay balance={1000} />);

      expect(screen.getByText(/1000/)).toBeInTheDocument();
    });

    it('應該顯示自訂標籤', () => {
      render(<BalanceDisplay balance={1000} label="我的餘額" />);

      expect(screen.getByText('我的餘額')).toBeInTheDocument();
    });
  });

  describe('餘額格式化', () => {
    it('應該顯示整數餘額', () => {
      render(<BalanceDisplay balance={1000} />);

      expect(screen.getByText(/1000/)).toBeInTheDocument();
    });

    it('應該顯示小數餘額', () => {
      render(<BalanceDisplay balance={1234.56} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toContain('1234.56');
    });

    it('應該格式化大額餘額', () => {
      render(<BalanceDisplay balance={1000000} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue).toBeInTheDocument();
    });

    it('應該顯示千分位符號', () => {
      render(<BalanceDisplay balance={12345} formatWithCommas />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toMatch(/12,345/);
    });

    it('應該在未啟用千分位時不顯示逗號', () => {
      render(<BalanceDisplay balance={12345} formatWithCommas={false} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toContain('12345');
      expect(balanceValue.textContent).not.toMatch(/,/);
    });

    it('應該顯示小數點後兩位', () => {
      render(<BalanceDisplay balance={1234.567} decimals={2} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toContain('1234.57');
    });

    it('應該支援自訂小數位數', () => {
      render(<BalanceDisplay balance={1234.567} decimals={1} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toContain('1234.6');
    });

    it('應該顯示零小數位', () => {
      render(<BalanceDisplay balance={1234.567} decimals={0} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toContain('1235');
    });
  });

  describe('貨幣符號', () => {
    it('應該顯示預設貨幣符號', () => {
      render(<BalanceDisplay balance={1000} showCurrency />);

      expect(screen.getByText(/\$/)).toBeInTheDocument();
    });

    it('應該顯示自訂貨幣符號', () => {
      render(<BalanceDisplay balance={1000} showCurrency currencySymbol="NT$" />);

      expect(screen.getByText(/NT\$/)).toBeInTheDocument();
    });

    it('應該在未啟用時不顯示貨幣符號', () => {
      render(<BalanceDisplay balance={1000} showCurrency={false} />);

      const container = screen.getByTestId('balance-display');
      expect(container.textContent).not.toMatch(/\$/);
    });
  });

  describe('視覺樣式', () => {
    it('應該套用正確的容器樣式類別', () => {
      render(<BalanceDisplay balance={1000} />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('balance-display');
    });

    it('應該支援自訂 className', () => {
      render(<BalanceDisplay balance={1000} className="custom-class" />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('custom-class');
    });

    it('應該在餘額為正時套用正數樣式', () => {
      render(<BalanceDisplay balance={1000} />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('positive');
    });

    it('應該在餘額為零時套用零樣式', () => {
      render(<BalanceDisplay balance={0} />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('zero');
    });

    it('應該在餘額為負時套用負數樣式', () => {
      render(<BalanceDisplay balance={-100} />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('negative');
    });

    it('應該支援大尺寸樣式', () => {
      render(<BalanceDisplay balance={1000} size="large" />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('large');
    });

    it('應該支援中尺寸樣式', () => {
      render(<BalanceDisplay balance={1000} size="medium" />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('medium');
    });

    it('應該支援小尺寸樣式', () => {
      render(<BalanceDisplay balance={1000} size="small" />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('small');
    });
  });

  describe('警告狀態', () => {
    it('應該在餘額低於閾值時顯示警告', () => {
      render(<BalanceDisplay balance={50} warningThreshold={100} />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('warning');
    });

    it('應該在餘額高於閾值時不顯示警告', () => {
      render(<BalanceDisplay balance={150} warningThreshold={100} />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).not.toContain('warning');
    });

    it('應該在未設定閾值時不顯示警告', () => {
      render(<BalanceDisplay balance={50} />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).not.toContain('warning');
    });
  });

  describe('無障礙性 (Accessibility)', () => {
    it('應該有描述性的 aria-label', () => {
      render(<BalanceDisplay balance={1000} />);

      const container = screen.getByTestId('balance-display');
      expect(container).toHaveAttribute('aria-label');
      const ariaLabel = container.getAttribute('aria-label');
      expect(ariaLabel).toContain('1000');
    });

    it('應該有適當的 role 屬性', () => {
      render(<BalanceDisplay balance={1000} />);

      const container = screen.getByRole('status');
      expect(container).toBeInTheDocument();
    });

    it('應該有 aria-live 屬性', () => {
      render(<BalanceDisplay balance={1000} />);

      const container = screen.getByTestId('balance-display');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('邊界情況', () => {
    it('應該處理零餘額', () => {
      render(<BalanceDisplay balance={0} />);

      expect(screen.getByText(/0/)).toBeInTheDocument();
    });

    it('應該處理負數餘額', () => {
      render(<BalanceDisplay balance={-500} />);

      expect(screen.getByText(/-500/)).toBeInTheDocument();
    });

    it('應該處理非常大的數字', () => {
      render(<BalanceDisplay balance={999999999} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toContain('999999999');
    });

    it('應該處理非常小的小數', () => {
      render(<BalanceDisplay balance={0.01} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue).toBeInTheDocument();
    });

    it('應該處理無效的餘額（NaN）', () => {
      render(<BalanceDisplay balance={NaN} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toContain('0');
    });

    it('應該處理無限大', () => {
      render(<BalanceDisplay balance={Infinity} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toContain('0');
    });

    it('應該處理負無限大', () => {
      render(<BalanceDisplay balance={-Infinity} />);

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toContain('0');
    });
  });

  describe('動畫效果', () => {
    it('應該在餘額增加時套用增加動畫', () => {
      const { rerender } = render(<BalanceDisplay balance={1000} animate />);

      rerender(<BalanceDisplay balance={1500} animate />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('increase');
    });

    it('應該在餘額減少時套用減少動畫', () => {
      const { rerender } = render(<BalanceDisplay balance={1000} animate />);

      rerender(<BalanceDisplay balance={500} animate />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('decrease');
    });

    it('應該在未啟用動畫時不套用動畫', () => {
      const { rerender } = render(<BalanceDisplay balance={1000} animate={false} />);

      rerender(<BalanceDisplay balance={1500} animate={false} />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).not.toContain('increase');
      expect(container.className).not.toContain('decrease');
    });
  });

  describe('整合測試', () => {
    it('應該完整顯示所有資訊（正數）', () => {
      render(
        <BalanceDisplay
          balance={12345.67}
          label="我的餘額"
          showCurrency
          currencySymbol="NT$"
          formatWithCommas
          decimals={2}
          size="large"
        />
      );

      expect(screen.getByText('我的餘額')).toBeInTheDocument();
      expect(screen.getByText(/NT\$/)).toBeInTheDocument();

      const balanceValue = screen.getByTestId('balance-value');
      expect(balanceValue.textContent).toMatch(/12,345\.67/);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('positive');
      expect(container.className).toContain('large');
    });

    it('應該完整顯示所有資訊（負數）', () => {
      render(<BalanceDisplay balance={-500} showCurrency formatWithCommas size="medium" />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('negative');
      expect(container.className).toContain('medium');

      expect(screen.getByText(/-500/)).toBeInTheDocument();
    });

    it('應該完整顯示警告狀態', () => {
      render(<BalanceDisplay balance={50} warningThreshold={100} showCurrency size="small" />);

      const container = screen.getByTestId('balance-display');
      expect(container.className).toContain('warning');
      expect(container.className).toContain('small');
      expect(container.className).toContain('positive');
    });
  });
});
