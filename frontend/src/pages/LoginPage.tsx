import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { login } from '../utils/API';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { mutate, isLoading, isError, error } = useMutation(login, {
    onSuccess: (data) => {
      // Handle successful login, e.g., store the received token
      console.log('Login successful:', data);
    },
    onError: (error: Error) => {
      // Handle error case
      console.error('Login failed:', error.message);
    }
  });

  const handleLogin = () => {
    mutate({ username, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded border-gray-300 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded border-gray-300 focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Login
        </button>
        {isError && (
          <p className="mt-4 text-red-500">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
