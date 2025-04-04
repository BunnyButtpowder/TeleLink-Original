import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Package, PackageQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const PACKAGE_URL = `${API_URL}/package`;
const DELETE_PACKAGE_URL = `${API_URL}/package?id=`;

const importData = async (file: File, userID: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('id', userID);
  try {
    const response = await axios.post(`${API_URL}/import-package`, formData, {
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

const importScheduledData = async (file: File, id: number, scheduledDate: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('id', id.toString());
  formData.append('scheduledDate', scheduledDate);

  try {
    const response = await axios.post(`${API_URL}/schedule-import-package`, formData, {
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

const getPackages = (params: {searchTerm?: string, sort?: string, order?: string, provider?: string, type?: string, page?: number, limit?: number}): Promise<PackageQueryResponse> => {
  return axios
    .get(`${API_URL}/packages/getall`, { params })
    .then((response: AxiosResponse<PackageQueryResponse>) => response.data);
};

const getPackageById = async (id: ID) => {
  const response = await axios.get(`${PACKAGE_URL}/${id}`);
  return response.data;
};

const createPackage = (pack: Package): Promise<Package | undefined> => {
  const transformedPackage = {
    title: pack.title,
    provider: pack.provider,
    type: pack.type,
    price: pack.price,
  };
  return axios
    .post(PACKAGE_URL, transformedPackage)
    .then((response: AxiosResponse<Response<Package>>) => response.data)
    .then((response: Response<Package>) => response.data);
};

const updatePackage = async (pack: Package, token: string): Promise<Package | undefined> => {
  try {
    const response = await fetch(`${PACKAGE_URL}/${pack.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: pack.id,
        title: pack.title,
        provider: pack.provider,
        type: pack.type,
        price: pack.price,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update package');
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Failed to update package', error);
    throw error;
  }
}

const getAllScheduledFiles = (): Promise<any> => {
  return axios
    .get(`${API_URL}/schedule/getpackage`)
    .then((response: AxiosResponse<any>) => response.data);
}

const deletePackage = (packageId: ID): Promise<void> => {
  return axios.delete(`${DELETE_PACKAGE_URL}${packageId}`).then(() => { });
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${PACKAGE_URL}/${id}`));
  return axios.all(requests).then(() => { });
};

const deleteScheduledFile = (id: ID): Promise<void> => {
  return axios.delete(`${API_URL}/schedule/deletepackage?id=${id}`).then(() => { });
}

export {
  getPackages,
  deletePackage,
  deleteSelectedUsers,
  getPackageById,
  createPackage,
  updatePackage,
  importData,
  importScheduledData,
  getAllScheduledFiles,
  deleteScheduledFile
};
