import React from 'react';
import { logout } from '../services/AuthService';

const Logout: React.FC = () => {
    const handleLogout = () => {
        const token = localStorage.getItem('token'); 
        if (token) {
            logout(token).then(() => {
                localStorage.removeItem('token');
            });
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
