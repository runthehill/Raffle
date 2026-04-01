import React, { useRef, useState, useEffect } from 'react';
import './Marquee.css';

const SEPARATOR = ' \u2733 '; // ✳

export default function Marquee({ text }) {
  const containerRef = useRef(null);
  const [repeats, setRepeats] = useState(10);

  // Calculate how many repeats we need so the content is always
  // wider than the viewport, guaranteeing a seamless loop.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = document.createElement('span');
    measure.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:Bungee,Arial Black,sans-serif;font-size:1rem;letter-spacing:4px;text-transform:uppercase;padding:0 20px;';
    measure.textContent = `${SEPARATOR} ${text} `;
    document.body.appendChild(measure);
    const chunkWidth = measure.offsetWidth;
    document.body.removeChild(measure);

    const viewportWidth = container.offsetWidth;
    // Need at least 2x viewport so -50% translation loops seamlessly
    const needed = Math.ceil((viewportWidth * 2) / chunkWidth) + 2;
    setRepeats(Math.max(needed, 4));
  }, [text]);

  const chunk = `${SEPARATOR} ${text} `;

  return (
    <div className="marquee-container" ref={containerRef}>
      <div className="marquee-track">
        <span className="marquee-text">
          {Array.from({ length: repeats }, () => chunk).join('')}
        </span>
        <span className="marquee-text" aria-hidden="true">
          {Array.from({ length: repeats }, () => chunk).join('')}
        </span>
      </div>
    </div>
  );
}
