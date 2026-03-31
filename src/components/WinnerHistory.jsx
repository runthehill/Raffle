import React, { useRef, useEffect } from 'react';
import './WinnerHistory.css';

export default function WinnerHistory({ winners }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [winners.length]);

  return (
    <div className="history card">
      <h3 className="history-title neon-text-gold">Results</h3>

      {winners.length === 0 ? (
        <div className="history-empty">
          No winners yet &mdash; give it a spin!
        </div>
      ) : (
        <div className="history-list" ref={listRef}>
          {winners.map((w, i) => (
            <div key={i} className="history-item" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="history-round">#{i + 1}</div>
              <div className="history-details">
                <div className="history-winner-name">{w.name}</div>
                <div className="history-prize">{w.prize}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
