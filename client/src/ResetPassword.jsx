import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {token} = useParams()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/resetPassword/'+token, { password });
      if (response.data.status) {
        navigate('/login');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">New Password:</label>
          <input 
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type='submit'>Reset</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
