const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║                                      ║
  ║    🎰  RAFFLE WINNER PICKER  🎰     ║
  ║                                      ║
  ║    Server running on port ${String(PORT).padEnd(5)}      ║
  ║    http://localhost:${PORT}             ║
  ║                                      ║
  ╚══════════════════════════════════════╝
  `);
});
