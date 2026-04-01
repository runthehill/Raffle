# Jonathan's Raffle Winner Picker

A fun, themeable raffle winner picker web app with slot machine animation, sound effects, confetti, and downloadable winner certificates.

## Features

- **Slot machine reel** with smooth deceleration and a suspenseful teeter between the last two names before landing on the winner
- **Synthesized sound effects** via Web Audio API — percussive tick sounds, drumroll, and a triumphant fanfare (no audio files needed)
- **Confetti explosion** and screen shake on winner reveal
- **Sequential prize drawing** — enter a list of prizes and draw winners one at a time
- **Downloadable PNG certificates** for each winner, themed to match the active theme, with optional witness names and signature lines
- **Save & load raffle configs** — save to browser storage, or export/import as JSON files
- **Manual or file-based name entry** — type names directly or upload a text file
- **Themeable** — Dark Carnival, Light Carnival, and Sligo All Stars (basketball) themes included. Themes control colours, backgrounds, and certificate styling. Easily extensible with new themes.
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

## Testing

```bash
npm test            # single run
npm run test:watch  # watch mode
```

Tests cover utility functions (shuffle, easing, themes), component rendering, and user interactions using Vitest + React Testing Library.

## How It Works

1. **Setup** — Choose a theme, enter a raffle name, list your prizes (one per line), add participants (type names or upload a file), and optionally add witness names
2. **Draw** — Click SPIN to draw a winner for each prize in sequence. Winners are automatically excluded from future draws
3. **Certificates** — Download a certificate after each draw, or download all certificates from the summary screen. Certificates match the active theme's colours and include the theme logo if one is set.

You can save your raffle configuration for reuse (Save button) or export it as a JSON file to share with others.

## Themes

Themes are selected from the dropdown in the top-right corner. Each theme controls:
- App colour palette and backgrounds
- Slot machine, button, and UI styling
- Certificate colours, accents, and corner logos
- Marquee banner appearance

### Included themes

| Theme | Description |
|-------|-------------|
| **Dark Carnival** | Neon gold, pink, and purple on deep indigo. The default. |
| **Light Carnival** | Vivid carnival colours on warm cream. |
| **Sligo All Stars** | Black, white, and orange basketball theme with club logo. |

### Adding a new theme

1. Add an entry to the `themes` array in `src/themes.js` with a unique `id`, display `name`, optional `logo`/`logoCert` paths, and a `cert` colour palette
2. Add a `[data-theme="<id>"]` block in `src/App.css` with CSS variable overrides and any component-specific styling
3. Place any logo PNGs in `public/` (transparent backgrounds recommended)
4. Add a `[data-theme="<id>"] body` rule in `index.html` to prevent flash on load

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
- Vitest + React Testing Library (tests)
- Express (production server)
- Web Audio API (synthesized sounds)
- Canvas API (confetti + certificates)
- Google Fonts (Bungee + Nunito)
