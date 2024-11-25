import {ID, Response} from '../../../../_metronic/helpers'

export type Permission = {
  id?: ID
  title: string
  path?: string
  method?: string
}

export type PermissionQueryResponse = Response<Array<Permission>>
