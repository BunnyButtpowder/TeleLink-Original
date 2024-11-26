import {ID, Response} from '../../../../../_metronic/helpers'
import { Agency } from '../../../../modules/apps/user-management/users-list/core/_models'

export type Revenue = {
  id?: ID
  agency?: Agency
  total?: number
  accept?: number
  reject?: number
  unanswered?: number
  unavailable?: number
  rehandle?: number
  lost?: number
  revenue?: number
  successRate?: number
  failRate?: number
}

export type RevenueQueryResponse = Response<Array<Revenue>>