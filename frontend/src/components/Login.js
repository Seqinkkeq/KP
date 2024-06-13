import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      // Перенаправляем пользователя на домашнюю страницу после входа
      window.location.href = '/home';
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form login-form">
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="form-group">
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
