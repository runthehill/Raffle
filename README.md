# Raffle Winner Picker

A Vegas-style raffle winner picker web app with slot machine animation, sound effects, confetti, and downloadable winner certificates.

## Features

- **Slot machine reel** that spins through names with dramatic deceleration and a "tease" pause before landing on the winner
- **Synthesized sound effects** via Web Audio API — tick sounds, spin whir, and a triumphant fanfare (no audio files needed)
- **Confetti explosion** and screen shake on winner reveal
- **Sequential prize drawing** — enter a list of prizes and draw winners one at a time
- **Downloadable PNG certificates** for each winner with the raffle name, prize, and date
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

1. **Setup** — Enter a raffle name, list your prizes (one per line), and upload a text file of participant names
2. **Draw** — Click SPIN to draw a winner for each prize in sequence. Winners are automatically excluded from future draws
3. **Certificates** — Download a certificate after each draw, or download all certificates from the summary screen

## Names File Format

Plain text file with one name per line:

```
Alice Johnson
Bob Smith
Charlie Brown
```

Supports `.txt` and `.csv` files. Drag-and-drop or click to browse.

## Tech Stack

- React (plain JavaScript) + Vite
- Express (production server)
- Web Audio API (synthesized sounds)
- Canvas API (confetti + certificates)
