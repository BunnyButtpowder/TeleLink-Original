import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Blacklist, BlacklistQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const BLACKLIST_URL= `${API_URL}/blacklists`;

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

const getAllBlackList = (params: { searchTerm?: string; sort?: string; order?: string }): Promise<BlacklistQueryResponse> => {
  return axios
    .get(`${BLACKLIST_URL}/getall`, { params })
    .then((response: AxiosResponse<BlacklistQueryResponse>) => response.data);
};

const getSalesmanBlacklist = (userId: ID, params: { searchTerm?: string; sort?: string; order?: string } = {}): Promise<BlacklistQueryResponse> => {
  return axios
    .get(`${BLACKLIST_URL}/salesman`, { params: { userID: userId, ...params } })
    .then((response: AxiosResponse<BlacklistQueryResponse>) => response.data);
};

const getAgencyBlacklist = (agencyId: ID, params: { searchTerm?: string; sort?: string; order?: string } = {}): Promise<BlacklistQueryResponse> => {
  return axios
    .get(`${BLACKLIST_URL}/agency`, { params: { agencyID: agencyId, ...params } })
    .then((response: AxiosResponse<BlacklistQueryResponse>) => response.data);
};


const getBlacklistById = async (id: ID) => {
  const response = await axios.get(`${API_URL}/blacklist/${id}`);
  return response.data;
};

const createBlacklistNumber = (number: Blacklist, userId: string): Promise<Blacklist | undefined> => {
  const transformedBlacklist = {
    SDT: number.SDT,
    note: number.note,
  };
  return axios
    .post(`${BLACKLIST_URL}/create?userID=${userId}`, transformedBlacklist)
    .then((response: AxiosResponse<Response<Blacklist>>) => response.data)
    .then((response: Response<Blacklist>) => response.data);
};
const updateBlacklistNumber = async (number: Blacklist, token: string): Promise<Blacklist | undefined> => {
  try {
    const response = await fetch(`${API_URL}/blacklist/${number.id}`, {
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
  return axios.delete(`${API_URL}/blacklist/${sdt}`).then(() => { });
};

const deleteSelectedNumber = (sdt: Array<ID>): Promise<void> => {
  const requests = sdt.map((id) => axios.delete(`${API_URL}/blacklist/${sdt}`));
  return axios.all(requests).then(() => { });
};

export {
  importData,
  deleteNumber,
  deleteSelectedNumber,
  getSalesmanBlacklist,
  getAgencyBlacklist,
  getAllUsers,
  getAllBlackList,
  getBlacklistById,
  createBlacklistNumber,
  updateBlacklistNumber
};
