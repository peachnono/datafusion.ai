import React, { useState } from 'react';
import hamburgerMenuIcon from '../images/hamburger.png';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Use div or span for the clickable hamburger icon */}
        <div className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <img src={hamburgerMenuIcon} alt="Menu" className="hamburger-icon" />
        </div>

        {/* Slide-Out Menu */}
        <div className={`menu ${menuOpen ? 'open' : ''}`}>
          <button onClick={() => alert('Home Clicked')}>Home</button>
          <button onClick={() => alert('Upload Clicked')}>Upload</button>
          <button onClick={() => alert('Settings Clicked')}>Settings</button>
        </div>

        {/* App Name */}
        <div className="app-name">DataFusion.AI</div>
      </div>
    </nav>
  );
};

export default Navbar;
