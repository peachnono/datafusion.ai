// services/authService.ts
import axios from 'axios';


interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const register = async (data: RegisterData) => {
  return axios.post(`http://localhost:5000/register`, data);
};

const login = async (data: LoginData) => {
  return axios.post(`http://localhost:5000/auth/login`, data);
};
 console.log(login)

export { register, login };
