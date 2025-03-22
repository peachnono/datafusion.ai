import './css/Navbar.css';
import React, { useEffect } from 'react';
import Logout from './Logout';
import { useAuth } from '../utils/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [setIsAuthenticated]);
    
  return (
      <nav className="navbar">
        <div className="app-name">DataFusion.AI</div>
        {isAuthenticated && <Logout/>}  
      </nav>
  );
};

export default Navbar;
