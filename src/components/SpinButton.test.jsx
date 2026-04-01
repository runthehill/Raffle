import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SpinButton from './SpinButton';

describe('SpinButton', () => {
  it('renders with SPIN! text when idle', () => {
    render(<SpinButton onClick={() => {}} disabled={false} isSpinning={false} />);
    expect(screen.getByText('SPIN!')).toBeInTheDocument();
  });

  it('renders with SPINNING... text when spinning', () => {
    render(<SpinButton onClick={() => {}} disabled={true} isSpinning={true} />);
    expect(screen.getByText('SPINNING...')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handler = vi.fn();
    render(<SpinButton onClick={handler} disabled={false} isSpinning={false} />);
    fireEvent.click(screen.getByText('SPIN!'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const handler = vi.fn();
    render(<SpinButton onClick={handler} disabled={true} isSpinning={false} />);
    fireEvent.click(screen.getByText('SPIN!'));
    expect(handler).not.toHaveBeenCalled();
  });
});
