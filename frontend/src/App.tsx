import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div className='g-gray-100 h-screen flex flex-col items-center justify-center'>
      <HomePage />
      <LoginPage />
    </div>
  );
}

export default App;
