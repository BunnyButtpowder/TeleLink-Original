import {ID, Response} from '../../../../../_metronic/helpers'

export type Package = {
  id?: ID
  code?: string
  title?: string
  provider?: string
  type?: string
  price?: number
  createdAt?: number
}

export type PackageQueryResponse = Response<Array<Package>>

export const initialPackage: Package = {
  code: '',
  title: '',
  provider: '',
  type: '',
  price: undefined
}
