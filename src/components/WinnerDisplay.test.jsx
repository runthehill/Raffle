import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WinnerDisplay from './WinnerDisplay';

describe('WinnerDisplay', () => {
  const defaultProps = {
    winnerName: 'Alice Johnson',
    prizeName: 'Grand Prize: iPad',
    raffleName: 'Test Raffle',
    witnesses: [],
    certColors: {},
    logo: null,
    onDismiss: vi.fn(),
  };

  it('displays the winner name and prize', () => {
    render(<WinnerDisplay {...defaultProps} />);
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Grand Prize: iPad')).toBeInTheDocument();
    expect(screen.getByText('WINNER!')).toBeInTheDocument();
  });

  it('has download and next draw buttons', () => {
    render(<WinnerDisplay {...defaultProps} />);
    expect(screen.getByText('Download Certificate')).toBeInTheDocument();
    expect(screen.getByText('Next Draw')).toBeInTheDocument();
  });

  it('calls onDismiss when Next Draw is clicked', () => {
    const onDismiss = vi.fn();
    render(<WinnerDisplay {...defaultProps} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByText('Next Draw'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('calls onDismiss when overlay is clicked', () => {
    const onDismiss = vi.fn();
    render(<WinnerDisplay {...defaultProps} onDismiss={onDismiss} />);
    // Click the overlay (outer element)
    fireEvent.click(screen.getByText('WINNER!').closest('.winner-overlay'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
