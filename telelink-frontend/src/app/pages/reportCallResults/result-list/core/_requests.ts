import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../_metronic/helpers";
import { CallResult, CallResultQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const GET_ALL_RESULT_URL = `${API_URL}/result/getall`;

const exportReport = (startDate?: string, endDate?: string): Promise<void> => {
  let url = `${API_URL}/results/export`;
  const params = new URLSearchParams();

  if (startDate) {
    params.append('startDate', startDate);
  }
  if (endDate) {
    params.append('endDate', endDate);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return axios
    .get(url, {
      responseType: "blob", 
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
    .then((response: AxiosResponse<Blob>) => {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      let fileName = "bao_cao_ket_qua_goi";
      if (startDate && endDate) {
        fileName += `_${startDate}_den_${endDate}`;
      }
      fileName += ".xlsx";
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName; 
      link.click();
    })
    .catch((error) => {
      console.error("Error exporting report:", error);
      throw error;
    });
};

const getAllCallResults = (params: {
  saleman?: number,
  agencyId?: number,
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
  getPackagesByDataId,
  exportReport,
};
