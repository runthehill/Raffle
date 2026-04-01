import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrizeDisplay from './PrizeDisplay';

describe('PrizeDisplay', () => {
  it('shows the prize name and draw progress', () => {
    render(<PrizeDisplay prize="Grand Prize: iPad" currentIndex={0} totalPrizes={3} />);
    expect(screen.getByText('Grand Prize: iPad')).toBeInTheDocument();
    expect(screen.getByText('Draw 1 of 3')).toBeInTheDocument();
  });

  it('updates progress for later draws', () => {
    render(<PrizeDisplay prize="Second Prize" currentIndex={1} totalPrizes={5} />);
    expect(screen.getByText('Draw 2 of 5')).toBeInTheDocument();
  });
});
