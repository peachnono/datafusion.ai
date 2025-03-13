import './CSS/Navbar.css';
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <BrowserRouter>
      <nav className="navbar">
          <div className="app-name">DataFusion.AI</div>
      </nav>
    </BrowserRouter>
  );
};

export default Navbar;
