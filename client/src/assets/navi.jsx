import React from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';


function Navi() {
    const navigate = useNavigate();

    const admin = (event) => {
        event.preventDefault(); 
        navigate('/adminlogin');
      };

      const user = (event) => {
        event.preventDefault(); 
        navigate('/login');
      };

  return (
    <div className='sign-up-container'>
      <form className='sign-up-form'>
        <h2>Login</h2>
        <label>As User</label>
        <button onClick={user}>User</button>
        <label>As admin</label>
        <button onClick={admin}>Admin</button>
      </form>
    </div>
  );
}

export default Navi;
