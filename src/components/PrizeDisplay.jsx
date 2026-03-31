import React from 'react';
import './PrizeDisplay.css';

export default function PrizeDisplay({ prize, currentIndex, totalPrizes }) {
  return (
    <div className="prize-display">
      <div className="prize-progress">
        Draw {currentIndex + 1} of {totalPrizes}
      </div>
      <div className="prize-label">NOW DRAWING FOR</div>
      <div className="prize-name neon-text-gold">{prize}</div>
    </div>
  );
}
