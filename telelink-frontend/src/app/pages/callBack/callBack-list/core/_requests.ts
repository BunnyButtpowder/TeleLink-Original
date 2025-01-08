import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Rehandle, Result, CallBackQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem("auth_token");

interface RehandleQueryParams {
  result?: number;
  searchTerm?: string;
  sort?: string;
  order?: "asc" | "desc";
}

const getAllRehandles = async (params?: RehandleQueryParams): Promise<CallBackQueryResponse> => {
  try {
    const response: AxiosResponse<CallBackQueryResponse> = await axios.get(`${API_URL}/rehandle/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch rehandles: ', error);
    throw error;
  }
}

const getLatestCalls = async () => {
  try {
    const response = await axios.get(`${API_URL}/rehandle/get-latest`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch top 10 salesmen:", error);
    throw error;
  }
}

const getRehandleById = async (id: ID): Promise<Result> => {
  const response = await axios.get(`${API_URL}/rehandles/getid?id=${id}`);
  return response.data.data;
};

const getPackagesByDataId = async (dataId: string): Promise<Array<{ id: number; title: string }>> => {
  try {
    const response = await axios.get(`${API_URL}/packages/get-package?id=${dataId}`);
    // Assuming `response.data.package` is an array of objects with `id` and `title`
    return response.data.package.map((pkg: any) => ({
      id: pkg.id,
      title: pkg.title,
    }));
  } catch (error) {
    console.error('Failed to fetch packages by data ID:', error);
    throw error;
  }
};


const createRehandleResult = async (result: Result, dataId: number, date: string) => {
  const response = await axios.post(`${API_URL}/rehandle/work?dataId=${dataId}`,
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
  getAllRehandles,
  createRehandleResult,
  getPackagesByDataId,
  getRehandleById,
  getLatestCalls
};
