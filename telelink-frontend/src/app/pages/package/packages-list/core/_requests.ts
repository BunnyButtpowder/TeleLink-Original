import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Package, PackageQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const PACKAGE_URL = `${API_URL}/package`;
const DELETE_PACKAGE_URL = `${API_URL}/package?id=`;


const getPackages = (params: {searchTerm?: string, sort?: string, order?: string, provider?: string, type?: string}): Promise<PackageQueryResponse> => {
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

const deletePackage = (packageId: ID): Promise<void> => {
  return axios.delete(`${DELETE_PACKAGE_URL}${packageId}`).then(() => { });
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${PACKAGE_URL}/${id}`));
  return axios.all(requests).then(() => { });
};

export {
  getPackages,
  deletePackage,
  deleteSelectedUsers,
  getPackageById,
  createPackage,
  updatePackage,
};
