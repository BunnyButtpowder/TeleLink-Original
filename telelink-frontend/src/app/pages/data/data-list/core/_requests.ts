import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Data, DataQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const USER_URL = `${API_URL}/user`;
const GET_ALL_DATA_URL = `${API_URL}/data/getall`;

const importData = async (file: File, onUploadProgress: (ProgressEvent: any) => void): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/import-data`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    console.error('Error importing data', error);
    throw error;
  }
};

const getAllData = (params: {searchTerm?: string, sort?: string, order?: string, placeOfIssue?: string, networkName?: string, page?: number, limit?: number}): Promise<DataQueryResponse> => {
  return axios
    .get(GET_ALL_DATA_URL, { params })
    .then((response: AxiosResponse<DataQueryResponse>) => response.data);
};

const getAllNetworks = (): Promise<any> => {
  return axios
    .get(`${API_URL}/data/network`)
    .then((response: AxiosResponse<any>) => response.data);
}

const getDataByAgency = async (agencyId: ID): Promise<DataQueryResponse> => {
  return axios
    .get(`${API_URL}/data/agency`, { params: { agencyId } })
    .then((response: AxiosResponse<DataQueryResponse>) => response.data);
}

const getSalesmenByAgency = async (agencyId: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/agency`, { params: { agencyId } });
    return response.data.employees.map((employee: any) => ({
      id: employee.id,
      fullName: employee.fullName,
    }));
  } catch (error) {
    console.error('Failed to fetch salesmen by agency:', error);
    throw error;
  }
}

const getNetworksByAgency = async (agencyId: string) => {
  try {
    const response = await axios.get(`${API_URL}/data/network-agency`, { params: { agencyId } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch networks by agency:', error);
    throw error;
  }
}

const getCategoriesByAgency = async (agencyId: string) => {
  try {
    const response = await axios.get(`${API_URL}/data/category-agency`, { params: { agencyId } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories by agency:', error);
    throw error;
  }
}

const dataAssignAgency = async (values: any): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/data-assign/agency`, values);
    return response.data;
  } catch (error) {
    console.error('Error distributing data to agency:', error);
    throw error;
  }
}

const dataAssignAdminToSaleman = async (values: any): Promise<any> => {
  try{
    const response = await axios.post(`${API_URL}/data-assign/admin-user`, values);
    return response.data;
  } catch (error) {
    console.error('Error distributing data from admin to saleman:', error);
    throw error;
  }
}

const dataAssignSalesman = async (values: any): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/data-assign/agency-user`, values);
    return response.data;
  } catch (error) {
    console.error('Error distributing data to saleman:', error);
    throw error;
  }
}

const getAllAgencies = async () => {
  try {
    const response = await axios.get(`${API_URL}/agencys/getall`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch agencies:', error);
    throw error;
  }
}

const getAllDataCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/data/category`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data categories:', error);
    throw error;
  }
}

const getDataCategoriesByNetworks = async (network: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/data/categorys`, { params: { network } });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch data categories for network: ${network}`, error);
    throw error;
  }
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

const deleteSelectedData = (ids: ID[]): Promise<void> => {
  return axios.delete(`${API_URL}/data/many-delete`, { data: { ids } }).then(() => { });
};

export {
  importData,
  getAllData,
  getDataByAgency,
  dataAssignSalesman,
  deleteUser,
  getUserById,
  updateUser,
  dataAssignAgency,
  getAllAgencies,
  getAllDataCategories,
  getSalesmenByAgency,
  getAllNetworks,
  getNetworksByAgency,
  getCategoriesByAgency,
  dataAssignAdminToSaleman,
  deleteSelectedData,
  getDataCategoriesByNetworks
};
