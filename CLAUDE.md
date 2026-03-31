# CLAUDE.md

## Project Overview

Vegas-style raffle winner picker web app. Users set up a raffle with a name, prizes, and a participant list, then draw winners sequentially with a slot machine animation.

## Tech Stack

- **Frontend:** React (plain JavaScript, no TypeScript) + Vite
- **Backend:** Express (serves static build for production/offline use)
- **Audio:** Web Audio API (all sounds synthesized at runtime, no audio files)
- **Graphics:** Canvas API (confetti particles + PNG certificate generation)

## Commands

- `npm install` — install dependencies
- `npm run dev` — start Vite dev server with hot reload
- `npm run build` — production build to `dist/`
- `npm start` — serve production build via Express on port 3000

## Project Structure

```
src/
├── main.jsx                    # React entry point
├── App.jsx                     # Top-level state orchestration (setup → drawing → complete)
├── App.css                     # Global Vegas theme, CSS variables, animations
├── components/
│   ├── RaffleSetup.jsx         # Setup screen: raffle name, prizes, file upload
│   ├── SlotMachine.jsx         # Core reel animation with virtual scrolling
│   ├── SpinButton.jsx          # Animated SPIN button
│   ├── NameLoader.jsx          # Drag-drop file upload for participant names
│   ├── PrizeDisplay.jsx        # Current prize being drawn
│   ├── WinnerDisplay.jsx       # Winner reveal overlay with certificate download
│   ├── WinnerHistory.jsx       # Sidebar showing completed draws
│   ├── WinnerCertificate.jsx   # Certificate preview component
│   ├── ConfettiCanvas.jsx      # Full-screen canvas confetti overlay
│   ├── Marquee.jsx             # Scrolling raffle name banner
│   └── RaffleComplete.jsx      # Summary screen with all results
├── hooks/
│   ├── useSlotAnimation.js     # requestAnimationFrame reel physics engine
│   └── useAudio.js             # Web Audio API sound synthesis
└── utils/
    ├── easing.js               # Custom deceleration curves
    ├── confetti.js             # Canvas particle system
    ├── shuffle.js              # Fisher-Yates shuffle with crypto.getRandomValues
    └── certificate.js          # Canvas-based PNG certificate rendering
```

## Key Architecture Decisions

- **Winner is pre-selected before animation starts** using `crypto.getRandomValues`. The animation is choreographed theater that lands on the predetermined result.
- **All sounds are synthesized** via Web Audio API oscillators — no audio files to manage or break offline.
- **The slot reel uses virtual scrolling** — only 5 name slots are visible at any time regardless of list size. Names are shuffled and repeated to create the reel.
- **Certificates are rendered to canvas** and exported as PNG via `canvas.toBlob()` — no server-side generation needed.

## Style Guide

- No TypeScript — plain JavaScript with JSX
- CSS is per-component (e.g., `SlotMachine.css` alongside `SlotMachine.jsx`)
- CSS custom properties defined in `App.css` for the Vegas theme (neon gold, pink, dark background)
- No external animation or UI component libraries
