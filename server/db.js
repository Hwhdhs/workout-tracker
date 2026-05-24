const { Pool } = require('pg');

const hasDb = !!process.env.DATABASE_URL;
const pool = hasDb ? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
}) : null;

async function init() {
  if (!hasDb) { console.log('No DATABASE_URL — running without DB (localStorage fallback)'); return; }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_data (
      user_id TEXT PRIMARY KEY,
      data    JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('DB ready');
}

async function loadUser(userId) {
  if (!hasDb) return {};
  const res = await pool.query('SELECT data FROM user_data WHERE user_id = $1', [userId]);
  return res.rows[0]?.data || {};
}

async function saveUser(userId, data) {
  if (!hasDb) return;
  await pool.query(
    `INSERT INTO user_data (user_id, data, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id)
     DO UPDATE SET data = $2, updated_at = NOW()`,
    [userId, JSON.stringify(data)]
  );
}

module.exports = { init, loadUser, saveUser };
