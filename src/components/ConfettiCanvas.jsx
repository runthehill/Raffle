import React, { useRef, useEffect } from 'react';
import { createConfettiSystem } from '../utils/confetti';

export default function ConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const system = createConfettiSystem(canvas);
    system.fire();

    // Second burst for extra drama
    const timer = setTimeout(() => system.fire(), 300);

    return () => {
      clearTimeout(timer);
      system.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    />
  );
}
