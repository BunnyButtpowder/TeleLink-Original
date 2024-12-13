import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { Revenue, RevenueQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const REVENUE_URL = `${API_URL}/report`;

const getAllRevenue = (params: {
  date?: string,
  agencyId?: number,
  searchTerm?: string,
}): Promise<RevenueQueryResponse> => {
  return axios
    .get(`${REVENUE_URL}/get`, { params })
    .then((response: AxiosResponse<RevenueQueryResponse>) => response.data)
    .catch((error) => {
      console.error("Error fetching revenues:", error);
      throw error;
    });
};

const exportReport = (): Promise<void> => {
  return axios
    .get(`${API_URL}/api/reports/export`, {
      responseType: "blob", 
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
    .then((response: AxiosResponse<Blob>) => {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Report.xlsx"; 
      link.click();
    })
    .catch((error) => {
      console.error("Error exporting report:", error);
      throw error;
    });
};

const getUserById = (id: ID): Promise<Revenue | undefined> => {
  return axios
    .get(`${REVENUE_URL}/${id}`)
    .then((response: AxiosResponse<Response<Revenue>>) => response.data)
    .then((response: Response<Revenue>) => response.data);
};

const createUser = (customer: Revenue): Promise<Revenue | undefined> => {
  return axios
    .put(REVENUE_URL, customer)
    .then((response: AxiosResponse<Response<Revenue>>) => response.data)
    .then((response: Response<Revenue>) => response.data);
};

const updateUser = (customer: Revenue): Promise<Revenue | undefined> => {
  return axios
    .post(`${REVENUE_URL}/${customer.id}`, customer)
    .then((response: AxiosResponse<Response<Revenue>>) => response.data)
    .then((response: Response<Revenue>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${REVENUE_URL}/${userId}`).then(() => { });
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${REVENUE_URL}/${id}`));
  return axios.all(requests).then(() => { });
};

export {
  getAllRevenue,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
  exportReport
};
