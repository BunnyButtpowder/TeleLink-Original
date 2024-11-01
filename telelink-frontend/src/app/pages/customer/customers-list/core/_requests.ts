import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Customer, CustomersQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const USER_URL = `${API_URL}/user`;
const GET_USERS_URL = `${API_URL}/users/query`;

const getData = async (salesmanId: ID): Promise<Customer> => {
  const response = await axios.get(`${API_URL}/data-assign/salesman?id=${salesmanId}`);
  return response.data.dataDetails;
};

const getUserById = (id: ID): Promise<Customer | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<Customer>>) => response.data)
    .then((response: Response<Customer>) => response.data);
};

const createUser = (customer: Customer): Promise<Customer | undefined> => {
  return axios
    .put(USER_URL, customer)
    .then((response: AxiosResponse<Response<Customer>>) => response.data)
    .then((response: Response<Customer>) => response.data);
};

const updateUser = (customer: Customer): Promise<Customer | undefined> => {
  return axios
    .post(`${USER_URL}/${customer.id}`, customer)
    .then((response: AxiosResponse<Response<Customer>>) => response.data)
    .then((response: Response<Customer>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getData,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
};
