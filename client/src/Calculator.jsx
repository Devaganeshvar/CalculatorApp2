import React, { useState, useEffect } from 'react';
import './Calculator.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Calculator() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3000/auth/verify')
      .then(res => {
        if (!res.data.status) {
          navigate('/calculator');
        }
      })
      .catch(err => {
        console.error(err);
        navigate('/login');
      });
  }, [navigate]);

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if ((key >= '0' && key <= '9') || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '(' || key === ')') {
        setInput((prevInput) => prevInput + key);
      } else if (key === 'Enter') {
        calculateResult();
      } else if (key === 'Backspace') {
        setInput((prevInput) => prevInput.slice(0, -1));
      } else if (key === 'Escape') {
        clearInput();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClick = (value) => {
    setInput(input + value);
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  const calculateResult = () => {
    try {
      const res = eval(input); 
      setResult(res);
    } catch (error) {
      setResult('Error');
    }
  };

  const handleLogout = () => {
    axios.post('http://localhost:3000/auth/logout')
      .then(() => {
        navigate('/home');
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <div className="App">
      <h1>Simple Calculator</h1>
      <div className="calculator">
        <div className="display">
          <input type="text" value={input} readOnly />
          <div className="result">{result}</div>
        </div>
        <div className="buttons">
          <button onClick={clearInput}>C</button>
          <button onClick={() => handleClick('(')}>(</button>
          <button onClick={() => handleClick(')')}>)</button>
          <button onClick={() => handleClick('/')}>/</button>
          <button onClick={() => handleClick('7')}>7</button>
          <button onClick={() => handleClick('8')}>8</button>
          <button onClick={() => handleClick('9')}>9</button>
          <button onClick={() => handleClick('*')}>*</button>
          <button onClick={() => handleClick('4')}>4</button>
          <button onClick={() => handleClick('5')}>5</button>
          <button onClick={() => handleClick('6')}>6</button>
          <button onClick={() => handleClick('-')}>-</button>
          <button onClick={() => handleClick('1')}>1</button>
          <button onClick={() => handleClick('2')}>2</button>
          <button onClick={() => handleClick('3')}>3</button>
          <button onClick={() => handleClick('+')}>+</button>
          <button onClick={() => handleClick('0')}>0</button>
          <button onClick={() => handleClick('.')}>.</button>
          <button onClick={() => handleClick('Math.sqrt(')}>√</button>
          <button onClick={calculateResult}>=</button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
