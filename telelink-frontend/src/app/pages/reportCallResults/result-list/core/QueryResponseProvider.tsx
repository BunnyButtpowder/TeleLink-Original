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
import {getAllCallResults} from './_requests'
import {CallResult} from './_models'
import {useQueryRequest} from './QueryRequestProvider'
import { useAuth } from '../../../../../app/modules/auth'

const QueryResponseContext = createResponseContext<CallResult>(initialQueryResponse)
const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const { currentUser } = useAuth();
  const userRole = currentUser?.auth.role;
  const agencyID = currentUser?.agency?.id;
  const userId = currentUser?.id;
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  const fetchResults = () => {
    const { search = '', sort = '', order = '', filter = {} } = state;

    const { saleman, agencyId, result, date } = filter;
    // Admin gets all results
    if (userRole === 1) {
      return getAllCallResults({ saleman, agencyId, result, searchTerm: search, sort, order, date });
    } else if (userRole === 2) {
      return getAllCallResults({ saleman, agencyId: agencyID, result, searchTerm: search, sort, order, date });
    } else if (userRole === 3) {
      return getAllCallResults({ saleman: userId, agencyId: agencyID, result, searchTerm: search, sort, order, date });
    } else {
      return Promise.resolve({data: [], count: 0});
    }
  }

  const { isFetching, refetch, data: response} = useQuery(
    [`${QUERIES.USERS_LIST}-${updatedQuery}`, state.filter],
    fetchResults,
    {cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false}
  )

  return (
    <QueryResponseContext.Provider value={{isLoading: isFetching, refetch, response, query: updatedQuery}}>
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
  if (!response) {
    return defaultPaginationState
  }

  return response
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
