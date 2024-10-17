import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Data, UsersQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const USER_URL = `${API_URL}/user`;
const GET_ALL_DATA_URL = `${API_URL}/data`;

const getAllData = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(GET_ALL_DATA_URL)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data);
};

const getUserById = (id: ID): Promise<Data | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<Data>>) => response.data)
    .then((response: Response<Data>) => response.data);
};

const createUser = (customer: Data): Promise<Data | undefined> => {
  return axios
    .put(USER_URL, customer)
    .then((response: AxiosResponse<Response<Data>>) => response.data)
    .then((response: Response<Data>) => response.data);
};

const updateUser = (customer: Data): Promise<Data | undefined> => {
  return axios
    .post(`${USER_URL}/${customer.id}`, customer)
    .then((response: AxiosResponse<Response<Data>>) => response.data)
    .then((response: Response<Data>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => { });
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => { });
};

export {
  getAllData,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
};
