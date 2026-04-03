# PWA Installability Design

Make the raffle winner picker installable as a standalone desktop/mobile app using `vite-plugin-pwa`. The goal is removing browser chrome (address bar, tabs) so the app feels like a native application. No offline caching or update prompt UI is in scope.

## Approach

Use `vite-plugin-pwa` (Approach A) rather than hand-writing a manifest and service worker. The plugin integrates with the existing Vite build pipeline, auto-generates the manifest, registers a minimal service worker, and injects the necessary HTML tags.

## Changes

### 1. Install dependency

Add `vite-plugin-pwa` as a dev dependency.

### 2. Generate PNG icons

Convert the existing SVG favicon (`public/favicon.svg`) to PNG at three sizes:
- `public/pwa-192x192.png` (192x192) -- manifest icon
- `public/pwa-512x512.png` (512x512) -- manifest icon
- `public/apple-touch-icon-180x180.png` (180x180) -- iOS home screen

### 3. Configure vite.config.js

Add the `VitePWA` plugin with:

```js
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: "Jonathan's Raffle Winner Picker",
    short_name: 'Raffle Picker',
    description: 'Themeable raffle winner picker with slot machine animation',
    theme_color: '#080415',
    background_color: '#080415',
    display: 'standalone',
    start_url: './',
    icons: [
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
})
```

### 4. Update index.html

Add to `<head>`:
- `<meta name="theme-color" content="#080415">`
- `<link rel="apple-touch-icon" href="./apple-touch-icon-180x180.png">`

The plugin handles injecting `<link rel="manifest">` and the service worker registration script automatically.

## Out of scope

- Offline caching strategy (no runtime caching, no precache beyond what the plugin does by default)
- Update toast/prompt UI (autoUpdate silently refreshes)
- Express server changes
- Theme-aware dynamic theme_color (uses dark theme default since it loads first)
