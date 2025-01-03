import {ID, Response} from '../../../../../_metronic/helpers'
import { User } from '../../../../modules/apps/user-management/users-list/core/_models'
export type Package = {
  id?: ID
  title?: string
  provider?: string
  type?: string
  price?: number
  createdAt?: number
}

export type ScheduledFile = {
  id: number;
  createdAt: string;
  filePath: string;
  scheduledDate: string;
  user: User;
}

export type PackageQueryResponse = Response<Array<Package>>

export const initialPackage: Package = {
  title: '',
  provider: '',
  type: '',
  price: undefined
}
