import { subscribe } from 'diagnostics_channel'
import { ID, Response } from '../../../../../_metronic/helpers'
import { Agency } from '../../../../modules/apps/user-management/users-list/core/_models'

export type Branch = {
  branchId?: number
  branchName?: string
  assignedData?: AssignedData[]
  unassignedData?: Record<string, number>
  unassignedTotal?: number
}

export type AssignedData = {
  user: number 
  userName: string
  totalData: number
  categories: Record<string, number>
}

export type SalesmanAssignedData = {
  user: number 
  userName: string
  agency: string
  totalData: number
  categories: Record<string, number>
}

export interface SalesmanAssignedResponse {
  data: any[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

type AdminBranchResponse = {
  data: Branch[];
}

export type QueryResponse = AdminBranchResponse | SalesmanAssignedResponse;

export type Result = {
  id?: number;
  data_id: number;
  agency?: number;
  salesman?: number;
  categories?: string[];
  createdAt?: number;
  updatedAt?: number;
}

export const initialResult: Result = {
  data_id: 0,
  agency: 0,
  salesman: 0,
  categories: [],
}