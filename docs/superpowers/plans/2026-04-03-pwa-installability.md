# PWA Installability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the raffle winner picker installable as a standalone desktop/mobile app (no browser chrome) using `vite-plugin-pwa`.

**Architecture:** Add `vite-plugin-pwa` to the existing Vite config. The plugin generates a web app manifest and registers a minimal service worker at build time, which is all Chrome needs to show the install prompt. PNG icons are generated from the existing SVG favicon via a one-off Node script using `sharp`.

**Tech Stack:** vite-plugin-pwa, sharp (temporary, for icon generation)

---

## File Map

- **Modify:** `package.json` — add `vite-plugin-pwa` dev dependency
- **Modify:** `vite.config.js` — add VitePWA plugin with manifest config
- **Modify:** `index.html` — add theme-color meta tag and apple-touch-icon link
- **Create:** `scripts/generate-icons.mjs` — one-off script to convert SVG favicon to PNGs
- **Create:** `public/pwa-192x192.png` — generated manifest icon
- **Create:** `public/pwa-512x512.png` — generated manifest icon
- **Create:** `public/apple-touch-icon-180x180.png` — generated iOS icon

---

### Task 1: Generate PNG icons from SVG favicon

**Files:**
- Create: `scripts/generate-icons.mjs`
- Create: `public/pwa-192x192.png`
- Create: `public/pwa-512x512.png`
- Create: `public/apple-touch-icon-180x180.png`

- [ ] **Step 1: Install sharp temporarily**

```bash
npm install -D sharp
```

- [ ] **Step 2: Write the icon generation script**

Create `scripts/generate-icons.mjs`:

```js
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, '../public/favicon.svg');
const svg = readFileSync(svgPath);

const sizes = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon-180x180.png', size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(resolve(__dirname, '../public', name));
  console.log(`Generated public/${name}`);
}
```

- [ ] **Step 3: Run the script**

```bash
node scripts/generate-icons.mjs
```

Expected output:
```
Generated public/pwa-192x192.png
Generated public/pwa-512x512.png
Generated public/apple-touch-icon-180x180.png
```

- [ ] **Step 4: Verify the icons exist and look correct**

```bash
ls -la public/pwa-*.png public/apple-touch-icon-*.png
```

Expected: three PNG files with reasonable sizes (several KB each).

- [ ] **Step 5: Remove sharp and the script**

```bash
npm uninstall -D sharp
rm scripts/generate-icons.mjs
rmdir scripts 2>/dev/null || true
```

Sharp was only needed for generation. The PNGs are committed directly.

- [ ] **Step 6: Commit**

```bash
git add public/pwa-192x192.png public/pwa-512x512.png public/apple-touch-icon-180x180.png
git commit -m "Add PWA icons generated from SVG favicon"
```

---

### Task 2: Install vite-plugin-pwa and configure Vite

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] **Step 1: Install vite-plugin-pwa**

```bash
npm install -D vite-plugin-pwa
```

- [ ] **Step 2: Update vite.config.js**

Replace the full contents of `vite.config.js` with:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Jonathan's Raffle Winner Picker",
        short_name: 'Raffle Picker',
        description: 'Themeable raffle winner picker with slot machine animation',
        theme_color: '#080415',
        background_color: '#080415',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  base: './',
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
```

- [ ] **Step 3: Verify the dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts without errors. The console may show a PWA-related message.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.js
git commit -m "Add vite-plugin-pwa with manifest configuration"
```

---

### Task 3: Update index.html with meta tags

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add theme-color meta tag and apple-touch-icon**

In `index.html`, add these two lines immediately after the existing `<link rel="icon" ...>` line (line 6):

```html
    <meta name="theme-color" content="#080415" />
    <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
```

The full `<head>` should now read:

```html
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="theme-color" content="#080415" />
    <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
    <title>Jonathan's Raffle Winner Picker</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bungee&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    ...
  </head>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "Add theme-color meta tag and apple-touch-icon to index.html"
```

---

### Task 4: Build and verify PWA installability

- [ ] **Step 1: Run a production build**

```bash
npm run build
```

Expected: Build completes successfully. The `dist/` directory should contain a `manifest.webmanifest` file and a service worker file (`sw.js` or similar).

- [ ] **Step 2: Verify manifest was generated**

```bash
cat dist/manifest.webmanifest
```

Expected: JSON with `name`, `short_name`, `display: "standalone"`, `icons` array, `theme_color`, `background_color`.

- [ ] **Step 3: Verify service worker was generated**

```bash
ls dist/sw.js dist/workbox-*.js 2>/dev/null || ls dist/sw.js
```

Expected: `sw.js` exists in `dist/`.

- [ ] **Step 4: Run existing tests**

```bash
npm test
```

Expected: All existing tests pass. The PWA changes should not affect any component tests.

- [ ] **Step 5: Serve and manually verify**

```bash
npm start
```

Open `http://localhost:3000` in Chrome. Check:
- Chrome shows install icon in the address bar (desktop) or "Add to Home Screen" banner (mobile)
- DevTools → Application → Manifest shows the correct manifest with icons
- DevTools → Application → Service Workers shows a registered service worker

- [ ] **Step 6: Commit any lockfile changes if needed**

If the lockfile changed during the build:

```bash
git add package-lock.json
git commit -m "Sync lockfile after PWA build verification"
```
