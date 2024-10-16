import {ID, Response} from '../../../../../../_metronic/helpers'
export type AuthInfo = {
  id?: ID
  email?: string
  username: string
  password: string
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
  auth: AuthInfo
  isDelete?: boolean
  createdAt?: number
  updatedAt?: number
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: 'avatars/blank.png',
  fullName: '',
  phoneNumber: '',
  dob: undefined,
  address: null,
  agency: undefined,
  gender: '',
  dataType: '',
  auth: {
    email: '',
    status: false,
    username: '',
    password: '',
    role: undefined,
  },
  isDelete: false,
}
