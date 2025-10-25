# Components

React components organized by category.

## Structure

- **`ui/`** - Reusable UI components (Button, Card, Chip)
- **`game/`** - Game-specific components (BettingArea, CardHand, GameTable)
- **`layout/`** - Layout components (Header, BalanceDisplay)

## Guidelines

- All components should be TypeScript with proper type definitions
- Use functional components with hooks
- Export components as named exports
- Include PropTypes or TypeScript interfaces for props
- Keep components focused and single-responsibility

## Example

```tsx
import { FC } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```
