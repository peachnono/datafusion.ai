import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from '../pages/LoginPage';
import './CSS/Navbar.css';

const Navbar: React.FC = () => {
  const [showLoginButton, setShowLoginButton] = useState(true);

  // Function to toggle visibility of login button
  const toggleLoginButton = () => setShowLoginButton(!showLoginButton);

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="app-name">DataFusion.AI</div>
          {showLoginButton && (
            <li>
              <Link to="/login" onClick={toggleLoginButton}>Login</Link>
            </li>
          )}
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </nav>
    </BrowserRouter>
  );
};

export default Navbar;
