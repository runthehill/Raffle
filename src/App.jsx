import React, { useState, useCallback } from 'react';
import RaffleSetup from './components/RaffleSetup';
import SlotMachine from './components/SlotMachine';
import SpinButton from './components/SpinButton';
import PrizeDisplay from './components/PrizeDisplay';
import WinnerDisplay from './components/WinnerDisplay';
import WinnerHistory from './components/WinnerHistory';
import ConfettiCanvas from './components/ConfettiCanvas';
import Marquee from './components/Marquee';
import RaffleComplete from './components/RaffleComplete';
import { pickRandom } from './utils/shuffle';

export default function App() {
  // App phases: 'setup' | 'drawing' | 'complete'
  const [phase, setPhase] = useState('setup');

  // Raffle config
  const [raffleName, setRaffleName] = useState('');
  const [prizes, setPrizes] = useState([]);
  const [names, setNames] = useState([]);

  // Drawing state
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [winners, setWinners] = useState([]); // [{ name, prize, timestamp }]
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  // Eligible names (exclude past winners)
  const wonNames = new Set(winners.map(w => w.name));
  const eligibleNames = names.filter(n => !wonNames.has(n));

  const currentPrize = prizes[currentPrizeIndex] || null;

  const handleStartRaffle = useCallback((config) => {
    setRaffleName(config.raffleName);
    setPrizes(config.prizes);
    setNames(config.names);
    setCurrentPrizeIndex(0);
    setWinners([]);
    setPhase('drawing');
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning || eligibleNames.length === 0) return;

    // Pre-select winner
    const winner = pickRandom(eligibleNames);
    setCurrentWinner(winner);
    setIsSpinning(true);
    setSpinKey(k => k + 1);
  }, [isSpinning, eligibleNames]);

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false);
    setShowConfetti(true);
    setShowWinnerModal(true);
  }, []);

  const handleDismissWinner = useCallback(() => {
    if (!currentWinner) return;

    setShowWinnerModal(false);
    setShowConfetti(false);

    // Add to winners list
    setWinners(prev => [...prev, {
      name: currentWinner,
      prize: currentPrize,
      timestamp: new Date().toISOString(),
    }]);

    // Advance to next prize or complete
    if (currentPrizeIndex + 1 >= prizes.length) {
      // Small delay so the history updates before transitioning
      setTimeout(() => setPhase('complete'), 300);
    } else {
      setCurrentPrizeIndex(i => i + 1);
    }
    setCurrentWinner(null);
  }, [currentWinner, currentPrize, currentPrizeIndex, prizes.length]);

  const handleNewRaffle = useCallback(() => {
    setPhase('setup');
    setRaffleName('');
    setPrizes([]);
    setNames([]);
    setCurrentPrizeIndex(0);
    setWinners([]);
    setCurrentWinner(null);
    setShowWinnerModal(false);
    setShowConfetti(false);
  }, []);

  if (phase === 'setup') {
    return (
      <div className="app">
        <div className="app-content">
          <RaffleSetup onStart={handleStartRaffle} />
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="app">
        <Marquee text={raffleName} />
        <div className="app-content">
          <RaffleComplete
            raffleName={raffleName}
            winners={[...winners]}
            onNewRaffle={handleNewRaffle}
          />
        </div>
      </div>
    );
  }

  // Drawing phase
  return (
    <div className="app">
      <Marquee text={raffleName} />
      <div className="draw-screen">
        <div className="draw-main">
          <PrizeDisplay
            prize={currentPrize}
            currentIndex={currentPrizeIndex}
            totalPrizes={prizes.length}
          />
          <SlotMachine
            names={eligibleNames}
            winner={currentWinner}
            isSpinning={isSpinning}
            spinKey={spinKey}
            onSpinComplete={handleSpinComplete}
          />
          <SpinButton
            onClick={handleSpin}
            disabled={isSpinning || eligibleNames.length === 0}
            isSpinning={isSpinning}
          />
          {eligibleNames.length === 0 && !isSpinning && (
            <p style={{ color: 'var(--neon-red)', textAlign: 'center' }}>
              No eligible names remaining!
            </p>
          )}
        </div>
        <div className="draw-sidebar">
          <WinnerHistory winners={winners} />
        </div>
      </div>

      {showConfetti && <ConfettiCanvas />}
      {showWinnerModal && (
        <WinnerDisplay
          winnerName={currentWinner}
          prizeName={currentPrize}
          raffleName={raffleName}
          onDismiss={handleDismissWinner}
        />
      )}
    </div>
  );
}
