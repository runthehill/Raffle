import React, { useState, useCallback, useEffect } from 'react';
import RaffleSetup from './components/RaffleSetup';
import SlotMachine from './components/SlotMachine';
import SpinButton from './components/SpinButton';
import PrizeDisplay from './components/PrizeDisplay';
import WinnerDisplay from './components/WinnerDisplay';
import WinnerHistory from './components/WinnerHistory';
import ConfettiCanvas from './components/ConfettiCanvas';
import Marquee from './components/Marquee';
import RaffleComplete from './components/RaffleComplete';
import ThemeSelector from './components/ThemeSelector';
import Footer from './components/Footer';
import { pickRandom } from './utils/shuffle';
import { getTheme, loadThemeLogo, loadThemeCertLogo } from './themes';

function getInitialTheme() {
  try {
    return localStorage.getItem('raffle-theme') || 'dark';
  } catch {
    return 'dark';
  }
}

export default function App() {
  // Theme
  const [themeId, setThemeId] = useState(getInitialTheme);
  const [certLogo, setCertLogo] = useState(null);
  const theme = getTheme(themeId);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    try { localStorage.setItem('raffle-theme', themeId); } catch {}
    // Pre-load cert logo
    loadThemeCertLogo(theme).then(setCertLogo);
  }, [themeId, theme]);

  const handleThemeChange = useCallback((id) => {
    setThemeId(id);
  }, []);

  // App phases: 'setup' | 'drawing' | 'complete'
  const [phase, setPhase] = useState('setup');

  // Raffle config
  const [raffleName, setRaffleName] = useState('');
  const [prizes, setPrizes] = useState([]);
  const [names, setNames] = useState([]);
  const [witnesses, setWitnesses] = useState([]);

  // Drawing state
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [winners, setWinners] = useState([]);
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
    setWitnesses(config.witnesses || []);
    setCurrentPrizeIndex(0);
    setWinners([]);
    setPhase('drawing');
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning || eligibleNames.length === 0) return;
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
    setWinners(prev => [...prev, {
      name: currentWinner,
      prize: currentPrize,
      timestamp: new Date().toISOString(),
    }]);
    if (currentPrizeIndex + 1 >= prizes.length) {
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
    setWitnesses([]);
    setCurrentPrizeIndex(0);
    setWinners([]);
    setCurrentWinner(null);
    setShowWinnerModal(false);
    setShowConfetti(false);
  }, []);

  // Shared cert props
  const certProps = { certColors: theme.cert, logo: certLogo };

  if (phase === 'setup') {
    return (
      <div className="app">
        <ThemeSelector themeId={themeId} onChange={handleThemeChange} />
        <div className="app-content">
          <RaffleSetup onStart={handleStartRaffle} themeLogo={theme.logo} />
        </div>
        <Footer />
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="app">
        <ThemeSelector themeId={themeId} onChange={handleThemeChange} />
        <Marquee text={raffleName} />
        <div className="app-content">
          <RaffleComplete
            raffleName={raffleName}
            winners={[...winners]}
            witnesses={witnesses}
            onNewRaffle={handleNewRaffle}
            {...certProps}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <ThemeSelector themeId={themeId} onChange={handleThemeChange} />
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

      <Footer />

      {showConfetti && <ConfettiCanvas />}
      {showWinnerModal && (
        <WinnerDisplay
          winnerName={currentWinner}
          prizeName={currentPrize}
          raffleName={raffleName}
          witnesses={witnesses}
          onDismiss={handleDismissWinner}
          {...certProps}
        />
      )}
    </div>
  );
}
