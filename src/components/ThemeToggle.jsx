import React from 'react';
import './ThemeToggle.css';

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <span className={`theme-toggle-icon ${theme === 'dark' ? 'theme-toggle-icon--active' : ''}`}>
        &#9790;
      </span>
      <span className={`theme-toggle-icon ${theme === 'light' ? 'theme-toggle-icon--active' : ''}`}>
        &#9728;
      </span>
    </button>
  );
}
