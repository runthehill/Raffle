# Raffle Winner Picker

A Vegas-style raffle winner picker web app with slot machine animation, sound effects, confetti, and downloadable winner certificates.

## Features

- **Slot machine reel** that spins through names with dramatic deceleration and a suspenseful crawl before landing on the winner
- **Synthesized sound effects** via Web Audio API — percussive tick sounds, drumroll, and a triumphant fanfare (no audio files needed)
- **Confetti explosion** and screen shake on winner reveal
- **Sequential prize drawing** — enter a list of prizes and draw winners one at a time
- **Downloadable PNG certificates** for each winner, with optional witness names and signature lines
- **Save & load raffle configs** — save to browser storage, or export/import as JSON files
- **Manual or file-based name entry** — type names directly or upload a text file
- **Cryptographically secure winner selection** — uses `crypto.getRandomValues()` (see [Fairness & Randomness](#fairness--randomness))
- **Fully offline** — no CDN dependencies, everything is bundled

## Quick Start

```bash
npm install
npm run dev
```

Opens the app in development mode with hot reload.

## Production / Offline Use

```bash
npm install
npm run build
npm start
```

Serves the app at `http://localhost:3000`. No internet connection required.

## How It Works

1. **Setup** — Enter a raffle name, list your prizes (one per line), add participants (type names or upload a file), and optionally add witness names
2. **Draw** — Click SPIN to draw a winner for each prize in sequence. Winners are automatically excluded from future draws
3. **Certificates** — Download a certificate after each draw, or download all certificates from the summary screen

You can save your raffle configuration for reuse (Save button) or export it as a JSON file to share with others.

## Names File Format

Plain text file with one name per line:

```
Alice Johnson
Bob Smith
Charlie Brown
```

Supports `.txt` and `.csv` files. Drag-and-drop or click to browse. You can also type or paste names directly using the "Type Names" tab.

## Fairness & Randomness

Transparency matters in a raffle. Here is exactly how winners are selected:

### How it works

1. When you click SPIN, the winner is selected **before the animation starts**. The slot machine reel is purely theatrical — it is choreographed to land on the pre-determined result. The animation has zero influence on who wins.

2. Previous winners are excluded from future draws automatically. Once a name wins a prize, it cannot be selected again.

### Random number generation

Winners are selected using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) (`crypto.getRandomValues()`), a **cryptographically secure pseudo-random number generator (CSPRNG)** built into all modern browsers. This is the same entropy source used for generating encryption keys and is seeded by the operating system's entropy pool (hardware events, timing jitter, etc.) — not by any user-controllable value.

The selection is a single call: a random 32-bit unsigned integer is generated, then mapped to a participant index via modulo (`uint32 % participantCount`).

**Modulo bias**: Since 2^32 doesn't divide evenly by all participant counts, some entries are theoretically favoured by at most 1 extra chance in ~4.3 billion draws. For a raffle of 1,000 participants, this bias is approximately **0.00000023%** — statistically negligible.

If `crypto.getRandomValues()` is unavailable (pre-2013 browsers), the code falls back to `Math.random()`, which is not cryptographically secure. In practice, every browser shipping today supports the Web Crypto API.

### Source code

The relevant code is small and auditable:

- **Winner selection**: [`src/App.jsx`](src/App.jsx) — `pickRandom(eligibleNames)`
- **Random number generation**: [`src/utils/shuffle.js`](src/utils/shuffle.js) — `cryptoRandomInt()` and `pickRandom()`

## Tech Stack

- React (plain JavaScript) + Vite
- Express (production server)
- Web Audio API (synthesized sounds)
- Canvas API (confetti + certificates)
