import { subscribe } from 'diagnostics_channel'
import { ID, Response } from '../../../../../_metronic/helpers'
import { Agency, User } from '../../../../modules/apps/user-management/users-list/core/_models'
import { Data } from '../../../data/data-list/core/_models';
export type Rehandle = {
  user: User,
  data: Data,
  subcriberNumber?: string,
  customerName?: string,
  complete: boolean,
  latestResult: number,
  dateToCall: string,
  note?: string
}
export type CallBackQueryResponse = Response<Array<Rehandle>>

export type Result = {
  id?: number;
  data_id: number;
  agency?: number;
  saleman?: number;
  subscriberNumber: string;
  result: number;
  dataPackage?: string;
  customerName: string;
  address?: string;
  note?: string;
  revenue?: number;
  createdAt?: number;
  updatedAt?: number;
}

export const initialResult: Result = {
  data_id: 0,
  subscriberNumber: '',
  result: 1,
  dataPackage: '',
  customerName: '',
  address: '',
}