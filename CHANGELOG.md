# Changelog

## [1.0.1] - 2026-04-01

### Added
- **Theme system** — switchable themes via dropdown (top-right corner). Themes control colours, backgrounds, slot machine styling, and certificate palettes. Persisted to localStorage.
  - **Dark Carnival** (default) — neon gold, pink, purple on deep indigo
  - **Light Carnival** — vivid carnival colours on warm cream
  - **Sligo All Stars** — black, white, and orange basketball theme with club logo and court-line background
- **Themed certificates** — certificate colours, accents, and corner logos adapt to the active theme
- **Manual name entry** — tab-based UI to type or paste participant names directly, in addition to file upload. Individual name tags with delete buttons.
- **Save & load raffle configs** — save to browser localStorage, load from saved list, export/import as JSON files. Up to 20 saved configs.
- **Witnesses** — two optional witness name fields added to setup. Witnesses appear on certificates with signature lines.
- **Test suite** — 48 tests across 9 files using Vitest + React Testing Library. Covers utility functions, theme config, and component rendering/interactions.
- **Footer** — subtle app footer with version number and GitHub link on all screens
- **Test names file** — `test names.txt` with 30 diverse sample names for testing

### Changed
- **Visual overhaul** — new colour palette (expanded with purple, cyan, green, orange accents), Google Fonts (Bungee + Nunito), animated gradient backgrounds, rainbow effects on slot machine border and marquee, richer confetti (star shapes, more colours, bigger bursts)
- **Slot machine animation completely rewritten** —
  - Velocity-matched deceleration: power curve exponent computed dynamically from cruise speed and decel distance, eliminating speed discontinuities
  - Damped teeter at the end: reel drifts ~0.5 slots past the winner, drifts back, and settles naturally (product-of-sines oscillation with exponential damping)
  - Winner placement calculated from animation physics so decel covers a controlled ~25 slots
- **Audio improved** — removed continuous buzzing sawtooth oscillators; spin sound is now rhythmic percussive clicks (noise bursts through bandpass filter) that vary in volume and pitch with reel speed. Warmer triangle-wave fanfare with shimmer overtones.
- **Marquee auto-repeats** — calculates required text repetitions based on viewport width, eliminating the gap/jump at the loop boundary
- **Draw screen centred** — spinner and controls vertically centred on the page

### Fixed
- **Winner mismatch bug** — removed double `CENTER_INDEX` offset that caused the reel to highlight one name while the winner modal showed a different one
- **Animation "flick" at end** — removed `easeOutBounce` from the final settle phase that caused names to flicker/jump between slots
- **Save button feedback** — now shows "Saved!" confirmation for 2 seconds after saving

## [1.0.0] - 2026-03-30

### Added
- Initial release
- Slot machine reel with spin-up, cruise, and deceleration phases
- Web Audio API synthesized sounds (tick, spin, fanfare, drumroll)
- Confetti canvas particle system with screen shake
- Sequential prize drawing with winner exclusion
- Downloadable PNG certificates via canvas rendering
- Drag-and-drop file upload for participant names
- Scrolling marquee banner
- Raffle complete summary screen
- Express production server for offline use
