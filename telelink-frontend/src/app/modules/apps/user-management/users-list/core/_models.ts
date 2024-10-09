import {ID, Response} from '../../../../../../_metronic/helpers'
export type AuthInfo = {
  id?: ID
  email?: string
  username?: string
  password?: string
  status?: boolean
  role?: number
}

export type User = {
  id?: ID
  fullName?: string
  phoneNumber?: string
  dob?: string | null
  address?: string | null
  agency?: number
  avatar?: string
  gender?: string
  dataType?: string
  auth?: AuthInfo
  isDelete?: boolean
  createdAt?: number
  updatedAt?: number
  // last_login?: string
  // joined_day?: string  
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: 'avatars/blank.png',
  fullName: '',
  phoneNumber: '',
  dob: null,
  address: null,
  agency: 0,
  gender: '',
  dataType: '',
  auth: {
    email: '',
    status: false,
    username: '',
    role: 0,
  },
  isDelete: false,
  // email: '',
  // status: false,
}
