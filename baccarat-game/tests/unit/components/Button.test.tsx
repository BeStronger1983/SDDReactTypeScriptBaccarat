import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    it('should render button with children', () => {
      render(
        <Button>
          <span>Click</span> <strong>Me</strong>
        </Button>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Click')).toBeInTheDocument();
      expect(screen.getByText('Me')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('primary');
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('secondary');
    });

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('outline');
    });

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ghost');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('medium');
    });

    it('should render small size', () => {
      render(<Button size="small">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('small');
    });

    it('should render large size', () => {
      render(<Button size="large">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('large');
    });
  });

  describe('Disabled State', () => {
    it('should render enabled button by default', () => {
      render(<Button>Enabled</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should render disabled button', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should apply disabled class when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled');
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Click Events', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick multiple times', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should work without onClick handler', () => {
      render(<Button>No Handler</Button>);
      const button = screen.getByRole('button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('Full Width', () => {
    it('should not be full width by default', () => {
      render(<Button>Normal</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('full-width');
    });

    it('should render full width button', () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('full-width');
    });
  });

  describe('Type Attribute', () => {
    it('should have type="button" by default', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support type="submit"', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support type="reset"', () => {
      render(<Button type="reset">Reset</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      const button = screen.getByRole('button', { name: 'Close dialog' });
      expect(button).toBeInTheDocument();
    });

    it('should support aria-disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be keyboard accessible', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Button</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Combined Props', () => {
    it('should handle variant and size together', () => {
      render(
        <Button variant="secondary" size="large">
          Large Secondary
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('secondary');
      expect(button).toHaveClass('large');
    });

    it('should handle variant, size, and fullWidth', () => {
      render(
        <Button variant="outline" size="small" fullWidth>
          Small Outline Full
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('outline');
      expect(button).toHaveClass('small');
      expect(button).toHaveClass('full-width');
    });

    it('should handle custom className with variant and size', () => {
      render(
        <Button variant="ghost" size="large" className="custom">
          Custom Ghost Large
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ghost');
      expect(button).toHaveClass('large');
      expect(button).toHaveClass('custom');
    });
  });

  describe('Game-Specific Use Cases', () => {
    it('should render deal button', () => {
      render(<Button variant="primary">Deal</Button>);
      expect(screen.getByRole('button', { name: 'Deal' })).toBeInTheDocument();
    });

    it('should render clear bets button', () => {
      render(<Button variant="secondary">Clear Bets</Button>);
      expect(screen.getByRole('button', { name: 'Clear Bets' })).toBeInTheDocument();
    });

    it('should render reset button', () => {
      render(<Button variant="outline">Reset</Button>);
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    });

    it('should disable deal button during game', () => {
      render(
        <Button disabled variant="primary">
          Deal
        </Button>
      );
      const button = screen.getByRole('button', { name: 'Deal' });
      expect(button).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Button />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle numeric children', () => {
      render(<Button>{100}</Button>);
      expect(screen.getByRole('button', { name: '100' })).toBeInTheDocument();
    });

    it('should handle boolean props correctly', () => {
      render(
        <Button disabled={false} fullWidth={false}>
          Button
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass('full-width');
    });
  });

  describe('Event Handling', () => {
    it('should handle onMouseEnter', () => {
      const handleMouseEnter = vi.fn();
      render(<Button onMouseEnter={handleMouseEnter}>Hover Me</Button>);
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('should handle onMouseLeave', () => {
      const handleMouseLeave = vi.fn();
      render(<Button onMouseLeave={handleMouseLeave}>Leave Me</Button>);
      const button = screen.getByRole('button');
      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('should handle onFocus', () => {
      const handleFocus = vi.fn();
      render(<Button onFocus={handleFocus}>Focus Me</Button>);
      const button = screen.getByRole('button');
      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle onBlur', () => {
      const handleBlur = vi.fn();
      render(<Button onBlur={handleBlur}>Blur Me</Button>);
      const button = screen.getByRole('button');
      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });
});
