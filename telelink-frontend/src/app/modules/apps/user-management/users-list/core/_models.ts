import {ID, Response} from '../../../../../../_metronic/helpers'
export type User = {
  id?: ID
  name?: string
  avatar?: string
  email?: string
  position?: string
  role?: string
  last_login?: string
  status?: boolean
  joined_day?: string
  online?: boolean
  initials?: {
    label: string
    state: string
  }
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: 'avatars/blank.png',
  position: 'Developer',
  role: 'Sub-admin',
  name: '',
  email: '',
  status: false,
}
