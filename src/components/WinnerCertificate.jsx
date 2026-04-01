import React, { useRef, useEffect } from 'react';
import { renderCertificate, downloadCertificate } from '../utils/certificate';
import './WinnerCertificate.css';

export default function WinnerCertificate({ raffleName, winnerName, prizeName, witnesses, date, certColors, logo }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const canvas = renderCertificate({ raffleName, winnerName, prizeName, witnesses, date, certColors, logo });
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.borderRadius = '8px';
    container.appendChild(canvas);
  }, [raffleName, winnerName, prizeName, witnesses, date, certColors, logo]);

  const handleDownload = () => {
    downloadCertificate({ raffleName, winnerName, prizeName, witnesses, date, certColors, logo });
  };

  return (
    <div className="certificate-wrapper">
      <div className="certificate-preview" ref={containerRef} />
      <button className="certificate-download-btn" onClick={handleDownload}>
        Download Certificate
      </button>
    </div>
  );
}
