import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
      if (response.data.status) {
        alert('Check your email for reset password link');
        navigate('/login');
        console.log(response.data)
      } else {
        setError('Failed to send reset link. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              placeholder='Enter Email' 
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type='submit'>Send</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
