# CLAUDE.md

## Project Overview

Themeable raffle winner picker web app. Users set up a raffle with a name, prizes, and a participant list, then draw winners sequentially with a slot machine animation. Supports multiple visual themes (Dark Carnival, Light Carnival, Sligo All Stars) that control the full UI and certificate styling.

## Tech Stack

- **Frontend:** React (plain JavaScript, no TypeScript) + Vite
- **Backend:** Express (serves static build for production/offline use)
- **Audio:** Web Audio API (all sounds synthesized at runtime, no audio files)
- **Graphics:** Canvas API (confetti particles + PNG certificate generation)
- **Testing:** Vitest + React Testing Library + jsdom
- **Fonts:** Google Fonts (Bungee + Nunito)

## Commands

- `npm install` — install dependencies
- `npm run dev` — start Vite dev server with hot reload
- `npm run build` — production build to `dist/`
- `npm start` — serve production build via Express on port 3000
- `npm test` — run test suite (single run)
- `npm run test:watch` — run tests in watch mode

## Project Structure

```
src/
├── main.jsx                    # React entry point
├── App.jsx                     # Top-level state orchestration (setup → drawing → complete)
├── App.css                     # Theme variables (dark/light/sligo), global styles, theme overrides
├── themes.js                   # Theme definitions, cert palettes, logo loading
├── components/
│   ├── RaffleSetup.jsx         # Setup screen: raffle name, prizes, participants, witnesses, save/load
│   ├── SlotMachine.jsx         # Core reel animation with virtual scrolling
│   ├── SpinButton.jsx          # Animated SPIN button
│   ├── NameLoader.jsx          # File upload + manual name entry with tabs
│   ├── PrizeDisplay.jsx        # Current prize being drawn
│   ├── WinnerDisplay.jsx       # Winner reveal overlay with certificate download
│   ├── WinnerHistory.jsx       # Sidebar showing completed draws
│   ├── WinnerCertificate.jsx   # Certificate preview component
│   ├── ConfettiCanvas.jsx      # Full-screen canvas confetti overlay
│   ├── Marquee.jsx             # Scrolling raffle name banner (auto-repeating)
│   ├── RaffleComplete.jsx      # Summary screen with all results
│   ├── ThemeSelector.jsx       # Theme dropdown (top-right corner)
│   └── Footer.jsx              # App footer with version and GitHub link
├── hooks/
│   ├── useSlotAnimation.js     # requestAnimationFrame reel physics engine
│   └── useAudio.js             # Web Audio API sound synthesis
├── utils/
│   ├── easing.js               # Easing curves (used by spin-up phase)
│   ├── confetti.js             # Canvas particle system
│   ├── shuffle.js              # Fisher-Yates shuffle with crypto.getRandomValues
│   └── certificate.js          # Canvas-based PNG certificate rendering (theme-aware)
└── test/
    └── setup.js                # Vitest setup (jest-dom matchers)
public/
├── sligo-allstars-logo.png         # Sligo All Stars logo (original, for white backgrounds)
└── sligo-allstars-logo-dark.png    # Sligo All Stars logo (white artwork, for dark backgrounds)
```

## Key Architecture Decisions

- **Winner is pre-selected before animation starts** using `crypto.getRandomValues`. The animation is choreographed theater that lands on the predetermined result.
- **All sounds are synthesized** via Web Audio API noise bursts — no audio files to manage or break offline.
- **The slot reel uses virtual scrolling** — only 5 name slots are visible at any time regardless of list size. Names are shuffled and repeated to create the reel.
- **Animation uses velocity-matched deceleration** — the power curve exponent `p` is computed dynamically so the transition from cruise to deceleration has zero velocity discontinuity. A damped oscillation at the end produces a natural teeter.
- **Certificates are rendered to canvas** and exported as PNG via `canvas.toBlob()` — no server-side generation needed. Colours and logos adapt to the active theme.
- **Themes are data-driven** — defined in `src/themes.js` as an array of config objects. CSS overrides use `[data-theme="<id>"]` selectors in `App.css`. Adding a theme requires no component changes.

## Theme System

Each theme entry in `src/themes.js` provides:
- `id` — unique key, used as `data-theme` attribute value
- `name` — display name in the theme dropdown
- `logo` / `logoCert` — optional paths to logo PNGs (UI vs certificate variants)
- `cert` — complete colour palette for certificate canvas rendering

CSS variables are defined in `:root` (dark default) and overridden per-theme in `App.css`. Component-specific overrides (backgrounds, borders, shadows with hardcoded colours) are grouped at the end of `App.css` under theme headers.

## Style Guide

- No TypeScript — plain JavaScript with JSX
- CSS is per-component (e.g., `SlotMachine.css` alongside `SlotMachine.jsx`)
- CSS custom properties defined in `App.css` — all themes share the same variable names
- Theme-specific overrides go in `App.css`, not in component CSS files
- No external animation or UI component libraries
- Tests live alongside the files they test (e.g., `shuffle.test.js` next to `shuffle.js`)
