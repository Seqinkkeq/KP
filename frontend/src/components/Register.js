import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/register', { username, password });
      // Выводим сообщение об успешной регистрации
      alert('Registration successful. Please log in.');
      // Перенаправляем пользователя на страницу входа после успешной регистрации
      window.location.href = '/login';
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form register-form">
      <h2>Register</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="form-group">
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
