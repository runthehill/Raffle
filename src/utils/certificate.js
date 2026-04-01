/**
 * Canvas-based winner certificate generator.
 * Renders a decorative certificate and exports as PNG.
 * Colors adapt to the active theme.
 */

import { version } from '../../package.json';

const CERT_WIDTH = 1200;
const CERT_HEIGHT = 850;

// Fallback colors (dark carnival theme)
const DEFAULT_COLORS = {
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
};

/**
 * Draw a single certificate to a canvas and return it.
 */
export function renderCertificate({ raffleName, winnerName, prizeName, witnesses, date, certColors, logo }) {
  const c = { ...DEFAULT_COLORS, ...certColors };

  const canvas = document.createElement('canvas');
  canvas.width = CERT_WIDTH;
  canvas.height = CERT_HEIGHT;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);

  // Inner background
  ctx.fillStyle = c.inner;
  ctx.fillRect(30, 30, CERT_WIDTH - 60, CERT_HEIGHT - 60);

  // Border (double line)
  ctx.strokeStyle = c.border;
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, CERT_WIDTH - 40, CERT_HEIGHT - 40);
  ctx.strokeStyle = c.borderFaded;
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, CERT_WIDTH - 80, CERT_HEIGHT - 80);

  // Corner decorations — use logo if available, otherwise stars
  const cx = CERT_WIDTH / 2;
  const hasWitnesses = witnesses && witnesses.length > 0;

  if (logo) {
    const cornerSize = 140;
    const scale = Math.min(cornerSize / logo.width, cornerSize / logo.height);
    const cw = logo.width * scale;
    const ch = logo.height * scale;
    // Inset from the inner border (at 40px) with padding
    const inset = 52;
    const corners = [
      [inset, inset],
      [CERT_WIDTH - inset - cw, inset],
      [inset, CERT_HEIGHT - inset - ch],
      [CERT_WIDTH - inset - cw, CERT_HEIGHT - inset - ch],
    ];
    corners.forEach(([x, y]) => ctx.drawImage(logo, x, y, cw, ch));
  } else {
    drawCornerStar(ctx, 55, 55, c.star);
    drawCornerStar(ctx, CERT_WIDTH - 55, 55, c.star);
    drawCornerStar(ctx, 55, CERT_HEIGHT - 55, c.star);
    drawCornerStar(ctx, CERT_WIDTH - 55, CERT_HEIGHT - 55, c.star);
  }

  let headerY = 100;

  // Raffle name (header)
  ctx.fillStyle = c.title;
  ctx.font = 'bold 28px "Bungee", "Arial Black", Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(raffleName.toUpperCase(), cx, headerY);

  // Decorative divider
  drawDivider(ctx, cx, headerY + 40, 300, c.divider, c.dividerDot);

  // "Certificate of Winning"
  ctx.fillStyle = c.heading;
  ctx.font = '20px "Bungee", "Arial Black", Impact, sans-serif';
  ctx.fillText('CERTIFICATE OF WINNING', cx, headerY + 85);

  // "This certifies that"
  ctx.fillStyle = c.body;
  ctx.font = '18px "Nunito", -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('This certifies that', cx, headerY + 150);

  // Winner name (large)
  ctx.fillStyle = c.winner;
  ctx.font = 'bold 52px "Bungee", "Arial Black", Impact, sans-serif';
  let displayName = winnerName;
  while (ctx.measureText(displayName).width > CERT_WIDTH - 160 && displayName.length > 3) {
    displayName = displayName.slice(0, -4) + '...';
  }
  ctx.fillText(displayName, cx, headerY + 220);

  // Decorative divider
  drawDivider(ctx, cx, headerY + 260, 200, c.divider, c.dividerDot);

  // "has won"
  ctx.fillStyle = c.body;
  ctx.font = '18px "Nunito", -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('has won', cx, headerY + 300);

  // Prize name
  ctx.fillStyle = c.prize;
  ctx.font = 'bold 40px "Bungee", "Arial Black", Impact, sans-serif';
  let displayPrize = prizeName;
  while (ctx.measureText(displayPrize).width > CERT_WIDTH - 160 && displayPrize.length > 3) {
    displayPrize = displayPrize.slice(0, -4) + '...';
  }
  ctx.fillText(displayPrize, cx, headerY + 365);

  // Decorative divider
  drawDivider(ctx, cx, headerY + 410, 300, c.divider, c.dividerDot);

  // Stars
  ctx.fillStyle = c.star;
  ctx.font = '24px sans-serif';
  ctx.fillText('\u2605  \u2605  \u2605', cx, headerY + 455);

  // Date
  ctx.fillStyle = c.body;
  ctx.font = '16px "Nunito", -apple-system, "Segoe UI", Roboto, sans-serif';
  const dateStr = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  ctx.fillText(dateStr, cx, headerY + 500);

  // Witnesses
  if (hasWitnesses) {
    const witnessY = headerY + 550;

    ctx.fillStyle = c.body;
    ctx.font = '14px "Nunito", -apple-system, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Witnessed by:', cx, witnessY);

    ctx.fillStyle = c.heading;
    ctx.font = '18px "Nunito", -apple-system, "Segoe UI", Roboto, sans-serif';

    if (witnesses.length === 1) {
      ctx.fillText(witnesses[0], cx, witnessY + 30);
      drawSignatureLine(ctx, cx, witnessY + 50, 200, c.divider);
    } else {
      const leftX = CERT_WIDTH * 0.3;
      const rightX = CERT_WIDTH * 0.7;

      ctx.fillText(witnesses[0], leftX, witnessY + 30);
      drawSignatureLine(ctx, leftX, witnessY + 50, 200, c.divider);

      ctx.fillText(witnesses[1], rightX, witnessY + 30);
      drawSignatureLine(ctx, rightX, witnessY + 50, 200, c.divider);
    }
  }

  // Footer text
  ctx.fillStyle = c.footer;
  ctx.font = '12px "Nunito", -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Generated by Jonathan's Raffle Winner Picker v${version}`, cx, CERT_HEIGHT - 60);

  return canvas;
}

function drawCornerStar(ctx, x, y, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\u2605', x, y);
  ctx.restore();
}

function drawDivider(ctx, x, y, width, lineColor, dotColor) {
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();

  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.moveTo(x, y - 4);
  ctx.lineTo(x + 4, y);
  ctx.lineTo(x, y + 4);
  ctx.lineTo(x - 4, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSignatureLine(ctx, x, y, width, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Download a certificate as PNG.
 */
export function downloadCertificate({ raffleName, winnerName, prizeName, witnesses, date, certColors, logo }) {
  const canvas = renderCertificate({ raffleName, winnerName, prizeName, witnesses, date, certColors, logo });
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${winnerName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Download all certificates.
 */
export function downloadAllCertificates(raffleName, winners, witnesses, certColors, logo) {
  winners.forEach((w, i) => {
    setTimeout(() => {
      downloadCertificate({
        raffleName,
        winnerName: w.name,
        prizeName: w.prize,
        witnesses: witnesses || [],
        date: w.timestamp,
        certColors,
        logo,
      });
    }, i * 500);
  });
}
