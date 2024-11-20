import {ID, Response} from '../../../../../_metronic/helpers'

export type Report = {
  total?: number
  accept?: number
  reject?: number
  unanswered?: number
  unreachable?: number
  rehandle?: number
  lost?: number
  revenue?: number
  successRate?: number
  failRate?: number
}

export type Revenue = {
  id?: ID
  agency?: string
  report: Report
}

export type RevenueQueryResponse = Response<Array<Revenue>>