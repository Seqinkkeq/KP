const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');
const verifyToken = require('./middleware/auth');
const app = express();
const authRoutes = require('./routes/auth');
const pool = new Pool({
  user: "postgres",
  password: "8495",
  host: "localhost",
  port: 5432,
  database: "Cur_Rank"
});
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRoutes);
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
app.get('/protected', verifyToken, (req, res) => {
  res.send('This is a protected route');
});
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const user = { id: users.length + 1, username, password };
  users.push(user);
  res.status(201).send('User registered');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).send('Invalid username or password');
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


