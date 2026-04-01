import React from 'react';
import WinnerCertificate from './WinnerCertificate';
import { downloadAllCertificates } from '../utils/certificate';
import './RaffleComplete.css';

export default function RaffleComplete({ raffleName, winners, witnesses, onNewRaffle }) {
  const [selectedWinner, setSelectedWinner] = React.useState(null);

  const handleDownloadAll = () => {
    downloadAllCertificates(raffleName, winners, witnesses);
  };

  return (
    <div className="complete-container">
      <h1 className="complete-title neon-text-gold">RAFFLE COMPLETE!</h1>
      <p className="complete-subtitle">{raffleName}</p>

      <div className="complete-summary card">
        <h3 className="complete-section-title neon-text-gold">All Winners</h3>
        <div className="complete-table">
          {winners.map((w, i) => (
            <div
              key={i}
              className={`complete-row ${selectedWinner === i ? 'complete-row--selected' : ''}`}
              onClick={() => setSelectedWinner(selectedWinner === i ? null : i)}
            >
              <span className="complete-round">#{i + 1}</span>
              <span className="complete-prize">{w.prize}</span>
              <span className="complete-arrow">&rarr;</span>
              <span className="complete-winner">{w.name}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedWinner !== null && (
        <div className="complete-certificate">
          <WinnerCertificate
            raffleName={raffleName}
            winnerName={winners[selectedWinner].name}
            prizeName={winners[selectedWinner].prize}
            witnesses={witnesses}
            date={winners[selectedWinner].timestamp}
          />
        </div>
      )}

      <div className="complete-actions">
        <button className="complete-download-btn" onClick={handleDownloadAll}>
          Download All Certificates
        </button>
        <button className="complete-new-btn" onClick={onNewRaffle}>
          New Raffle
        </button>
      </div>
    </div>
  );
}
