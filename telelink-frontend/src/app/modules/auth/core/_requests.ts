import axios from "axios";
import { AuthModel, UserModel } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/auth/verify_token`;
export const LOGIN_URL = `${API_URL}/auth/login`;
export const REGISTER_URL = `${API_URL}/auth/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;
const USER_URL = `${API_URL}/user`;

export function login(username: string, password: string) {
  return axios.post<{user: UserModel; token: string}>(LOGIN_URL, {
    username,
    password,
  });
}

// Server should return AuthModel
export function register(
  email: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    password,
    password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserById(id: number) {
  return axios.get<UserModel>(`${USER_URL}/${id}`);
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
