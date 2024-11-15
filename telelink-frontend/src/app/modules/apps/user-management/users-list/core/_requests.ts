import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { User, UsersQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const USER_URL = `${API_URL}/user`;
const GET_USERS_URL = `${API_URL}/users/getall`;
const DELETE_USER_URL = `${API_URL}/users/delete?id=`;
export const REGISTER_URL = `${API_URL}/users/create`;



const getUsers = (params: {searchTermAuth?: string, sort?: string, order?: string, role?: number, gender?: string, agency?: number}): Promise<UsersQueryResponse> => {
  return axios
    .get(GET_USERS_URL, {params})
    .then((response: AxiosResponse<UsersQueryResponse>) => response.data);
};

const getSalesmenByAgency = (params: {searchTermAuth?: string, sort?: string, order?: string, role?: number, gender?: string, agency?: number}) : Promise<UsersQueryResponse> => {
  return axios
    .get(`${API_URL}/users/agency`, {params})
    .then((response: AxiosResponse<UsersQueryResponse>) => response.data);
}

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
    agency: user.agency?.id || undefined,
    avatar: user.avatar || '',
    name: user.auth.role === 2 ? user.agency?.name : undefined,
  };
  return axios
    .post(REGISTER_URL, transformedUser)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const updateAgency = async (agencyId: number, name: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/agency/${agencyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to update agency');
    }
  } catch (error) {
    console.error('Failed to update agency', error);
    throw error;
  }
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
        agency: user.agency?.id || null,
        avatar: user.avatar || '',
        gender: user.gender,
        dataType: user.dataType || '',
        isActive: user.auth.isActive || false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    if (user.auth.role === 2 && user.agency && user.agency.id && user.agency.name) {
      await updateAgency(user.agency.id, user.agency.name, token);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Failed to update user', error);
    throw error;
  }
}

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${DELETE_USER_URL}${userId}`).then(() => { });
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => { });
};

export {
  getUsers,
  getSalesmenByAgency,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
};
