import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import {  Result, SalesmanAssignedResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem("auth_token");

const getSalemanDataAssignedByAgencyID = async (agencyId: ID, search: string = ''): Promise<SalesmanAssignedResponse> => {
  const response = await axios.get(`${API_URL}/data-assign/agency-assign`, {
    params: {
      id: agencyId,
      search,
    },
  });
  return response.data;
};

const getCategoriesByUserID = async (userId: ID): Promise<{ categories: string[] }> => {
  const response = await axios.get(`${API_URL}/data-assign/category`, {
    params: {
      id: userId,
    },
  });
  return response.data;
};

const getCategoriesByAgencyID = async (agencyId: ID): Promise<{ categories: string[] }> => {
  const response = await axios.get(`${API_URL}/data/category-agency`, {
    params: {
      agencyId,
    },
  });
  return response.data;
};

const getAllDataAssignedAgency = async(search: string = '') => {
  try {
    const response = await axios.get(`${API_URL}/data-assign/admin-assign`, {
      params: {
        search,
      },
    });
    console.log('API response:', response.data.branches);
    return response.data.branches;
  } catch (error) {
    console.error('Failed to fetch agency data assigned: ', error);
    throw error;
  }
}


const retrieveFromSalesmanToAdmin = async (userId: ID, categories: string[]): Promise<AxiosResponse> => {
  const response = await axios.post(`${API_URL}/data-assign/recall-admin`, {
    userId,
    categories,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json',
    },
  });
  return response.data;
};

const retrieveFromAgencyToAdmin = async (agencyId: ID, categories: string[]): Promise<AxiosResponse> => {
  const response = await axios.post(`${API_URL}/data-assign/admin-recall`, {
    categories,
  }, {
    params: {
      agencyId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json',
    },
  });
  return response.data;
};

const retrieveFromSalesmanToAgency = async (userId: ID, categories: string[]): Promise<AxiosResponse> => {
  const response = await axios.post(`${API_URL}/data-assign/agency-recall`, {
    userId,
    categories,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json',
    },
  });
  return response.data;
};

export {
  getSalemanDataAssignedByAgencyID,
  getAllDataAssignedAgency,
  getCategoriesByUserID,
  getCategoriesByAgencyID,
  retrieveFromSalesmanToAdmin,
  retrieveFromAgencyToAdmin,
  retrieveFromSalesmanToAgency
};
