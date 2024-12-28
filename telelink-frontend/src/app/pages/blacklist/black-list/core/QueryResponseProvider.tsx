/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useState, useEffect, useMemo } from 'react'
import io from 'socket.io-client';
import Swal from 'sweetalert2';
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
import { getAllBlackList, getSalesmanBlacklist, getAgencyBlacklist } from './_requests'
import { Blacklist } from './_models'
import { useQueryRequest } from './QueryRequestProvider'
import { useAuth } from '../../../../../app/modules/auth'

const QueryResponseContext = createResponseContext<Blacklist>(initialQueryResponse)

const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const userRole = currentUser?.auth.role;
  const agencyId = currentUser?.agency?.id;
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  const fetchBlacklist = () => {
    const { search = '', sort = '', order = '' } = state;
  
    if (userRole === 1) {
      return getAllBlackList({ searchTerm: search, sort, order });
    } else if (userRole === 2 && agencyId) {
      return getAgencyBlacklist(agencyId, { searchTerm: search, sort, order });
    } else if (userRole === 3 && userId) {
      return getSalesmanBlacklist(userId, { searchTerm: search, sort, order });
    } else {
      // Undefined role gets empty data
      return Promise.resolve({ data: [] });
    }
  };
  

  const { isFetching, refetch, data: response } = useQuery(
    `${QUERIES.USERS_LIST}-${query}`,
    fetchBlacklist,
    { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false }
  )
  useEffect(() => {
    const socket = io('http://localhost:9999', {
      transports: ['websocket']
    });

    socket.on('connect', function() {
      console.log('WebSocket client connected1!');
      
    });
    
    socket.on('newblacklist', function() {
       console.log("hihi")
      refetch();
    });
    
    socket.on('disconnect', function() {
      console.log('WebSocket client disconnected');
    });
    socket.on('connect_error', function() {
      console.log('Connection error:', );
    });

    return () => {
      socket.disconnect();
    };
  }, [refetch]);

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
    ...initialQueryState,
  }

  const { response } = useQueryResponse()
  if (!response) {
    return defaultPaginationState
  }

  return response
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
