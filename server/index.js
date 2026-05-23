const express = require('express');
const cors    = require('cors');
const path    = require('path');
const db      = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ── Serve the built React app ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../dist')));

// ── API ────────────────────────────────────────────────────────────────────

// GET /api/sync/:userId  →  { data: { weights, completed } }
app.get('/api/sync/:userId', async (req, res) => {
  try {
    const data = await db.loadUser(req.params.userId);
    res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB read failed' });
  }
});

// POST /api/sync/:userId  body: { data: { weights, completed } }
app.post('/api/sync/:userId', async (req, res) => {
  try {
    await db.saveUser(req.params.userId, req.body.data);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB write failed' });
  }
});

// ── Fallback → React SPA ───────────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

db.init()
  .then(() => app.listen(PORT, () => console.log(`Server on :${PORT}`)))
  .catch(err => { console.error('Startup failed', err); process.exit(1); });
