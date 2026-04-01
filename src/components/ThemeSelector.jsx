import React from 'react';
import { themes } from '../themes';
import './ThemeSelector.css';

export default function ThemeSelector({ themeId, onChange }) {
  return (
    <div className="theme-selector">
      <label className="theme-selector-label" htmlFor="theme-select">Theme</label>
      <select
        id="theme-select"
        className="theme-selector-select"
        value={themeId}
        onChange={e => onChange(e.target.value)}
      >
        {themes.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}
