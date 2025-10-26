import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChipSelector } from '@/components/game/ChipSelector';
import { CHIP_VALUES } from '@/types/game';

describe('ChipSelector', () => {
  describe('渲染測試', () => {
    it('應該渲染所有籌碼選項', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      // 驗證所有籌碼值都有渲染
      CHIP_VALUES.forEach((value) => {
        expect(screen.getByText(String(value))).toBeInTheDocument();
      });
    });

    it('應該渲染 5 個籌碼', () => {
      const { container } = render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      const chips = container.querySelectorAll(
        '[data-testid^="chip-"]:not([data-testid="chip-selector"])'
      );
      expect(chips).toHaveLength(5);
    });

    it('應該顯示正確的籌碼值（10, 50, 100, 500, 1000）', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('應該有容器元素', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      const container = screen.getByTestId('chip-selector');
      expect(container).toBeInTheDocument();
    });
  });

  describe('選中狀態', () => {
    it('應該標記選中的籌碼', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      const chip100 = screen.getByTestId('chip-100');
      expect(chip100.className).toContain('selected');
    });

    it('應該只有一個籌碼被選中', () => {
      const { container } = render(<ChipSelector selectedValue={500} onSelect={vi.fn()} />);

      const selectedChips = container.querySelectorAll('.selected');
      expect(selectedChips).toHaveLength(1);
    });

    it('應該能切換選中的籌碼', () => {
      const { rerender } = render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      let chip100 = screen.getByTestId('chip-100');
      let chip500 = screen.getByTestId('chip-500');
      expect(chip100.className).toContain('selected');
      expect(chip500.className).not.toContain('selected');

      rerender(<ChipSelector selectedValue={500} onSelect={vi.fn()} />);

      chip100 = screen.getByTestId('chip-100');
      chip500 = screen.getByTestId('chip-500');
      expect(chip100.className).not.toContain('selected');
      expect(chip500.className).toContain('selected');
    });

    it('應該正確處理所有籌碼值的選中狀態', () => {
      CHIP_VALUES.forEach((value) => {
        const { unmount } = render(<ChipSelector selectedValue={value} onSelect={vi.fn()} />);

        const selectedChip = screen.getByTestId(`chip-${value}`);
        expect(selectedChip.className).toContain('selected');

        unmount();
      });
    });
  });

  describe('點擊功能', () => {
    it('應該在點擊籌碼時觸發 onSelect', () => {
      const onSelect = vi.fn();
      render(<ChipSelector selectedValue={100} onSelect={onSelect} />);

      const chip50 = screen.getByTestId('chip-50');
      fireEvent.click(chip50);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(50);
    });

    it('應該能點擊所有籌碼', () => {
      const onSelect = vi.fn();
      render(<ChipSelector selectedValue={100} onSelect={onSelect} />);

      CHIP_VALUES.forEach((value) => {
        const chip = screen.getByTestId(`chip-${value}`);
        fireEvent.click(chip);
      });

      expect(onSelect).toHaveBeenCalledTimes(5);
    });

    it('應該傳遞正確的籌碼值', () => {
      const onSelect = vi.fn();
      render(<ChipSelector selectedValue={100} onSelect={onSelect} />);

      fireEvent.click(screen.getByTestId('chip-10'));
      expect(onSelect).toHaveBeenLastCalledWith(10);

      fireEvent.click(screen.getByTestId('chip-500'));
      expect(onSelect).toHaveBeenLastCalledWith(500);

      fireEvent.click(screen.getByTestId('chip-1000'));
      expect(onSelect).toHaveBeenLastCalledWith(1000);
    });

    it('應該能重複點擊同一個籌碼', () => {
      const onSelect = vi.fn();
      render(<ChipSelector selectedValue={100} onSelect={onSelect} />);

      const chip100 = screen.getByTestId('chip-100');
      fireEvent.click(chip100);
      fireEvent.click(chip100);
      fireEvent.click(chip100);

      expect(onSelect).toHaveBeenCalledTimes(3);
      expect(onSelect).toHaveBeenCalledWith(100);
    });
  });

  describe('禁用狀態', () => {
    it('應該在禁用時不可點擊', () => {
      const onSelect = vi.fn();
      render(<ChipSelector selectedValue={100} onSelect={onSelect} disabled />);

      CHIP_VALUES.forEach((value) => {
        const chip = screen.getByTestId(`chip-${value}`);
        fireEvent.click(chip);
      });

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('應該為所有籌碼套用禁用樣式', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} disabled />);

      CHIP_VALUES.forEach((value) => {
        const chip = screen.getByTestId(`chip-${value}`);
        expect(chip.className).toContain('disabled');
      });
    });

    it('應該能切換禁用狀態', () => {
      const onSelect = vi.fn();
      const { rerender } = render(
        <ChipSelector selectedValue={100} onSelect={onSelect} disabled={false} />
      );

      const chip = screen.getByTestId('chip-50');
      fireEvent.click(chip);
      expect(onSelect).toHaveBeenCalledTimes(1);

      rerender(<ChipSelector selectedValue={100} onSelect={onSelect} disabled={true} />);
      fireEvent.click(chip);
      expect(onSelect).toHaveBeenCalledTimes(1); // 不應增加
    });
  });

  describe('視覺樣式', () => {
    it('應該套用正確的容器樣式類別', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      const container = screen.getByTestId('chip-selector');
      expect(container.className).toContain('chip-selector');
    });

    it('應該為籌碼套用不同的顏色類別', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      const chip10 = screen.getByTestId('chip-10');
      const chip1000 = screen.getByTestId('chip-1000');

      expect(chip10.className).toContain('chip');
      expect(chip1000.className).toContain('chip');
    });

    it('應該支援自訂 className', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} className="custom-class" />);

      const container = screen.getByTestId('chip-selector');
      expect(container.className).toContain('custom-class');
    });

    it('應該在禁用時套用禁用樣式到容器', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} disabled />);

      const container = screen.getByTestId('chip-selector');
      expect(container.className).toContain('disabled');
    });
  });

  describe('無障礙性 (Accessibility)', () => {
    it('應該有描述性的 role 屬性', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      const container = screen.getByRole('group');
      expect(container).toBeInTheDocument();
    });

    it('應該有 aria-label', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      const container = screen.getByTestId('chip-selector');
      expect(container).toHaveAttribute('aria-label');
      expect(container.getAttribute('aria-label')).toContain('籌碼選擇');
    });

    it('應該為每個籌碼設置 aria-label', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      CHIP_VALUES.forEach((value) => {
        const chip = screen.getByTestId(`chip-${value}`);
        expect(chip).toHaveAttribute('aria-label');
        const ariaLabel = chip.getAttribute('aria-label');
        expect(ariaLabel).toContain(String(value));
      });
    });

    it('應該在禁用時設置 aria-disabled', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} disabled />);

      const container = screen.getByTestId('chip-selector');
      expect(container).toHaveAttribute('aria-disabled', 'true');
    });

    it('應該支援鍵盤導航', () => {
      render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      CHIP_VALUES.forEach((value) => {
        const chip = screen.getByTestId(`chip-${value}`);
        expect(chip).toHaveAttribute('tabIndex');
      });
    });

    it('應該支援鍵盤選擇 (Enter)', () => {
      const onSelect = vi.fn();
      render(<ChipSelector selectedValue={100} onSelect={onSelect} />);

      const chip50 = screen.getByTestId('chip-50');
      fireEvent.keyDown(chip50, { key: 'Enter', code: 'Enter' });

      expect(onSelect).toHaveBeenCalledWith(50);
    });

    it('應該支援鍵盤選擇 (Space)', () => {
      const onSelect = vi.fn();
      render(<ChipSelector selectedValue={100} onSelect={onSelect} />);

      const chip500 = screen.getByTestId('chip-500');
      fireEvent.keyDown(chip500, { key: ' ', code: 'Space' });

      expect(onSelect).toHaveBeenCalledWith(500);
    });
  });

  describe('佈局和排列', () => {
    it('應該水平排列籌碼', () => {
      const { container } = render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      const selector = screen.getByTestId('chip-selector');
      const styles = window.getComputedStyle(selector);

      // 應該是 flex 或 grid 佈局
      expect(['flex', 'grid', 'inline-flex']).toContain(styles.display);
    });

    it('應該按照金額由小到大排列', () => {
      const { container } = render(<ChipSelector selectedValue={100} onSelect={vi.fn()} />);

      const chips = Array.from(
        container.querySelectorAll('[data-testid^="chip-"]:not([data-testid="chip-selector"])')
      );
      const values = chips.map((chip) => {
        const match = chip.getAttribute('data-testid')?.match(/chip-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });

      expect(values).toEqual([10, 50, 100, 500, 1000]);
    });
  });

  describe('邊界情況', () => {
    it('應該處理未提供 selectedValue 的情況', () => {
      // @ts-expect-error - 測試邊界情況
      const { container } = render(<ChipSelector onSelect={vi.fn()} />);

      expect(container).toBeInTheDocument();
    });

    it('應該處理 onSelect 為 undefined 的情況', () => {
      // @ts-expect-error - 測試邊界情況
      render(<ChipSelector selectedValue={100} />);

      const chip = screen.getByTestId('chip-50');
      expect(() => fireEvent.click(chip)).not.toThrow();
    });

    it('應該處理無效的 selectedValue', () => {
      // @ts-expect-error - 測試邊界情況
      render(<ChipSelector selectedValue={999} onSelect={vi.fn()} />);

      const chips = screen.getAllByTestId(/^chip-/);
      const selectedChips = chips.filter((chip) => chip.className.includes('selected'));

      expect(selectedChips).toHaveLength(0);
    });

    it('應該處理負數 selectedValue', () => {
      // @ts-expect-error - 測試邊界情況
      render(<ChipSelector selectedValue={-100} onSelect={vi.fn()} />);

      const chips = screen.getAllByTestId(/^chip-/);
      const selectedChips = chips.filter((chip) => chip.className.includes('selected'));

      expect(selectedChips).toHaveLength(0);
    });
  });

  describe('整合測試', () => {
    it('應該完整的選擇流程', () => {
      const onSelect = vi.fn();
      const { rerender } = render(<ChipSelector selectedValue={100} onSelect={onSelect} />);

      // 初始選中 100
      expect(screen.getByTestId('chip-100').className).toContain('selected');

      // 點擊 50
      fireEvent.click(screen.getByTestId('chip-50'));
      expect(onSelect).toHaveBeenCalledWith(50);

      // 更新選中狀態
      rerender(<ChipSelector selectedValue={50} onSelect={onSelect} />);
      expect(screen.getByTestId('chip-50').className).toContain('selected');
      expect(screen.getByTestId('chip-100').className).not.toContain('selected');

      // 點擊 1000
      fireEvent.click(screen.getByTestId('chip-1000'));
      expect(onSelect).toHaveBeenCalledWith(1000);

      // 再次更新選中狀態
      rerender(<ChipSelector selectedValue={1000} onSelect={onSelect} />);
      expect(screen.getByTestId('chip-1000').className).toContain('selected');
      expect(screen.getByTestId('chip-50').className).not.toContain('selected');
    });

    it('應該在禁用和啟用之間切換', () => {
      const onSelect = vi.fn();
      const { rerender } = render(
        <ChipSelector selectedValue={100} onSelect={onSelect} disabled={false} />
      );

      // 可以點擊
      fireEvent.click(screen.getByTestId('chip-50'));
      expect(onSelect).toHaveBeenCalledTimes(1);

      // 禁用
      rerender(<ChipSelector selectedValue={100} onSelect={onSelect} disabled={true} />);
      fireEvent.click(screen.getByTestId('chip-500'));
      expect(onSelect).toHaveBeenCalledTimes(1); // 不應增加

      // 重新啟用
      rerender(<ChipSelector selectedValue={100} onSelect={onSelect} disabled={false} />);
      fireEvent.click(screen.getByTestId('chip-1000'));
      expect(onSelect).toHaveBeenCalledTimes(2); // 應該增加
    });

    it('應該支援連續快速點擊', () => {
      const onSelect = vi.fn();
      render(<ChipSelector selectedValue={100} onSelect={onSelect} />);

      const chip50 = screen.getByTestId('chip-50');
      const chip100 = screen.getByTestId('chip-100');
      const chip500 = screen.getByTestId('chip-500');

      fireEvent.click(chip50);
      fireEvent.click(chip100);
      fireEvent.click(chip500);
      fireEvent.click(chip50);
      fireEvent.click(chip100);

      expect(onSelect).toHaveBeenCalledTimes(5);
    });
  });
});
