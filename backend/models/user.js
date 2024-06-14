const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: "postgres",
    password: "8495",
    host: "localhost",
    port: 5432,
    database: "Cur_Rank"
});

const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
};

const findUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByUsername,
};
