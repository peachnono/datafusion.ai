import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';  
import Footer from './components/Footer'; 
import Navbar from './components/Navbar'; 
import DocumentUploadPage from './pages/DocumentUploadPage';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate checking local storage or token validation
    const token = localStorage.getItem('userToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <Navbar /> 
      </header>
      <main className="content">
        { isAuthenticated ? <DocumentUploadPage /> : <Login setIsAuthenticated={setIsAuthenticated} /> }
      </main>
      <footer className="footer">
        <Footer /> 
      </footer>
    </div>
  );
}

export default App;
