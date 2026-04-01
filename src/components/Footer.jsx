import React from 'react';
import { version } from '../../package.json';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <span>Jonathan's Raffle Winner Picker v{version}</span>
      <span className="app-footer-sep">&middot;</span>
      <a
        className="app-footer-link"
        href="https://github.com/runthehill/raffle-winner-picker"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </footer>
  );
}
