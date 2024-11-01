import {ID, Response} from '../../../../../_metronic/helpers'
import { Agency } from '../../../../modules/apps/user-management/users-list/core/_models'
export type Customer = {
  id?: ID
  placeOfIssue ?: string
  networkName?: string
  category?: string
  subscriberNumber?: string
  currentPackage?: string
  priorityPackage1?: string
  priorityPackage2?: string
  registrationDate?: Date
  expirationDate?: Date
  notes?: string
  TKC?: string
  ARPU3Months?: string
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
export type CustomersQuerySingleResponse = Response<Customer>
export type CustomersQueryResponse = Response<Array<Customer>>

export const initialCustomer: Customer = {
  subscriberNumber: '80981128185',
  currentPackage: 'ST15K',
  priorityPackage1: ',,V200X,',
  priorityPackage2: 'B2000',
  registrationDate: new Date(),
  expirationDate: new Date(),
  notes: '',
  TKC: '',
  ARPU3Months: '',
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
