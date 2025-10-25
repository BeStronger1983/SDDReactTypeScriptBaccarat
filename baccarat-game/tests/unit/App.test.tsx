import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
  });

  it('displays the initial count', () => {
    render(<App />);
    expect(screen.getByRole('button')).toHaveTextContent('count is 0');
  });
});
