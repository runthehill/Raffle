import React from 'react';
import './SpinButton.css';

export default function SpinButton({ onClick, disabled, isSpinning }) {
  return (
    <button
      className={`spin-btn ${isSpinning ? 'spin-btn--spinning' : ''} ${!disabled && !isSpinning ? 'spin-btn--ready' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="spin-btn-text">
        {isSpinning ? 'SPINNING...' : 'SPIN!'}
      </span>
    </button>
  );
}
