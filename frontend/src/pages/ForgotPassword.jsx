import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setMessage('If this email is registered, a password reset link has been sent.');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="login-container">
      <h2>Forgot Password</h2>
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <button className="login-link-btn" style={{marginTop:16}} onClick={() => navigate('/login')}>Back to Login</button>
    </div>
  );
} 