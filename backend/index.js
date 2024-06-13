const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: "postgres",
  password: "8495",
  host: "localhost",
  port: 5432,
  database: "Cur_Rank"
});

app.use(bodyParser.json());
app.use(cors());

app.get('/curators', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM curators');
    const curators = result.rows;
    client.release();
    res.json(curators);
  } catch (err) {
    console.error('Error fetching curators', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, password]);
    res.json({ userId: result.rows[0].id });
  } catch (err) {
    console.error('Error registering user', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      const token = jwt.sign({ userId: result.rows[0].id }, 'your_jwt_secret');
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error logging in user', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/curators/:curatorId/reviews', async (req, res) => {
  const { curatorId } = req.params;
  const { rating, comment } = req.body;
  
  try {
    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO reviews (curator_id, rating, comment) VALUES ($1, $2, $3) RETURNING id',
      [curatorId, rating, comment]
    );
    const newReviewId = result.rows[0].id;

    const avgResult = await client.query(
      'SELECT AVG(rating) as average_rating FROM reviews WHERE curator_id = $1',
      [curatorId]
    );
    const newAverageRating = avgResult.rows[0].average_rating;

    await client.query(
      'UPDATE curators SET average_rating = $1 WHERE id = $2',
      [newAverageRating, curatorId]
    );

    client.release();

    res.status(201).json({ reviewId: newReviewId, newAverageRating });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to PostgreSQL');
    console.log(result.rows);
  });
});
