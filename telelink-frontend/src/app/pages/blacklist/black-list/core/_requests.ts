import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Blacklist, DataQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const USER_URL = `${API_URL}/user`;
const BLACKLIST_URL= `${API_URL}/blacklist`;
const GET_ALL_BLACKLIST_URL = `${API_URL}/blacklist`;

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

const getAllBlackList = (): Promise<DataQueryResponse> => {
  return axios
    .get(GET_ALL_BLACKLIST_URL)
    .then((response: AxiosResponse<DataQueryResponse>) => response.data);
};

const getBlacklistById = async (id: ID) => {
  const response = await axios.get(`${BLACKLIST_URL}/${id}`);
  return response.data;
};

const createBlacklistNumber = (number: Blacklist): Promise<Blacklist | undefined> => {
  const transformedPackage = {
    SDT: number.SDT,
    note: number.note,
  };
  return axios
    .post(BLACKLIST_URL, transformedPackage)
    .then((response: AxiosResponse<Response<Blacklist>>) => response.data)
    .then((response: Response<Blacklist>) => response.data);
};
const updateBlacklistNumber = async (number: Blacklist, token: string): Promise<Blacklist | undefined> => {
  try {
    const response = await fetch(`${BLACKLIST_URL}/${number.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        SDT: number.SDT,
        note: number.note,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update blacklist number');
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Failed to update blacklist number', error);
    throw error;
  }
}

const getAllUsers = async() => {
  try{
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch agencies:', error);
    throw error;
  }
}


// const getUserById = (id: ID): Promise<Data | undefined> => {
//   return axios
//     .get(`${USER_URL}/${id}`)
//     .then((response: AxiosResponse<Response<Data>>) => response.data)
//     .then((response: Response<Data>) => response.data);
// };

// const updateUser = (customer: Data): Promise<Data | undefined> => {
//   return axios
//     .post(`${USER_URL}/${customer.id}`, customer)
//     .then((response: AxiosResponse<Response<Data>>) => response.data)
//     .then((response: Response<Data>) => response.data);
// };


const deleteNumber = (sdt: ID): Promise<void> => {
  return axios.delete(`${BLACKLIST_URL}/${sdt}`).then(() => { });
};

const deleteSelectedNumber = (sdt: Array<ID>): Promise<void> => {
  const requests = sdt.map((id) => axios.delete(`${BLACKLIST_URL}/${sdt}`));
  return axios.all(requests).then(() => { });
};

export {
  importData,
  deleteNumber,
  deleteSelectedNumber,
  // getUserById,
  // updateUser,
  getAllUsers,
  getAllBlackList,
  getBlacklistById,
  createBlacklistNumber,
  updateBlacklistNumber
};
