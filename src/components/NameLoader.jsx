import React, { useRef, useState } from 'react';
import './NameLoader.css';

export default function NameLoader({ onNamesLoaded, namesCount, names }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [manualName, setManualName] = useState('');
  const [showManual, setShowManual] = useState(false);

  const parseFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let text = e.target.result;
      // Strip BOM
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }
      const parsed = text
        .split(/\r?\n/)
        .map(n => n.trim())
        .filter(n => n.length > 0);
      setFileName(file.name);
      onNamesLoaded(parsed);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) parseFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const handleAddManualName = () => {
    const trimmed = manualName.trim();
    if (!trimmed) return;
    // Parse in case user pasted multiple names (one per line)
    const newNames = trimmed.split(/\r?\n/).map(n => n.trim()).filter(n => n.length > 0);
    onNamesLoaded([...(names || []), ...newNames]);
    setManualName('');
    setFileName('');
  };

  const handleManualKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddManualName();
    }
  };

  const handleRemoveName = (index) => {
    const updated = [...(names || [])];
    updated.splice(index, 1);
    onNamesLoaded(updated);
  };

  return (
    <div className="name-loader-wrapper">
      <div className="name-loader-tabs">
        <button
          className={`name-loader-tab ${!showManual ? 'name-loader-tab--active' : ''}`}
          onClick={() => setShowManual(false)}
          type="button"
        >
          File Upload
        </button>
        <button
          className={`name-loader-tab ${showManual ? 'name-loader-tab--active' : ''}`}
          onClick={() => setShowManual(true)}
          type="button"
        >
          Type Names
        </button>
      </div>

      {!showManual ? (
        <div
          className={`name-loader ${isDragging ? 'name-loader--dragging' : ''} ${namesCount > 0 ? 'name-loader--loaded' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {namesCount > 0 ? (
            <div className="name-loader-loaded">
              <span className="name-loader-check">&#10003;</span>
              <span className="name-loader-count">{namesCount} names loaded</span>
              {fileName && <span className="name-loader-file">{fileName}</span>}
              <span className="name-loader-change">Click or drop to replace</span>
            </div>
          ) : (
            <div className="name-loader-empty">
              <span className="name-loader-icon">&#128196;</span>
              <span>Drop a text file here</span>
              <span className="name-loader-or">or click to browse</span>
              <span className="name-loader-hint">One name per line (.txt or .csv)</span>
            </div>
          )}
        </div>
      ) : (
        <div className="name-loader-manual">
          <div className="name-loader-manual-input-row">
            <textarea
              className="name-loader-manual-input"
              placeholder="Type or paste names (one per line)..."
              value={manualName}
              onChange={e => setManualName(e.target.value)}
              onKeyDown={handleManualKeyDown}
              rows={3}
            />
            <button
              className="name-loader-add-btn"
              onClick={handleAddManualName}
              disabled={!manualName.trim()}
              type="button"
            >
              ADD
            </button>
          </div>
          <div className="name-loader-manual-hint">
            Press Enter to add, or paste multiple names (one per line)
          </div>
        </div>
      )}

      {namesCount > 0 && (
        <div className="name-loader-list">
          <div className="name-loader-list-header">
            <span>{namesCount} participant{namesCount !== 1 ? 's' : ''}</span>
            <button
              className="name-loader-clear-btn"
              onClick={() => { onNamesLoaded([]); setFileName(''); }}
              type="button"
            >
              Clear All
            </button>
          </div>
          <div className="name-loader-names">
            {(names || []).map((name, i) => (
              <div key={i} className="name-loader-name-tag">
                <span>{name}</span>
                <button
                  className="name-loader-name-remove"
                  onClick={(e) => { e.stopPropagation(); handleRemoveName(i); }}
                  type="button"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
