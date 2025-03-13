import React, { useState } from 'react';
import { login } from '../services/AuthService';

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      console.log('Login Successful:', response.data);
      const data = response.data as { access_token: string };
      localStorage.setItem('token', data.access_token);
      setIsAuthenticated(true);  
    } catch (error) {
      console.error('Login Failed:', error);
      setIsAuthenticated(true);  
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="Email" />
      <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
