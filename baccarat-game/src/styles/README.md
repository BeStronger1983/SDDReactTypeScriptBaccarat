# Styles

Global styles and CSS modules.

## Purpose

Application-wide styles, themes, and CSS modules.

## Expected Files

- `global.css` - Global styles (reset, colors, fonts, spacing)
- `animations.css` - CSS animations and transitions
- `theme.css` - CSS variables for theming
- Component-specific CSS modules (if not using styled-components)

## Guidelines

- Use CSS modules for component-specific styles
- Define CSS variables in theme.css for easy theming
- Follow BEM naming convention for class names
- Keep styles modular and reusable
- Mobile-first approach (though desktop-focused per spec)

## Example Structure

```css
/* theme.css */
:root {
  /* Colors */
  --color-primary: #2c5f2d;
  --color-secondary: #97c05c;
  --color-accent: #ffcc00;
  --color-background: #1a1a2e;
  --color-surface: #16213e;
  --color-text: #ffffff;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family-base: 'Inter', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
}
```
