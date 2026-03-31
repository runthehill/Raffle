import React from 'react';
import { downloadCertificate } from '../utils/certificate';
import './WinnerDisplay.css';

export default function WinnerDisplay({ winnerName, prizeName, raffleName, onDismiss }) {
  const handleDownload = () => {
    downloadCertificate({
      raffleName,
      winnerName,
      prizeName,
      date: new Date().toISOString(),
    });
  };

  return (
    <div className="winner-overlay" onClick={onDismiss}>
      <div className="winner-modal" onClick={e => e.stopPropagation()}>
        <div className="winner-stars">&#9733; &#9733; &#9733;</div>
        <div className="winner-label">WINNER!</div>
        <div className="winner-name neon-text-gold">{winnerName}</div>
        <div className="winner-prize-label">wins</div>
        <div className="winner-prize-name neon-text-pink">{prizeName}</div>
        <div className="winner-actions">
          <button className="winner-cert-btn" onClick={handleDownload}>
            Download Certificate
          </button>
          <button className="winner-next-btn" onClick={onDismiss}>
            Next Draw
          </button>
        </div>
      </div>
    </div>
  );
}
