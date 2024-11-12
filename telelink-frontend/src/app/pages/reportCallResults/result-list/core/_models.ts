import {ID, Response} from '../../../../../_metronic/helpers'
import { Agency, User, initialUser } from '../../../../modules/apps/user-management/users-list/core/_models'
import { Data, initialData } from '../../../data/data-list/core/_models'
export type CallResult = {
  id?: ID
  data_id: Data
  agency?: Agency
  saleman?: User
  subscriberNumber: string
  result: number
  dataPackage?: string | null
  customerName?: string
  address?: string
  note?: string
  revenue?: number
  createdAt?: number
  updatedAt?: number
}

export type CallResultQueryResponse = Response<Array<CallResult>>

export const initialCallResult: CallResult = {
  data_id: initialData,
  agency: {
    name: '',
  },
  saleman: initialUser,
  subscriberNumber: '',
  result: 1,
  dataPackage: '',
  customerName: '',
  address: '',
  note: '',
  revenue: 0,
}
