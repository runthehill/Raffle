/**
 * Theme definitions for the raffle app.
 *
 * To add a new theme:
 *  1. Add an entry to the `themes` array below with a unique `id`
 *  2. Add a `[data-theme="<id>"]` block in App.css with CSS variable overrides
 *  3. Optionally place logo PNGs in public/ and reference in `logo` / `logoCert`
 *
 * Logo fields:
 *  - logo:     Displayed in the app UI (setup screen). Pick the variant that
 *              works on your theme's background colour.
 *  - logoCert: Drawn on certificates. Can differ from `logo` if the cert
 *              background needs a different variant.
 */

export const themes = [
  {
    id: 'dark',
    name: 'Dark Carnival',
    logo: null,
    logoCert: null,
    cert: {
      bg: '#0f0f2a',
      inner: '#151535',
      border: '#FFD700',
      borderFaded: '#FFD70088',
      title: '#FFD700',
      heading: '#FFFFFF',
      body: '#9090a8',
      winner: '#FFD700',
      prize: '#FF2D78',
      star: '#FFD700',
      footer: '#444466',
      divider: '#FFD70066',
      dividerDot: '#FFD700',
    },
  },
  {
    id: 'light',
    name: 'Light Carnival',
    logo: null,
    logoCert: null,
    cert: {
      bg: '#FEF7EF',
      inner: '#FFFFFF',
      border: '#E6A800',
      borderFaded: '#E6A80066',
      title: '#C48800',
      heading: '#1A1028',
      body: '#6D5F82',
      winner: '#B87800',
      prize: '#E91E72',
      star: '#E6A800',
      footer: '#A09088',
      divider: '#E6A80055',
      dividerDot: '#E6A800',
    },
  },
  {
    id: 'sligo',
    name: 'Sligo All Stars',
    logo: '/sligo-allstars-logo-dark.png',
    logoCert: '/sligo-allstars-logo-dark.png',
    cert: {
      bg: '#111111',
      inner: '#1A1A1A',
      border: '#FF6B00',
      borderFaded: '#FF6B0066',
      title: '#FF6B00',
      heading: '#FFFFFF',
      body: '#999999',
      winner: '#FFFFFF',
      prize: '#FF8C38',
      star: '#FF6B00',
      footer: '#555555',
      divider: '#FF6B0055',
      dividerDot: '#FF6B00',
    },
  },
];

export function getTheme(id) {
  return themes.find(t => t.id === id) || themes[0];
}

// Image cache (keyed by URL)
const imageCache = {};

function loadImage(src) {
  if (!src) return Promise.resolve(null);
  if (imageCache[src]) return Promise.resolve(imageCache[src]);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache[src] = img;
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function loadThemeLogo(theme) {
  return loadImage(theme.logo);
}

export function loadThemeCertLogo(theme) {
  return loadImage(theme.logoCert);
}
