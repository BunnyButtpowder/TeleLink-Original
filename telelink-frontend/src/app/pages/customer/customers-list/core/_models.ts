import {ID, Response} from '../../../../../_metronic/helpers'
export type Customer = {
  id?: ID
  phoneNum?: string
  currentPack?: string
  specialPack?: string
  assignedPack?: string
  regisDate?: Date
  expDate?: Date
  note?: string
  mainAccount?: string
  avg?: string
  consump_n1?: string
  consump_n2?: string
  consump_n3?: string
  consump_n4?: string
  consultingPackage?: string
  dataSrc ?: string
  mainAcc_consump ?: string
  voice_consump ?: string
  data_consump ?: string
  outPackage_consump ?: string
  khac1 ? : string
  khac2 ? : string
  khac3 ? : string
}

export type UsersQueryResponse = Response<Array<Customer>>

export const initialUser: Customer = {
  phoneNum: '80981128185',
  currentPack: 'ST15K',
  specialPack: ',,V200X,',
  assignedPack: 'B2000',
  regisDate: new Date(),
  expDate: new Date(),
  note: '',
  mainAccount: '',
  avg: '',
  consump_n1: '',
  consump_n2: '',
  consump_n3: '',
  consump_n4: '',
  consultingPackage: '',
  dataSrc: '',
  mainAcc_consump : '',
  voice_consump : '',
  data_consump : '',
  outPackage_consump: '',
  khac1  : '',
  khac2  : '',
  khac3  : '',
}
