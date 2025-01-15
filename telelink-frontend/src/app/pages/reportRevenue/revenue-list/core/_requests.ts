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

const getTopSalesmen = async (params?: {
  number: number,
  date?: string,
  agencyId?: number
}) => {
  try {
    const response = await axios.get(`${REVENUE_URL}/get-top`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch top 10 salesmen:", error);
    throw error;
  }
}

const getTopAgencies = async (params?: {
  top: number,
  date?: string,
}) => {
  try {
    const response = await axios.get(`${REVENUE_URL}/get-top-agency`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch top 10 salesmen:", error);
    throw error;
  }
}

const getYearlyRevenue = async (params?: {
  agencyId?: string
}) => {
  try {
    const response = await axios.get(`${REVENUE_URL}/get-years`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch yearly revenue:", error);
    throw error;
  }
}

const getMonthlyRevenue = async (params?: {
  agencyId?: string
  date?: string
}) => {
  try {
    const response = await axios.get(`${REVENUE_URL}/get-months`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch monthly revenue:", error);
    throw error;
  }
}

const getWeeklyRevenue = async (params?: {
  agencyId?: string
  date?: string
}) => {
  try {
    const response = await axios.get(`${REVENUE_URL}/get-weeks`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch weekly revenue:", error);
    throw error;
  }
}

const getTotalRevenue = async () => {
  try {
    const response = await axios.get(`${REVENUE_URL}/get-total`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch total revenue:", error);
    throw error;
  }
}

const agencyGetTotalRevenue = async () => {
  try {
    const response = await axios.get(`${REVENUE_URL}/get-total-agency`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch agency total revenue:", error);
    throw error;
  }
}

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
  getTopSalesmen,
  getTopAgencies,
  exportReport,
  getYearlyRevenue,
  getMonthlyRevenue,
  getWeeklyRevenue,
  getTotalRevenue,
  agencyGetTotalRevenue
};
