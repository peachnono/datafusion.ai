import axios from 'axios';

export const API = () => {
    // Component logic here
};


interface LoginCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  return axios.post('/api/login', credentials)
    .then(response => response.data)
    .catch(error => {
      throw new Error(error.response.data.error);
    });
}
