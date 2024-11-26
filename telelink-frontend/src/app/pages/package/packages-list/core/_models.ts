import {ID, Response} from '../../../../../_metronic/helpers'

export type Package = {
  id?: ID
  title?: string
  provider?: string
  type?: string
  price?: number
  createdAt?: number
}

export type PackageQueryResponse = Response<Array<Package>>

export const initialPackage: Package = {
  title: '',
  provider: '',
  type: '',
  price: undefined
}
