import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RaffleSetup from './RaffleSetup';

describe('RaffleSetup', () => {
  it('renders the title and form fields', () => {
    render(<RaffleSetup onStart={() => {}} />);
    expect(screen.getByText('RAFFLE')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Annual Company Raffle/)).toBeInTheDocument();
    expect(screen.getByText('Prizes')).toBeInTheDocument();
    expect(screen.getByText('Participants')).toBeInTheDocument();
    expect(screen.getByText('Witnesses')).toBeInTheDocument();
  });

  it('start button is disabled when form is empty', () => {
    render(<RaffleSetup onStart={() => {}} />);
    const btn = screen.getByText('START RAFFLE');
    expect(btn).toBeDisabled();
  });

  it('shows error when starting without required fields', () => {
    render(<RaffleSetup onStart={() => {}} />);
    // Fill only the name
    fireEvent.change(screen.getByPlaceholderText(/Annual Company Raffle/), {
      target: { value: 'Test Raffle' },
    });
    // Button still disabled (no prizes or names)
    const btn = screen.getByText('START RAFFLE');
    expect(btn).toBeDisabled();
  });

  it('shows save/load toolbar buttons', () => {
    render(<RaffleSetup onStart={() => {}} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Load Saved')).toBeInTheDocument();
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
    expect(screen.getByText('Import JSON')).toBeInTheDocument();
  });

  it('shows file upload and type names tabs', () => {
    render(<RaffleSetup onStart={() => {}} />);
    expect(screen.getByText('File Upload')).toBeInTheDocument();
    expect(screen.getByText('Type Names')).toBeInTheDocument();
  });
});
