import React from 'react';
import './App.css';
import HomePage from './pages/HomePage';  // You can swap out with other pages
import Footer from './components/Footer'; // Import Footer component
import Navbar from './components/Navbar'; // Import Navbar component
import DocumentUploadPage from './pages/DocumentUploadPage';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <Navbar />  {/* Navbar at the top */}
      </header>
      <main className="content">
        <DocumentUploadPage /> {/* Dynamically change this based on page */}
      </main>
      <footer className="footer">
        <Footer />  {/* Footer stays at the bottom */}
      </footer>
    </div>
  );
}

export default App;
