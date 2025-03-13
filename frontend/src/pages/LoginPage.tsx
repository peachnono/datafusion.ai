import React, { useState } from 'react';
import { login } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './css/LoginPage.css';

const Login: React.FC = () => {
  const { setIsAuthenticated } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showToaster, setShowToaster] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMessage(null);
    setShowToaster(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      console.log('Login Successful:', response.data);
      const data = response.data as { access_token: string };
      localStorage.setItem('token', data.access_token);
      setIsAuthenticated(true);  
      navigate('/documents'); 
    } catch (error) {
      console.error('Login Failed:', error);
      setIsAuthenticated(false); 
      setErrorMessage('Invalid login credentials. Please try again.'); 
      setShowToaster(true);
      setTimeout(() => {
        setShowToaster(false);
      }, 3000);
    }
  };

  return (
    <div className="login">
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="Email" />
      <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Login</button>
      {showToaster && <div className="toaster show">{errorMessage}</div>}
    </form>
    </div>
  );
};

export default Login;
