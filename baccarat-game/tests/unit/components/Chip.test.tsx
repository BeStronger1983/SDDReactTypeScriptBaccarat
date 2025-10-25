import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Chip } from '@/components/ui/Chip';

describe('Chip', () => {
  describe('Rendering', () => {
    it('should render chip with value', () => {
      render(<Chip value={100} />);
      const chip = screen.getByTestId('chip');
      expect(chip).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should render chip with custom label', () => {
      render(<Chip value={500} label="500" />);
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('should display value as label when no label provided', () => {
      render(<Chip value={1000} />);
      expect(screen.getByText('1000')).toBeInTheDocument();
    });
  });

  describe('Values and Colors', () => {
    it('should render chip with value 10', () => {
      render(<Chip value={10} />);
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should render chip with value 50', () => {
      render(<Chip value={50} />);
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should render chip with value 100', () => {
      render(<Chip value={100} />);
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should render chip with value 500', () => {
      render(<Chip value={500} />);
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('should render chip with value 1000', () => {
      render(<Chip value={1000} />);
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('should apply color based on value', () => {
      const { unmount } = render(<Chip value={10} />);
      let chip = screen.getByTestId('chip');
      expect(chip.className).toContain('chip-10');
      unmount();

      render(<Chip value={100} />);
      chip = screen.getByTestId('chip');
      expect(chip.className).toContain('chip-100');
    });
  });

  describe('Selected State', () => {
    it('should not be selected by default', () => {
      render(<Chip value={100} />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).not.toContain('selected');
    });

    it('should render selected chip', () => {
      render(<Chip value={100} selected />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('selected');
    });

    it('should toggle selection state', () => {
      const { rerender } = render(<Chip value={100} selected={false} />);
      let chip = screen.getByTestId('chip');
      expect(chip.className).not.toContain('selected');

      rerender(<Chip value={100} selected />);
      chip = screen.getByTestId('chip');
      expect(chip.className).toContain('selected');
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      render(<Chip value={100} />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).not.toContain('disabled');
    });

    it('should render disabled chip', () => {
      render(<Chip value={100} disabled />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('disabled');
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Chip value={100} disabled onClick={handleClick} />);
      const chip = screen.getByTestId('chip');
      fireEvent.click(chip);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Click Events', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Chip value={100} onClick={handleClick} />);
      const chip = screen.getByTestId('chip');
      fireEvent.click(chip);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick with value', () => {
      const handleClick = vi.fn();
      render(<Chip value={500} onClick={handleClick} />);
      const chip = screen.getByTestId('chip');
      fireEvent.click(chip);
      expect(handleClick).toHaveBeenCalledWith(500);
    });

    it('should call onClick multiple times', () => {
      const handleClick = vi.fn();
      render(<Chip value={100} onClick={handleClick} />);
      const chip = screen.getByTestId('chip');
      fireEvent.click(chip);
      fireEvent.click(chip);
      fireEvent.click(chip);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should work without onClick handler', () => {
      render(<Chip value={100} />);
      const chip = screen.getByTestId('chip');
      expect(() => fireEvent.click(chip)).not.toThrow();
    });
  });

  describe('Size Variants', () => {
    it('should render medium size by default', () => {
      render(<Chip value={100} />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('medium');
    });

    it('should render small size', () => {
      render(<Chip value={100} size="small" />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('small');
    });

    it('should render large size', () => {
      render(<Chip value={100} size="large" />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('large');
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      render(<Chip value={100} className="custom-chip" />);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveClass('custom-chip');
    });

    it('should preserve default classes with custom className', () => {
      render(<Chip value={100} className="custom-chip" />);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveClass('custom-chip');
      expect(chip.className).toContain('medium');
    });
  });

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Chip value={100} />);
      const chip = screen.getByRole('button');
      expect(chip).toBeInTheDocument();
    });

    it('should have aria-label with value', () => {
      render(<Chip value={100} />);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('aria-label', 'Chip value 100');
    });

    it('should have aria-pressed when selected', () => {
      render(<Chip value={100} selected />);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('aria-pressed', 'true');
    });

    it('should not have aria-pressed when not selected', () => {
      render(<Chip value={100} />);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('aria-pressed', 'false');
    });

    it('should have aria-disabled when disabled', () => {
      render(<Chip value={100} disabled />);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Common Chip Values', () => {
    it('should render all standard chip values', () => {
      const values = [10, 50, 100, 500, 1000];
      values.forEach((value) => {
        const { unmount } = render(<Chip value={value} />);
        expect(screen.getByText(String(value))).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Game Context', () => {
    it('should render betting chip for selection', () => {
      const handleClick = vi.fn();
      render(<Chip value={100} onClick={handleClick} />);
      const chip = screen.getByTestId('chip');
      fireEvent.click(chip);
      expect(handleClick).toHaveBeenCalledWith(100);
    });

    it('should show selected chip when active', () => {
      render(<Chip value={100} selected />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('selected');
    });

    it('should disable chip when no balance', () => {
      render(<Chip value={1000} disabled />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('disabled');
    });
  });

  describe('Combined Props', () => {
    it('should handle size and selected together', () => {
      render(<Chip value={100} size="large" selected />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('large');
      expect(chip.className).toContain('selected');
    });

    it('should handle size, selected, and disabled together', () => {
      render(<Chip value={100} size="small" selected disabled />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('small');
      expect(chip.className).toContain('selected');
      expect(chip.className).toContain('disabled');
    });

    it('should handle all props together', () => {
      const handleClick = vi.fn();
      render(
        <Chip
          value={100}
          size="large"
          selected
          disabled={false}
          className="custom"
          onClick={handleClick}
        />
      );
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('large');
      expect(chip.className).toContain('selected');
      expect(chip).toHaveClass('custom');
      fireEvent.click(chip);
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle large values', () => {
      render(<Chip value={10000} />);
      expect(screen.getByText('10000')).toBeInTheDocument();
    });

    it('should handle custom labels for large values', () => {
      render(<Chip value={10000} label="10K" />);
      expect(screen.getByText('10K')).toBeInTheDocument();
    });

    it('should handle rapid selection changes', () => {
      const { rerender } = render(<Chip value={100} selected={false} />);
      rerender(<Chip value={100} selected />);
      rerender(<Chip value={100} selected={false} />);
      rerender(<Chip value={100} selected />);
      expect(screen.getByTestId('chip')).toBeInTheDocument();
    });
  });

  describe('Visual State', () => {
    it('should have chip class', () => {
      render(<Chip value={100} />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).toContain('chip');
    });

    it('should be clickable when not disabled', () => {
      render(<Chip value={100} />);
      const chip = screen.getByTestId('chip');
      expect(chip.className).not.toContain('disabled');
    });
  });

  describe('Event Handling', () => {
    it('should handle onMouseEnter', () => {
      const handleMouseEnter = vi.fn();
      render(<Chip value={100} onMouseEnter={handleMouseEnter} />);
      const chip = screen.getByTestId('chip');
      fireEvent.mouseEnter(chip);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('should handle onMouseLeave', () => {
      const handleMouseLeave = vi.fn();
      render(<Chip value={100} onMouseLeave={handleMouseLeave} />);
      const chip = screen.getByTestId('chip');
      fireEvent.mouseLeave(chip);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('should handle onFocus', () => {
      const handleFocus = vi.fn();
      render(<Chip value={100} onFocus={handleFocus} />);
      const chip = screen.getByTestId('chip');
      fireEvent.focus(chip);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle onBlur', () => {
      const handleBlur = vi.fn();
      render(<Chip value={100} onBlur={handleBlur} />);
      const chip = screen.getByTestId('chip');
      fireEvent.blur(chip);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should be focusable', () => {
      render(<Chip value={100} />);
      const chip = screen.getByTestId('chip');
      chip.focus();
      expect(chip).toHaveFocus();
    });

    it('should handle Enter key', () => {
      const handleClick = vi.fn();
      render(<Chip value={100} onClick={handleClick} />);
      const chip = screen.getByTestId('chip');
      fireEvent.keyDown(chip, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalled();
    });

    it('should handle Space key', () => {
      const handleClick = vi.fn();
      render(<Chip value={100} onClick={handleClick} />);
      const chip = screen.getByTestId('chip');
      fireEvent.keyDown(chip, { key: ' ' });
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
