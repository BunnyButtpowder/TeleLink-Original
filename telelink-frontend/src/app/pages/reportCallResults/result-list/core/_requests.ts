import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { CallResult, CallResultQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const GET_ALL_RESULT_URL = `${API_URL}/result/getall`;

const getAllCallResults = (params: {
  saleman?: number,
  agencyId?: string,
  result?: number,
  searchTerm?: string,
  date?: string,
  sort?: string,
  order?: string
}): Promise<CallResultQueryResponse> => {
  return axios
    .get(GET_ALL_RESULT_URL, { params })
    .then((response: AxiosResponse<CallResultQueryResponse>) => response.data)
    .catch((error) => {
      console.error("Error fetching call results:", error);
      throw error;
    });
};

const updateCallResult = async (resultId: number, updateData: Partial<CallResult>): Promise<Response<CallResult>> => {
  try {
    const response: AxiosResponse<Response<CallResult>> = await axios.post(`${API_URL}/result/update?resultId=${resultId}`, 
      { update: ({
        ...updateData,
        data_id: updateData.data_id?.id,
        agency: updateData.agency?.id,
        saleman: updateData.saleman?.id,
      }) });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

const getResultById = async (id: ID) => {
  const response = await axios.get(`${API_URL}/result/${id}`);
  return response.data;
};

const deleteResult = (id: ID): Promise<void> => {
  return axios.delete(`${API_URL}/result/${id}`).then(() => { });
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${API_URL}/result/${id}`));
  return axios.all(requests).then(() => { });
};

export {
  getAllCallResults,
  deleteResult,
  deleteSelectedUsers,
  getResultById,
  updateCallResult,
};
