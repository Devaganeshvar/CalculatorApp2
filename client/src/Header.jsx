import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../src/Header.module.css'; 

export const Header = () => {
  return (
    <div>
    <nav className={`navbar navbar-expand-lg bg-light ${styles.navbar}`}>
      <div className="container-fluid">
       
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link active ${styles.navLink}`} aria-current="page" to="/home">Home</Link> 
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} to="/navi">Login</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} to="/signup">SignUp</Link> 
            </li>
            
          </ul>
          <span className="navbar-text">Welcome</span>
        </div>
      </div>
    </nav>
  </div>
  );
};
 
export default Header