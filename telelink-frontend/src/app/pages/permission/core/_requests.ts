import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../_metronic/helpers";
import { Permission, PermissionQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;
const PERMISSION_URL = `${API_URL}/permission`;

const getPermissionsByRole = async (roleId: ID): Promise<PermissionQueryResponse> => {
    return axios
        .get(`${PERMISSION_URL}/get?role_id=${roleId}`)
        .then((response: AxiosResponse<PermissionQueryResponse>) => response.data);
}

const updatePermissionByRole = async (roleId: number, permissions: number[]) => {
    const response = await axios.post(`${PERMISSION_URL}/update`, {
        role_id: roleId,
        permissions: permissions
    })
    return response.data;
}

export {
    getPermissionsByRole,
    updatePermissionByRole
}
