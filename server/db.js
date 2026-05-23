const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function init() {
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
  const res = await pool.query(
    'SELECT data FROM user_data WHERE user_id = $1',
    [userId]
  );
  return res.rows[0]?.data || {};
}

async function saveUser(userId, data) {
  await pool.query(
    `INSERT INTO user_data (user_id, data, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id)
     DO UPDATE SET data = $2, updated_at = NOW()`,
    [userId, JSON.stringify(data)]
  );
}

module.exports = { init, loadUser, saveUser };
