/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useState, useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from '../../../../../_metronic/helpers'
import { getAllData, getDataByAgency } from './_requests'
import { Data } from './_models'
import { useQueryRequest } from './QueryRequestProvider'
import { useAuth } from '../../../../../app/modules/auth'

const QueryResponseContext = createResponseContext<Data>(initialQueryResponse)

const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();
  const { currentUser } = useAuth();
  const userRole = currentUser?.auth.role;
  const agencyId = currentUser?.agency?.id;
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  const fetchData = () => {
    const { search = '', sort = '', order = '', filter = {} } = state;
  
    const { placeOfIssue, networkName } = filter;
    // Admin gets all data
    if (userRole === 1) {
      return getAllData({ searchTerm: search, sort, order, placeOfIssue, networkName });
    } else if (userRole === 2 && agencyId) {
      return getDataByAgency(agencyId);
    } else {
      return Promise.resolve({ data: [], count: 0 });
    }
  };
  
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
    const { response } = useQueryResponse()
    if (!response) {
      return []
    }

    return response?.data || []
  }

  const useQueryResponsePagination = () => {
    const defaultPaginationState: PaginationState = {
      links: [],
      ...initialQueryState,
    }

    const { response } = useQueryResponse()
    if (!response || !response.payload || !response.payload.pagination) {
      return defaultPaginationState
    }

    return response.payload.pagination
  }

  const useQueryResponseLoading = (): boolean => {
    const { isLoading } = useQueryResponse()
    return isLoading
  }

  export {
    QueryResponseProvider,
    useQueryResponse,
    useQueryResponseData,
    useQueryResponsePagination,
    useQueryResponseLoading,
  }
