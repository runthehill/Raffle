import React, { useState } from 'react';
import NameLoader from './NameLoader';
import './RaffleSetup.css';

export default function RaffleSetup({ onStart }) {
  const [raffleName, setRaffleName] = useState('');
  const [prizesText, setPrizesText] = useState('');
  const [names, setNames] = useState([]);
  const [error, setError] = useState('');

  const handleStart = () => {
    setError('');

    if (!raffleName.trim()) {
      setError('Please enter a raffle name.');
      return;
    }

    const prizes = prizesText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (prizes.length === 0) {
      setError('Please enter at least one prize.');
      return;
    }

    if (names.length === 0) {
      setError('Please load a names file.');
      return;
    }

    if (names.length < prizes.length) {
      setError(`Not enough names (${names.length}) for ${prizes.length} prizes. Add more names or fewer prizes.`);
      return;
    }

    onStart({ raffleName: raffleName.trim(), prizes, names });
  };

  return (
    <div className="setup-container">
      <h1 className="setup-title neon-text-gold">
        RAFFLE
      </h1>
      <h2 className="setup-subtitle">Winner Picker</h2>

      <div className="setup-form">
        <div className="setup-field">
          <label className="setup-label">Raffle Name</label>
          <input
            type="text"
            className="setup-input"
            placeholder="e.g. Annual Company Raffle 2026"
            value={raffleName}
            onChange={e => setRaffleName(e.target.value)}
          />
        </div>

        <div className="setup-field">
          <label className="setup-label">
            Prizes <span className="setup-hint">(one per line, in draw order)</span>
          </label>
          <textarea
            className="setup-textarea"
            placeholder={"Grand Prize: iPad Pro\nSecond Prize: AirPods Max\nThird Prize: Gift Card $50"}
            value={prizesText}
            onChange={e => setPrizesText(e.target.value)}
            rows={6}
          />
        </div>

        <div className="setup-field">
          <label className="setup-label">Participants</label>
          <NameLoader onNamesLoaded={setNames} namesCount={names.length} />
        </div>

        {error && <div className="setup-error">{error}</div>}

        <button
          className="setup-start-btn"
          onClick={handleStart}
          disabled={!raffleName.trim() || !prizesText.trim() || names.length === 0}
        >
          START RAFFLE
        </button>
      </div>
    </div>
  );
}
