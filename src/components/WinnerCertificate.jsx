import React, { useRef, useEffect } from 'react';
import { renderCertificate, downloadCertificate } from '../utils/certificate';
import './WinnerCertificate.css';

export default function WinnerCertificate({ raffleName, winnerName, prizeName, date }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous
    container.innerHTML = '';

    const canvas = renderCertificate({ raffleName, winnerName, prizeName, date });
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.borderRadius = '8px';
    container.appendChild(canvas);
  }, [raffleName, winnerName, prizeName, date]);

  const handleDownload = () => {
    downloadCertificate({ raffleName, winnerName, prizeName, date });
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
