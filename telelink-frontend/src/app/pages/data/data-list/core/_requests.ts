import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Data, DataQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const USER_URL = `${API_URL}/user`;
const GET_ALL_DATA_URL = `${API_URL}/data`;

const importData = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/import-data`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error importing data', error);
    throw error;
  }
};

const getAllData = (): Promise<DataQueryResponse> => {
  return axios
    .get(GET_ALL_DATA_URL)
    .then((response: AxiosResponse<DataQueryResponse>) => response.data);
};

const getUserById = (id: ID): Promise<Data | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
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
  importData,
  getAllData,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  updateUser,
};
