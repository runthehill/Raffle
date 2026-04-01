import { describe, it, expect } from 'vitest';
import { themes, getTheme } from './themes';

describe('themes', () => {
  it('has at least one theme', () => {
    expect(themes.length).toBeGreaterThan(0);
  });

  it('every theme has required fields', () => {
    themes.forEach((t) => {
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('cert');
      expect(typeof t.id).toBe('string');
      expect(typeof t.name).toBe('string');
    });
  });

  it('every theme has a complete cert color palette', () => {
    const requiredKeys = [
      'bg', 'inner', 'border', 'borderFaded', 'title', 'heading',
      'body', 'winner', 'prize', 'star', 'footer', 'divider', 'dividerDot',
    ];
    themes.forEach((t) => {
      requiredKeys.forEach((key) => {
        expect(t.cert).toHaveProperty(key);
      });
    });
  });

  it('has no duplicate theme IDs', () => {
    const ids = themes.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getTheme', () => {
  it('returns the correct theme by ID', () => {
    const dark = getTheme('dark');
    expect(dark.id).toBe('dark');
    expect(dark.name).toBe('Dark Carnival');
  });

  it('returns the first theme for an unknown ID', () => {
    const fallback = getTheme('nonexistent');
    expect(fallback.id).toBe(themes[0].id);
  });
});
