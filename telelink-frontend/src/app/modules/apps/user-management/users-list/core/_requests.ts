import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { User, UsersQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const USER_URL = `${API_URL}/user`;
const GET_USERS_URL = `${API_URL}/users/getall`;
export const REGISTER_URL = `${API_URL}/users/create`;

// const getUsers = (query: string): Promise<UsersQueryResponse> => {
//   return axios
//     .get(`${GET_USERS_URL}?${query}`)
//     .then((d: AxiosResponse<UsersQueryResponse>) => d.data);
// };

const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(GET_USERS_URL)
    .then((response: AxiosResponse<UsersQueryResponse>) => response.data);
};

const getUserById = async (id: ID) => {
  const response = await axios.get(`${USER_URL}/${id}`);
  return response.data;
};

const createUser = (user: User): Promise<User | undefined> => {
  const transformedUser = {
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    dob: user.dob,
    address: user.address,
    email: user.auth.email,
    username: user.auth.username,
    password: user.auth.password,
    role: user.auth.role,
    gender: user.gender,
    agency: user.agency,
  };
  return axios
    .post(REGISTER_URL, transformedUser)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const updateUser = async (user: User, token: string): Promise<User | undefined> => {
  try {
    const response = await fetch(`${USER_URL}/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: user.id,
        isDelete: user.isDelete || false,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        address: user.address,
        agency: user.agency || '',
        avatar: user.avatar || '',
        gender: user.gender,
        dataType: user.dataType || '',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Failed to update user', error);
    throw error;
  }
}

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => { });
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => { });
};

export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
};
