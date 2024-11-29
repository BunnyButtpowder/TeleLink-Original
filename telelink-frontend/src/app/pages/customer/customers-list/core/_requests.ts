import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Customer, Result } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem("auth_token");

const getData = async (salesmanId: ID): Promise<Customer> => {
  const response = await axios.get(`${API_URL}/data-assign/salesman?id=${salesmanId}`);
  return response.data.dataDetails;
};

const getAllPackages = async() => {
  try{
    const response = await axios.get(`${API_URL}/packages/getall`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch packages: ', error);
    throw error;
  }
}

const getPackagesByDataId = async (dataId: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL}/packages/get-package?id=${dataId}`);
    const packageString = response.data.package; // The string containing package names
    if (packageString) {
      return packageString.split(','); // Split the string into an array of packages
    }
    return []; // Return an empty array if no packages are available
  } catch (error) {
    console.error('Failed to fetch packages by data ID:', error);
    throw error;
  }
};

const createCallResult = async (result: Result, dataId: string, date: string) => {
  const response = await axios.post(`${API_URL}/data/works?dataId=${dataId}`,
    {
      callResult: {
        result: result.result,
        dataPackage: result.dataPackage,
        customerName: result.customerName,
        address: result.address,
        note: result.note,
      },
      date: date
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json',
      },
    }
  )
  return response.data;
}


export {
  getData,
  createCallResult,
  getAllPackages,
  getPackagesByDataId
};
