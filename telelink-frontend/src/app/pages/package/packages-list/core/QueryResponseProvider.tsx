/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useContext, useState, useEffect, useMemo} from 'react'
import {useQuery} from 'react-query'
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from '../../../../../_metronic/helpers'
import {getPackages} from './_requests'
import {Package} from './_models'
import {useQueryRequest} from './QueryRequestProvider'
import { useAuth } from '../../../../../app/modules/auth'

const QueryResponseContext = createResponseContext<Package>(initialQueryResponse)
const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  const fetchData = () => {
    const {search = '', sort = '', order = '', filter = {}, page = 1, items_per_page = 10} = state;

    const {provider, type } = filter;
    return getPackages({ searchTerm: search, sort, order, provider, type, page, limit: items_per_page });
  }
  const { isFetching, refetch, data: response } = useQuery(
    [`${QUERIES.USERS_LIST}-${query}`, state.filter],
    fetchData,
    { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false }
  )

  return (
    <QueryResponseContext.Provider value={{ isLoading: isFetching, refetch, response, query }}>
      {children}
    </QueryResponseContext.Provider>
  )
}
const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const {response} = useQueryResponse()
  if (!response) {
    return []
  }

  return response?.data || []
}

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    ...initialQueryState,
  }

  const {response} = useQueryResponse()
  console.log("Packages response", response)
  if (!response) {
    return defaultPaginationState
  }

  return {
    page: response.currentPage,
    items_per_page: response.perPage,
    total: response.totalCount,
    total_pages: response.totalPages,
  }
}

const useQueryResponseLoading = (): boolean => {
  const {isLoading} = useQueryResponse()
  return isLoading
}

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
