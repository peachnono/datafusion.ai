// components/Login.tsx
import React, { useState } from 'react';
import { login } from '../services/AuthService';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  console.log(login)

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
    } catch (error) {
      console.error('Login Failed:', error);
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
