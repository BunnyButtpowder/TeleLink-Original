import { useNavigate } from 'react-router-dom';
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
  const navigate= useNavigate()

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  useEffect(() => {
    if (userRole === 3) {
      navigate('/error/404');
    }
  }, [userRole, navigate])

  const fetchData = () => {
    const { search = '', sort = '', order = '', filter = {}, page = 1, items_per_page = 10 } = state;
  
    const { placeOfIssue, networkName } = filter;
    // Admin gets all data
    if (userRole === 1) {
      return getAllData({ searchTerm: search, sort, order, placeOfIssue, networkName, page, limit: items_per_page });
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
      ...initialQueryState
    }

    const { response } = useQueryResponse()
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
