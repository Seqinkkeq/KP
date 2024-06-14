// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByUsername } = require('../models/user');
const config = require('../config');

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await createUser(username, password);
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Логин
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

module.exports = router;
