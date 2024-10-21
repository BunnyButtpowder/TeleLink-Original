import {ID, Response} from '../../../../../../_metronic/helpers'
export type AuthInfo = {
  id?: ID
  email?: string
  username: string
  password: string
  status?: boolean
  role: number
}

export type Agency = {
  id?: ID
  name?: string
}

export type User = {
  id?: ID
  fullName: string
  phoneNumber?: string
  dob?: string | null
  address?: string | null
  agency?: Agency
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
    status: false,
    username: '',
    password: '',
    role: 3,
  },
  isDelete: false,
}
