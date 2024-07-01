import React, { useState } from 'react';
import '../src/App.css';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3000/auth/signup', {
            username,
            email,
            password,
        }).then(response => {
            if (response.data.status) {
                setIsVerifying(true);
                setMessage(response.data.message);
            } else {
                setError(response.data.message);
            }
        }).catch(err => {
            console.log(err);
            setError('An error occurred during signup. Please try again.');
        });
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post('http://localhost:3000/auth/verify-email', { email, code: verificationCode });
            if (response.data.status) {
                setMessage('Email verified successfully. You can now log in.');
                setIsVerifying(false);
                navigate('/login');
            } else {
                setMessage('Invalid verification code. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className='sign-up-container'>
            {!isVerifying ? (
                <form className='sign-up-form' onSubmit={handleSignUp}>
                    <h2>Sign Up</h2>
                    <label htmlFor='username'>Username:</label>
                    <input
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor='email'>Email:</label>
                    <input
                        type="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor='password'>Password:</label>
                    <input
                        type="password"
                        placeholder='*******'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type='submit'>Sign Up</button>
                    {error && <p className="error-message">{error}</p>}
                    <p>Have an Account?<Link to="/login">Login</Link></p> 
                </form>
            ) : (
                <form className='sign-up-form' onSubmit={handleVerify}>
                    <h2>Verify Email</h2>
                    <input
                        type="text"
                        placeholder="Verification Code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                    <button type="submit">Verify</button>
                    {message && <p>{message}</p>}
                </form>
            )}
        </div>
    );
}

export default SignUp;
