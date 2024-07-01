import React, { useState } from 'react';
import '../src/App.css';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        Axios.post('http://localhost:3000/auth/login', {
            email,
            password,
        }).then(response => {
            if(response.data.status) {
                navigate('/home');
            } else {
                setError(response.data.message);
            }
        }).catch(err => {
            console.error(err);
            setError('An error occurred during login. Please try again.');
        });
    };

    return (
        <div className='sign-up-container'>
            <form className='sign-up-form' onSubmit={handleSubmit}>
                <h2>Login</h2>
               
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
                <button className="loginbutton" type='submit'>Login</button>
                {error && <p className="error-message">{error}</p>}
                <Link to="/forgotPassword">Forgot Password?</Link>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p> 
            </form>
        </div>
    );
}

export default Login;
