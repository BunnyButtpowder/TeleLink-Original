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

export type UsersQueryResponse = Response<Array<User>> & {
  employees?: Array<User>;  // Custom field for the response from getSalesmenByAgency
}

export const initialUser: User = {
  avatar: 'https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg',
  fullName: '',
  phoneNumber: '',
  dob: '',
  address: '',
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
