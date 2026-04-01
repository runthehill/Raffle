import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WinnerHistory from './WinnerHistory';

describe('WinnerHistory', () => {
  it('shows empty state when no winners', () => {
    render(<WinnerHistory winners={[]} />);
    expect(screen.getByText(/No winners yet/)).toBeInTheDocument();
  });

  it('displays winners in a list', () => {
    const winners = [
      { name: 'Alice', prize: 'Prize A' },
      { name: 'Bob', prize: 'Prize B' },
    ];
    render(<WinnerHistory winners={winners} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Prize A')).toBeInTheDocument();
    expect(screen.getByText('Prize B')).toBeInTheDocument();
  });

  it('shows round numbers', () => {
    const winners = [
      { name: 'Alice', prize: 'Prize A' },
      { name: 'Bob', prize: 'Prize B' },
    ];
    render(<WinnerHistory winners={winners} />);
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });
});
