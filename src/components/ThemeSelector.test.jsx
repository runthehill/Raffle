import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelector from './ThemeSelector';
import { themes } from '../themes';

describe('ThemeSelector', () => {
  it('renders a dropdown with all themes', () => {
    render(<ThemeSelector themeId="dark" onChange={() => {}} />);
    themes.forEach((t) => {
      expect(screen.getByText(t.name)).toBeInTheDocument();
    });
  });

  it('shows the current theme as selected', () => {
    render(<ThemeSelector themeId="sligo" onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('sligo');
  });

  it('calls onChange when a different theme is selected', () => {
    const handler = vi.fn();
    render(<ThemeSelector themeId="dark" onChange={handler} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'light' } });
    expect(handler).toHaveBeenCalledWith('light');
  });
});
