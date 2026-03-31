import React from 'react';
import './Marquee.css';

export default function Marquee({ text }) {
  return (
    <div className="marquee-container">
      <div className="marquee-track">
        <span className="marquee-text">
          &#9733; {text} &#9733; {text} &#9733; {text} &#9733; {text} &#9733;&nbsp;
        </span>
        <span className="marquee-text" aria-hidden="true">
          &#9733; {text} &#9733; {text} &#9733; {text} &#9733; {text} &#9733;&nbsp;
        </span>
      </div>
    </div>
  );
}
