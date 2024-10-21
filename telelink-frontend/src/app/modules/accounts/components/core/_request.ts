import axios from 'axios';
import { IProfileDetails, User } from "../settings/SettingsModel";

const API_URL = import.meta.env.VITE_APP_API_URL;
const CHANGE_PASSWORD_URL = `${API_URL}`;
const USER_URL = `${API_URL}/user`;
import { useAuth } from '../../../../../app/modules/auth';

export const changePassword = async (userId: number, oldPassword: string, newPassword: string) => {
  return axios.post(`${CHANGE_PASSWORD_URL}/auth/change?id=${userId}`, { 
    oldPassword, 
    newPassword 
  });
};



export const updateProfile = async (user: User, userId: number, token: string): Promise<User | undefined> => {
  try {
    const response = await fetch(`${USER_URL}/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        address: user.address,
        // agency: user.agency || '',
        avatar: user.avatar || '',
        gender: user.gender,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    const updateProfile = await response.json();
    return updateProfile;
  } catch (error) {
    console.error('Failed to update user', error);
    throw error;
  }
}