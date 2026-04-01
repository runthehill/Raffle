import React, { useState, useRef } from 'react';
import NameLoader from './NameLoader';
import './RaffleSetup.css';

const STORAGE_KEY = 'raffle-saved-configs';

function getSavedRaffles() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveRaffleToStorage(config) {
  const saved = getSavedRaffles();
  // Replace if same name exists, otherwise prepend
  const idx = saved.findIndex(s => s.raffleName === config.raffleName);
  if (idx >= 0) {
    saved[idx] = config;
  } else {
    saved.unshift(config);
  }
  // Keep last 20
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.slice(0, 20)));
}

function deleteRaffleFromStorage(raffleName) {
  const saved = getSavedRaffles().filter(s => s.raffleName !== raffleName);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

export default function RaffleSetup({ onStart, themeLogo }) {
  const [raffleName, setRaffleName] = useState('');
  const [prizesText, setPrizesText] = useState('');
  const [names, setNames] = useState([]);
  const [witness1, setWitness1] = useState('');
  const [witness2, setWitness2] = useState('');
  const [error, setError] = useState('');
  const [savedRaffles, setSavedRaffles] = useState(getSavedRaffles);
  const [showSaved, setShowSaved] = useState(false);
  const [saveFlash, setSaveFlash] = useState('');
  const fileInputRef = useRef(null);

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
      setError('Please add some participants.');
      return;
    }

    if (names.length < prizes.length) {
      setError(`Not enough names (${names.length}) for ${prizes.length} prizes. Add more names or fewer prizes.`);
      return;
    }

    onStart({
      raffleName: raffleName.trim(),
      prizes,
      names,
      witnesses: [witness1.trim(), witness2.trim()].filter(w => w.length > 0),
    });
  };

  const handleSave = () => {
    if (!raffleName.trim()) {
      setError('Enter a raffle name before saving.');
      return;
    }
    const config = {
      raffleName: raffleName.trim(),
      prizesText,
      names,
      witness1,
      witness2,
      savedAt: new Date().toISOString(),
    };
    saveRaffleToStorage(config);
    setSavedRaffles(getSavedRaffles());
    setError('');
    setSaveFlash('Saved!');
    setTimeout(() => setSaveFlash(''), 2000);
  };

  const handleLoad = (config) => {
    setRaffleName(config.raffleName || '');
    setPrizesText(config.prizesText || '');
    setNames(config.names || []);
    setWitness1(config.witness1 || '');
    setWitness2(config.witness2 || '');
    setShowSaved(false);
    setError('');
  };

  const handleDelete = (name) => {
    deleteRaffleFromStorage(name);
    setSavedRaffles(getSavedRaffles());
  };

  const handleExport = () => {
    const config = {
      raffleName: raffleName.trim(),
      prizesText,
      names,
      witness1,
      witness2,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raffle-${(raffleName || 'config').replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const config = JSON.parse(ev.target.result);
        handleLoad(config);
      } catch {
        setError('Invalid raffle file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="setup-container">
      {themeLogo && (
        <div className="setup-logo">
          <img src={themeLogo} alt="" className="setup-logo-img" />
        </div>
      )}
      <h1 className="setup-title neon-text-gold">
        RAFFLE
      </h1>
      <h2 className="setup-subtitle">Winner Picker</h2>

      {/* Save/Load toolbar */}
      <div className="setup-toolbar">
        <button className="setup-tool-btn" onClick={() => setShowSaved(!showSaved)} type="button">
          {showSaved ? 'Hide Saved' : 'Load Saved'}
        </button>
        <button className="setup-tool-btn" onClick={handleSave} type="button">
          {saveFlash || 'Save'}
        </button>
        <button className="setup-tool-btn" onClick={handleExport} type="button">
          Export JSON
        </button>
        <button className="setup-tool-btn" onClick={() => fileInputRef.current?.click()} type="button">
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </div>

      {/* Saved raffles dropdown */}
      {showSaved && (
        <div className="setup-saved-list card">
          {savedRaffles.length === 0 ? (
            <div className="setup-saved-empty">No saved raffles yet</div>
          ) : (
            savedRaffles.map((s, i) => (
              <div key={i} className="setup-saved-item">
                <div className="setup-saved-info" onClick={() => handleLoad(s)}>
                  <span className="setup-saved-name">{s.raffleName}</span>
                  <span className="setup-saved-meta">
                    {s.names?.length || 0} names &middot; {s.prizesText?.split('\n').filter(l => l.trim()).length || 0} prizes
                  </span>
                </div>
                <button
                  className="setup-saved-delete"
                  onClick={() => handleDelete(s.raffleName)}
                  type="button"
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>
      )}

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
          <NameLoader onNamesLoaded={setNames} namesCount={names.length} names={names} />
        </div>

        <div className="setup-field">
          <label className="setup-label">
            Witnesses <span className="setup-hint">(optional &mdash; shown on certificates)</span>
          </label>
          <div className="setup-witnesses">
            <input
              type="text"
              className="setup-input"
              placeholder="Witness 1"
              value={witness1}
              onChange={e => setWitness1(e.target.value)}
            />
            <input
              type="text"
              className="setup-input"
              placeholder="Witness 2"
              value={witness2}
              onChange={e => setWitness2(e.target.value)}
            />
          </div>
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
