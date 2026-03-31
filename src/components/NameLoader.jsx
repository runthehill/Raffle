import React, { useRef, useState } from 'react';
import './NameLoader.css';

export default function NameLoader({ onNamesLoaded, namesCount }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const parseFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let text = e.target.result;
      // Strip BOM
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }
      const names = text
        .split(/\r?\n/)
        .map(n => n.trim())
        .filter(n => n.length > 0);
      setFileName(file.name);
      onNamesLoaded(names);
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

  return (
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
          <span className="name-loader-file">{fileName}</span>
          <span className="name-loader-change">Click or drop to change</span>
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
  );
}
