import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;
const CHANGE_PASSWORD_URL = `${API_URL}`;

export const changePassword = async (userId: number, oldPassword: string, newPassword: string) => {
  return axios.post(`${CHANGE_PASSWORD_URL}/auth/change?id=${userId}`, { 
    oldPassword, 
    newPassword 
  });
};