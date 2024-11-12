import {ID, Response} from '../../../../../_metronic/helpers'
import { User } from '../../../../modules/apps/user-management/users-list/core/_models'
export type Blacklist = {
  id?: ID,
  SDT?: string,
  note?: string,
  user?: User,
  createdAt?: number,
}

export type BlacklistQueryResponse = Response<Array<Blacklist>>

export const initialUser: User = {
  avatar: 'avatars/blank.png',
  fullName: '',
  phoneNumber: '',
  dob: null,
  address: null,
  agency: {
    id: 0,
    name: '',
  },
  gender: '',
  dataType: '',
  auth: {
    email: '',
    isActive: false,
    username: '',
    password: '',
    role: 3,
  },
  isDelete: false,
}

export const initialBlacklist: Blacklist = {
  SDT: '',
  note: '',
  user: initialUser
}

