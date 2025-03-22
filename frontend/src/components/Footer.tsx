import React from 'react';
import './css/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} DataFusion.AI. All rights reserved. Created by T222</p>
      </div>
    </footer>
  );
};

export default Footer;
