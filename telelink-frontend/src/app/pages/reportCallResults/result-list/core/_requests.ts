import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { CallResult, CallResultQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const GET_ALL_RESULT_URL = `${API_URL}/result/getall`;

const getAllCallResults = (params: {saleman?: number, agencyId?: number, result?: number, searchTerm?: string, sort?: string, order?: string}): Promise<CallResultQueryResponse> => {
  return axios
    .get(GET_ALL_RESULT_URL, { params })
    .then((response: AxiosResponse<CallResultQueryResponse>) => response.data);
};

const updateCallResult = async (resultId: number, updateData: Partial<CallResult>): Promise<Response<CallResult>> => {
  try {
    const response: AxiosResponse<Response<CallResult>> = await axios.post(`${API_URL}/result/update?resultId=${resultId}`, {update: updateData});
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

const getUserById = (id: ID): Promise<CallResult | undefined> => {
  return axios
    .get(`${API_URL}/result/${id}`)
    .then((response: AxiosResponse<Response<CallResult>>) => response.data)
    .then((response: Response<CallResult>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${API_URL}/result/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${API_URL}/result/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getAllCallResults,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  updateCallResult,
};
