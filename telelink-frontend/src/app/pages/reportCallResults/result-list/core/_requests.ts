import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { CallResult, CallResultQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const RESULT_URL = `${API_URL}/result/getall`;

const getAllCallResults = (params: {saleman?: number, agencyId?: number, result?: number, searchTerm?: string, sort?: string, order?: string}): Promise<CallResultQueryResponse> => {
  return axios
    .get(RESULT_URL, { params })
    .then((response: AxiosResponse<CallResultQueryResponse>) => response.data);
};

const getUserById = (id: ID): Promise<CallResult | undefined> => {
  return axios
    .get(`${RESULT_URL}/${id}`)
    .then((response: AxiosResponse<Response<CallResult>>) => response.data)
    .then((response: Response<CallResult>) => response.data);
};

const updateUser = (customer: CallResult): Promise<CallResult | undefined> => {
  return axios
    .post(`${RESULT_URL}/${customer.id}`, customer)
    .then((response: AxiosResponse<Response<CallResult>>) => response.data)
    .then((response: Response<CallResult>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${RESULT_URL}/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${RESULT_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getAllCallResults,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  updateUser,
};
