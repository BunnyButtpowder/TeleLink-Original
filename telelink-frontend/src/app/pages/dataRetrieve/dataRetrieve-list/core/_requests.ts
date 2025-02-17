import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Branch, Result, SalesmanAssignedResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem("auth_token");

const getSalemanDataAssignedByAgencyID = async (agencyId: ID): Promise<SalesmanAssignedResponse> => {
  const response = await axios.get(`${API_URL}/data-assign/agency-assign`, {
    params: {
      id: agencyId,
    },
  });
  return response.data;
};


const getAllDataAssignedAgency = async() => {
  try{
    const response = await axios.get(`${API_URL}/data-assign/admin-assign`);
    console.log('API response:', response.data.branches);
    return response.data.branches;
  } catch (error) {
    console.error('Failed to fetch agency data assigned: ', error);
    throw error;
  }
}

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
  getSalemanDataAssignedByAgencyID,
  createCallResult,
  getAllDataAssignedAgency
};
