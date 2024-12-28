import {ID, Response} from '../../../../../_metronic/helpers'
import { Agency } from '../../../../modules/apps/user-management/users-list/core/_models'
export type Data = {
  id?: ID
  placeOfIssue ?: string
  networkName?: string
  category?: string
  subscriberNumber?: string
  currentPackage?: string
  priorityPackage1?: string
  priorityPackage2?: string
  registrationDate?: string
  expirationDate?: string
  notes?: string
  TKC?: string
  APRU3Months?: string
  usageMonth1?: string
  usageMonth2?: string
  usageMonth3?: string
  usageMonth4?: string
  Package?: string
  totalTKCUsage ?: string
  voiceUsage ?: string
  dataUsage ?: string
  outOfPackageDataUsage ?: string
  other1 ? : string
  other2 ? : string
  other3 ? : string
  agency?: Agency
}

export type DataQueryResponse = Response<Array<Data>>

export const initialData: Data = {
  subscriberNumber: '',
  currentPackage: '',
  priorityPackage1: '',
  priorityPackage2: '',
  registrationDate: '',
  expirationDate: '',
  notes: '',
  TKC: '',
  APRU3Months: '',
  usageMonth1: '',
  usageMonth2: '',
  usageMonth3: '',
  usageMonth4: '',
  Package: '',
  placeOfIssue: '',
  totalTKCUsage : '',
  voiceUsage : '',
  dataUsage : '',
  outOfPackageDataUsage: '',
  other1  : '',
  other2  : '',
  other3  : '',
  agency: {
    id: 0,
    name: '',
  }
}
